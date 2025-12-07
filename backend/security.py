# backend/security.py
from datetime import datetime, timedelta
import hashlib

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from db import SessionLocal
from models import User, Role

# ---------------- JWT настройки ----------------

SECRET_KEY = "MY_SUPER_SECRET_KEY_12345"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Этот URL должен совпадать с путём получения токена в main.py
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


# ---------------- Подключение к БД ----------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- Пароли ----------------

def get_password_hash(password: str) -> str:
    # по заданию md5/sha256 — используем sha256
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password


# ---------------- Создание токена ----------------

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Создаёт JWT. ВАЖНО: sub приводим к строке, как требует стандарт.
    """
    to_encode = data.copy()

    # sub в JWT должен быть строкой
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])

    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print("[SECURITY] CREATED TOKEN PAYLOAD:", to_encode)
    print("[SECURITY] CREATED TOKEN:", token)
    return token


# ---------------- Текущий пользователь ----------------

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    print("[SECURITY] get_current_user CALLED")
    print("[SECURITY] RAW TOKEN:", token)

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # 🔹 ОТКЛЮЧАЕМ проверку типа sub, чтобы старые токены не падали
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"verify_sub": False},
        )

        print("[SECURITY] DECODED PAYLOAD:", payload)

        user_id = payload.get("sub")
        if user_id is None:
            print("[SECURITY] NO sub IN PAYLOAD")
            raise credentials_exception

        # приведём к int независимо от того, пришло '1' или 1
        user_id = int(user_id)

    except JWTError as e:
        print("[SECURITY] JWT ERROR:", e)
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        print("[SECURITY] USER NOT FOUND, id =", user_id)
        raise credentials_exception

    return user


def get_current_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """
    Проверяем, что у пользователя роль admin.
    """
    role = db.query(Role).filter(Role.id == current_user.role_id).first()
    if not role or role.name != "admin":
        raise HTTPException(status_code=403, detail="Доступ только для администраторов")

    return current_user
