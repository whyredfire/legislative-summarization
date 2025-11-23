from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from internal.utils import abstractive_summary, extractive_summary

core = APIRouter(prefix="/api/summary", tags=["core"])


class raw_text(BaseModel):
    text: str
    summary_ratio: float | float = 0.3


@core.post("/extractive")
async def extractive_summary_gen(inputs: raw_text):
    if not inputs.text:
        raise HTTPException(status_code=422, detail={"message": "Missing input text."})

    summary = extractive_summary(inputs.text)
    response = {"summary": summary}
    return response


@core.post("/abstractive")
def abstractive_summary_gen(inputs: raw_text):
    if not inputs.text:
        raise HTTPException(status_code=422, detail={"message": "Missing input text."})

    summary = abstractive_summary(inputs.text)
    response = {"summary": summary}
    return response
