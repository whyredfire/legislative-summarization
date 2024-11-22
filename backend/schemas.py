from pydantic import BaseModel


class raw_text(BaseModel):
    text: str
    summary_ratio: int | int = 0.3
