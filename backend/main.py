from fastapi import FastAPI

from routers import core

app = FastAPI()

app.include_router(core.core)


@app.get("/")
async def status():
    return {"message": "ok"}
