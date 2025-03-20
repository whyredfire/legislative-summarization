from fastapi import APIRouter, HTTPException, File, UploadFile

from internal.utils import extractive_summary, abstractive_summary
from schemas import raw_text

core = APIRouter(
    prefix="/api",
    tags=["core"],
)


@core.post("/extractive_summary")
async def extractive_summary_gen(inputs: raw_text):
    if not inputs.text:
        raise HTTPException(status_code=422, detail="Missing input text.")

    summary = extractive_summary(inputs.text)
    response = {"summary": summary}
    return response


@core.post("/abstractive_summary")
async def abstractive_summary_gen(inputs: raw_text):
    if not inputs.text:
        raise HTTPException(status_code=422, detail="Missing input text.")

    summary = abstractive_summary(inputs.text)
    response = {"summary": summary}
    return response
