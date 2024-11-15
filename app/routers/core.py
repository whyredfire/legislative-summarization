from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel

from internal.utils import extractive_summary

core = APIRouter(
    prefix="/api",
    tags=["core"],
)


class raw_text(BaseModel):
    text: str
    summary_ratio: int


@core.post("/summary")
async def get_summary(inputs: raw_text):
    if not inputs.text:
        raise HTTPException(status_code=422, detail="Missing input text.")

    return extractive_summary(inputs.text, inputs.summary_ratio)
