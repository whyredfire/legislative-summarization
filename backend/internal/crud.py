from config import database
from models import users
from schemas import User


async def create_user(user: User) -> User:
    query = users.insert().values(name=user.name, email=user.email)
    user_id = await database.execute(query)
    return User(id=user_id, name=user.name, email=user.email)


async def get_user(user_id: int) -> User:
    query = users.select().where(users.c.id == user_id)
    result = await database.fetch_one(query)
    if result:
        return User(**result)
    return None


async def update_user(user_id: int, user: User) -> User:
    query = (
        users.update()
        .where(users.c.id == user_id)
        .values(name=user.name, email=user.email)
    )
    await database.execute(query)
    return User(id=user_id, name=user.name, email=user.email)


async def delete_user(user_id: int) -> bool:
    query = users.delete().where(users.c.id == user_id)
    result = await database.execute(query)
    return result > 0
