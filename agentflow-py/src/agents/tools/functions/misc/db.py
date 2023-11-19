# db.py
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import select, update, delete
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import String, MetaData, Table, Column

DATABASE_URL = "postgresql+asyncpg://<username>:<password>@<host>/<database>"

engine = create_async_engine(DATABASE_URL, echo=True)

metadata = MetaData()

docs = Table(
    'docs', metadata,
    Column('id', String, primary_key=True),
    Column('data', JSONB)
)


async def create_file(id: str, data: dict):
    async with AsyncSession(engine) as session:
        stmt = insert(docs).values(id=id, data=data)
        await session.execute(stmt)
        await session.commit()


async def read_file(id: str):
    async with AsyncSession(engine) as session:
        stmt = select(docs).where(docs.c.id == id)
        result = await session.execute(stmt)
        file_data = result.fetchone()  # Adjusted to fetch one full row

        if file_data:
            if hasattr(file_data, 'data'):
                return file_data
            else:
                return None
        else:
            return None


async def update_file(id: str, data: dict):
    async with AsyncSession(engine) as session:
        stmt = update(docs).where(docs.c.id == id).values(data=data)
        await session.execute(stmt)
        await session.commit()


async def delete_file(id: str):
    async with AsyncSession(engine) as session:
        stmt = delete(docs).where(docs.c.id == id)
        await session.execute(stmt)
        await session.commit()
