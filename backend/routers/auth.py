from typing import Annotated
from fastapi import APIRouter, Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from config import database

import hashlib

auth = APIRouter(prefix="/auth", tags=["auth"])


def hashed_password(password: str):
    salt = "legislative-summarization"
    password = salt + password

    return hashlib.md5(password.encode()).hexdigest()


@auth.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user_data = get_user(form_data.username)
    if not user_data:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
