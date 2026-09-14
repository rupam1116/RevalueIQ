import pytest
import app.db.mongo as mongo_mod


@pytest.fixture(autouse=True)
def reset_mongo_globals():
    """Reset MongoDB client global state before and after each test for asyncio loop isolation."""
    mongo_mod._mongo_client = None
    mongo_mod._mongo_db = None
    yield
    mongo_mod._mongo_client = None
    mongo_mod._mongo_db = None


@pytest.mark.asyncio
async def test_mongo_client_reuse():
    """Verify MongoDB client returns a singleton reused instance."""
    client1 = mongo_mod.get_mongo_client()
    client2 = mongo_mod.get_mongo_client()
    assert client1 is client2


@pytest.mark.asyncio
async def test_mongo_connection_lifecycle():
    """Verify connect_to_mongo and close_mongo_connection lifecycle functions."""
    await mongo_mod.connect_to_mongo()
    db = mongo_mod.get_database()
    assert db is not None
    await mongo_mod.close_mongo_connection()


@pytest.mark.asyncio
async def test_check_database_connection_returns_bool():
    """Verify check_database_connection executes safely and returns boolean."""
    is_connected = await mongo_mod.check_database_connection()
    assert isinstance(is_connected, bool)
