# db.py
from sqlalchemy import String, create_engine, MetaData, Table, Column, Integer, JSON
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.sql import select, update, delete
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import JSONB

DATABASE_URL = "postgresql+asyncpg://postgres:root@localhost/postgres"

engine = create_async_engine(DATABASE_URL, echo=True)

metadata = MetaData()

profiles = Table(
    'profiles', metadata,
    Column('email', String, primary_key=True),
    Column('data', JSONB)
)


async def create_profile(email: str, data: dict):
    async with AsyncSession(engine) as session:
        stmt = insert(profiles).values(email=email, data=data)
        await session.execute(stmt)
        await session.commit()


async def read_profile(email: str):
    async with AsyncSession(engine) as session:
        stmt = select(profiles).where(profiles.c.email == email)
        result = await session.execute(stmt)
        profile = result.fetchone()  # Adjusted to fetch one full row

        if profile:
            if hasattr(profile, 'data'):
                return profile
            else:
                return None
        else:
            return None


async def update_profile(email: str, data: dict):
    async with AsyncSession(engine) as session:
        stmt = update(profiles).where(
            profiles.c.email == email).values(data=data)
        await session.execute(stmt)
        await session.commit()


async def delete_profile(email: str):
    async with AsyncSession(engine) as session:
        stmt = delete(profiles).where(profiles.c.email == email)
        await session.execute(stmt)
        await session.commit()
