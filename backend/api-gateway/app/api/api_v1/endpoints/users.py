from typing import Any
from fastapi import APIRouter, Body, Depends, HTTPException
from motor.core import AgnosticDatabase
from pydantic import EmailStr

from app.api import deps
from app import crud, schemas, models


router = APIRouter()


@router.post("/", response_model=schemas.User)
async def create_user_profile(
    *,
    db: AgnosticDatabase = Depends(deps.get_db),
    password: str = Body(...),
    email: EmailStr = Body(...),
    display_name: str = Body("")
) -> Any:
    user = await crud.user.get_by_email(db, email=email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="This email is not available."
        )

    user_in = schemas.UserCreate(password=password, email=email, display_name=display_name)
    user = await crud.user.create(db, obj_in=user_in)
    return user


@router.get("/me", response_model=schemas.User)
async def read_user(
    *,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user