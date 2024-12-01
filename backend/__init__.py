from pymongo import MongoClient
import os

host = os.environ["MONGO_HOST", "localhost"]
port = os.environ["MONGO_PORT", "27017"]
connection_string = f"mongodb://{host}:{port}"

client = MongoClient(connection_string)
collection = client.legislative_summarization
