# backend/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1) строка подключения к SQLite-файлу
DATABASE_URL = "sqlite:///./jobs.db"

# 2) создаём движок
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3) фабрика сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4) базовый класс для моделей
Base = declarative_base()
