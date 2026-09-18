import logging
from typing import Optional
import certifi

try:
    import dns.resolver
    _res = dns.resolver.Resolver()
    _res.nameservers = ['8.8.8.8', '1.1.1.1', '8.8.4.4']
    dns.resolver.default_resolver = _res
except Exception:
    pass

from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from app.core.config import settings
from app.db.indexes import create_mongo_indexes


logger = logging.getLogger("revalueiq.db")

_mongo_client: Optional[AsyncMongoClient] = None
_mongo_db: Optional[AsyncDatabase] = None


def _get_safe_mongo_host(uri: str) -> str:
    """Extracts only host/domain part from connection URI without exposing user/password credentials."""
    try:
        if "@" in uri:
            return uri.split("@")[-1].split("/")[0].split("?")[0]
        return "configured-host"
    except Exception:
        return "configured-host"


async def connect_to_mongo() -> None:
    """Initializes the singleton PyMongo AsyncMongoClient instance during application startup."""
    global _mongo_client, _mongo_db
    if _mongo_client is not None:
        try:
            await _mongo_client.aclose()
        except Exception:
            pass
        _mongo_client = None
        _mongo_db = None

    safe_host = _get_safe_mongo_host(settings.MONGODB_URI)
    logger.info(f"Connecting to MongoDB host '{safe_host}' at database '{settings.MONGODB_DATABASE_NAME}'...")
    _mongo_client = AsyncMongoClient(
        settings.MONGODB_URI,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        maxPoolSize=50,
        minPoolSize=5,
        tlsCAFile=certifi.where()
    )
    _mongo_db = _mongo_client[settings.MONGODB_DATABASE_NAME]


async def close_mongo_connection() -> None:
    """Closes the AsyncMongoClient connection gracefully during application shutdown."""
    global _mongo_client, _mongo_db
    if _mongo_client is not None:
        logger.info("Closing MongoDB client connection...")
        try:
            await _mongo_client.aclose()
        except Exception:
            pass
        finally:
            _mongo_client = None
            _mongo_db = None
            logger.info("MongoDB client connection closed cleanly.")


def get_mongo_client() -> AsyncMongoClient:
    """Returns the singleton PyMongo AsyncMongoClient instance."""
    global _mongo_client
    if _mongo_client is None:
        _mongo_client = AsyncMongoClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000,
            maxPoolSize=50,
            minPoolSize=5,
            tlsCAFile=certifi.where()
        )
    return _mongo_client


def get_database() -> AsyncDatabase:
    """Returns the active PyMongo AsyncDatabase handle."""
    global _mongo_db
    if _mongo_db is None:
        client = get_mongo_client()
        _mongo_db = client[settings.MONGODB_DATABASE_NAME]
    return _mongo_db


async def get_db() -> AsyncDatabase:
    """FastAPI Dependency Injection for MongoDB database handle."""
    return get_database()


async def check_database_connection() -> bool:
    """Executes a real MongoDB ping command to verify live database connectivity."""
    global _mongo_client, _mongo_db
    try:
        client = get_mongo_client()
        await client.admin.command('ping')
        return True
    except Exception as e:
        safe_host = _get_safe_mongo_host(settings.MONGODB_URI)
        logger.warning(f"MongoDB health ping failed for host '{safe_host}': {e}")
        # Reset client on failure so subsequent attempts try a fresh connection
        try:
            if _mongo_client is not None:
                await _mongo_client.aclose()
        except Exception:
            pass
        _mongo_client = None
        _mongo_db = None
        return False


async def init_mongo_indexes() -> None:
    """Initializes all approved database indexes."""
    try:
        db = get_database()
        await create_mongo_indexes(db)
    except Exception as exc:
        safe_host = _get_safe_mongo_host(settings.MONGODB_URI)
        logger.warning(f"Note: MongoDB index initialization notice for host '{safe_host}': {exc}")
