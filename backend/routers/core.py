from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel

from internal.utils import extractive_summary

core = APIRouter(
    prefix="/api",
    tags=["core"],
)


class raw_text(BaseModel):
    text: str
    summary_ratio: int | int = 0.3


@core.post("/summary")
async def get_summary(inputs: raw_text):
    if not inputs.text:
        raise HTTPException(status_code=422, detail="Missing input text.")

    summary = extractive_summary(inputs.text)
    response = {"data": {"summary": summary, "summary_ratio": inputs.summary_ratio}}
    return response
