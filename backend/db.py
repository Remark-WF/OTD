from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# База данных SQLite (файл site.db в папке backend)
DATABASE_URL = "sqlite:///./site.db"

# Для SQLite лучше добавить connect_args
engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False},  
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
