from logging.config import fileConfig
import os
import sys

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import create_engine

# --- добавляем корень backend в sys.path ---
# env.py находится в backend/migrations, значит backend на уровень выше
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

# Теперь можно импортировать db и models
from db import Base, engine  # ВАЖНО: в db.py должны быть Base и engine
import models  # импортируем, чтобы Alembic "увидел" все модели

# Alembic Config object
config = context.config

# Логирование
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Метаданные моделей для автогенерации
target_metadata = Base.metadata

# URL БД берём из engine
SQLALCHEMY_DATABASE_URL = str(engine.url)


def run_migrations_offline() -> None:
    """Запуск миграций в 'offline' режиме."""
    url = SQLALCHEMY_DATABASE_URL

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Запуск миграций в 'online' режиме."""
    # можно использовать уже созданный engine из db.py,
    # но Alembic по дефолту предпочитает свой engine — оставим так:
    connectable = create_engine(
        SQLALCHEMY_DATABASE_URL,
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
