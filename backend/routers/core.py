from fastapi import APIRouter, HTTPException, File, UploadFile

from internal.utils import extractive_summary
from schemas import raw_text

core = APIRouter(
    prefix="/api",
    tags=["core"],
)


@core.post("/summary")
async def get_summary(inputs: raw_text):
    if not inputs.text:
        raise HTTPException(status_code=422, detail="Missing input text.")

    summary = extractive_summary(inputs.text)
    response = {"data": {"summary": summary, "summary_ratio": inputs.summary_ratio}}
    return response
