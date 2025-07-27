from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import core


@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup
    import nltk

    nltk.download("punkt")
    nltk.download("stopwords")
    nltk.download("punkt_tab")

    yield
    # On shutdown


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def validation_exception_handler(exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content=jsonable_encoder(exc.detail))


app.include_router(core.core)


@app.get("/")
async def status():
    return {"message": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
