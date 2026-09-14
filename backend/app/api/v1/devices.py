import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.asynchronous.database import AsyncDatabase
from bson import ObjectId

from app.api.deps import get_db, get_current_user, AuthenticatedUser
from app.schemas.devices import DeviceCreate, DeviceUpdate, DeviceResponse
from app.services.device_service import (
    list_user_devices,
    create_user_device,
    get_user_device,
    update_user_device,
    delete_user_device,
)

logger = logging.getLogger("revalueiq.api.devices")

router = APIRouter(prefix="/users/me/devices", tags=["User Devices"])


@router.get(
    "",
    response_model=List[DeviceResponse],
    summary="List Authenticated User Devices",
    description="Retrieves all electronic devices registered by the authenticated user."
)
async def list_devices(
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> List[DeviceResponse]:
    """
    Protected endpoint: GET /api/v1/users/me/devices
    """
    try:
        user_id = ObjectId(current_user.id)
        devices = await list_user_devices(db, user_id)
        return [DeviceResponse(**d) for d in devices]
    except Exception as exc:
        logger.error(f"Failed to list devices for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load your registered devices."
        )


@router.post(
    "",
    response_model=DeviceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New Device",
    description="Registers a new electronic device under the authenticated user's account."
)
async def create_device(
    body: DeviceCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> DeviceResponse:
    """
    Protected endpoint: POST /api/v1/users/me/devices
    """
    try:
        user_id = ObjectId(current_user.id)
        device_dict = body.model_dump()
        created_device = await create_user_device(db, user_id, device_dict)
        return DeviceResponse(**created_device)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to create device for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to add the device. Please try again."
        )


@router.get(
    "/{device_id}",
    response_model=DeviceResponse,
    summary="Get Specific User Device",
    description="Retrieves details for a specific device. Enforces strict ownership checks."
)
async def get_device(
    device_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> DeviceResponse:
    """
    Protected endpoint: GET /api/v1/users/me/devices/{device_id}
    """
    user_id = ObjectId(current_user.id)
    device = await get_user_device(db, user_id, device_id)
    if not device:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found."
        )
    return DeviceResponse(**device)


@router.patch(
    "/{device_id}",
    response_model=DeviceResponse,
    summary="Update User Device",
    description="Updates information for a specific device owned by the authenticated user."
)
async def update_device(
    device_id: str,
    body: DeviceUpdate,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
) -> DeviceResponse:
    """
    Protected endpoint: PATCH /api/v1/users/me/devices/{device_id}
    """
    try:
        user_id = ObjectId(current_user.id)
        update_dict = body.model_dump(exclude_unset=True)
        updated_device = await update_user_device(db, user_id, device_id, update_dict)
        if not updated_device:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found."
            )
        return DeviceResponse(**updated_device)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to update device {device_id} for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to update the device. Please try again."
        )


@router.delete(
    "/{device_id}",
    summary="Delete User Device",
    description="Removes a device from the authenticated user's portfolio."
)
async def delete_device(
    device_id: str,
    current_user: AuthenticatedUser = Depends(get_current_user),
    db: AsyncDatabase = Depends(get_db)
):
    """
    Protected endpoint: DELETE /api/v1/users/me/devices/{device_id}
    """
    try:
        user_id = ObjectId(current_user.id)
        deleted = await delete_user_device(db, user_id, device_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Device not found."
            )
        return {"message": "Device deleted successfully."}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Failed to delete device {device_id} for user_id={current_user.id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to delete the device. Please try again."
        )
