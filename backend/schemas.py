from pydantic import BaseModel


class raw_text(BaseModel):
    text: str
    summary_ratio: int | int = 0.3


class User(BaseModel):
    id: int | None = None
    username: str
    password: str
