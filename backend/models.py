from sqlalchemy import Column, Integer, String, Table, MetaData

metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("username", String(50)),
    Column("password", String(30), unique=True),
)
