# backend/seed_roles.py
from db import SessionLocal
import models

db = SessionLocal()

try:
    # проверить, есть ли уже роли
    user_role = db.query(models.Role).filter(models.Role.name == "user").first()
    admin_role = db.query(models.Role).filter(models.Role.name == "admin").first()

    if not user_role:
        db.add(models.Role(name="user"))
        print("Добавлена роль: user")

    if not admin_role:
        db.add(models.Role(name="admin"))
        print("Добавлена роль: admin")

    db.commit()
    print("Готово, роли сохранены в БД.")
finally:
    db.close()