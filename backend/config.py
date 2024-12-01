from fastapi import FastAPI
from databases import Database

DATABASE_URL = "mysql+aiomysql://root:root@127.0.0.1:3306/legislative_summarization"
database = Database(DATABASE_URL)

app = FastAPI()


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/")
async def read_root():
    query = "SELECT 'FastAPI is connected to MySQL' AS message"
    result = await database.fetch_one(query=query)
    return {"message": result["message"]}
