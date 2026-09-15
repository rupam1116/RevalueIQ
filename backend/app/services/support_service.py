import logging
from datetime import datetime, timezone
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

from app.schemas.settings import SupportTicketCreateRequest, SupportTicketResponse

logger = logging.getLogger("revalueiq.services.support")


async def create_support_ticket(
    db: AsyncDatabase,
    user_id: ObjectId,
    user_email: str,
    ticket_in: SupportTicketCreateRequest
) -> SupportTicketResponse:
    now = datetime.now(timezone.utc)
    doc = {
        "user_id": user_id,
        "user_email": user_email,
        "type": ticket_in.type.lower(),
        "subject": ticket_in.subject.strip(),
        "details": ticket_in.details.strip(),
        "status": "open",
        "created_at": now,
        "updated_at": now,
    }
    result = await db.support_tickets.insert_one(doc)
    doc["_id"] = result.inserted_id
    logger.info(f"Support ticket created id={result.inserted_id} for user_id={user_id}")

    return SupportTicketResponse(
        id=str(doc["_id"]),
        user_id=str(user_id),
        type=doc["type"],
        subject=doc["subject"],
        details=doc["details"],
        status=doc["status"],
        created_at=doc["created_at"],
    )
