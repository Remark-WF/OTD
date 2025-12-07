# backend/main.py
from fastapi import FastAPI, Depends, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import os
import io

from fastapi.openapi.utils import get_openapi

from db import SessionLocal
from models import Role, User, Page, Kpi
from articles_data import ARTICLES

import models
import schems
from security import (
    get_db,
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    get_current_admin,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

from PIL import Image, ImageOps

print("WORKDIR:", os.getcwd())

# ---------------------------------------------------------------------
# FASTAPI app
# ---------------------------------------------------------------------

app = FastAPI(title="Pages KPI API", version="1.0.0")


def init_data():
    db = SessionLocal()
    try:
        # ----- ИНИЦИАЛИЗАЦИЯ РОЛЕЙ -----
        roles = {"user", "admin"}
        for role_name in roles:
            if not db.query(Role).filter(Role.name == role_name).first():
                db.add(Role(name=role_name))
        db.commit()

        # ----- ИНИЦИАЛИЗАЦИЯ СТРАНИЦ -----
        default_pages = [
            "intro",
            "conclusion",
            "main",
            "posts",
            "api",
            "image",
        ]

        for page_name in default_pages:
            page = db.query(Page).filter(Page.name == page_name).first()
            if not page:
                page = Page(name=page_name)
                db.add(page)
                db.flush()  # чтобы получить id

                # KPI для страницы
                db.add(Kpi(page_id=page.id, cnt_visits=0, total_time=0.0))

        db.commit()

        # ----- ИНИЦИАЛИЗАЦИЯ АДМИНА -----
        # создаётся только если его нет
        admin = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin:
            admin_role = db.query(Role).filter(Role.name == "admin").first()
            admin = User(
                email="admin@example.com",
                password_hash=get_password_hash("admin"),
                role_id=admin_role.id,
            )
            db.add(admin)
            db.commit()

    finally:
        db.close()


# ВЫЗОВ ИНИЦИАЛИЗАЦИИ ПРИ СТАРТЕ СЕРВЕРА
init_data()

# ---------------------------------------------------------------------
# CORS (разрешение фронту)
# ---------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Authorization"],
)

# ---------------------------------------------------------------------
# AUTH endpoints
# ---------------------------------------------------------------------


@app.post("/auth/register", response_model=schems.UserOut)
def register_user(user_in: schems.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=400, detail="Пользователь с таким email уже существует"
        )

    role_user = db.query(models.Role).filter(models.Role.name == "user").first()
    if not role_user:
        raise HTTPException(status_code=500, detail="Роль 'user' не найдена")

    hashed_password = get_password_hash(user_in.password)

    user = models.User(
        email=user_in.email,
        password_hash=hashed_password,
        role_id=role_user.id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return schems.UserOut(id=user.id, email=user.email, role=user.role.name)


@app.post("/auth/token", response_model=schems.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    # OAuth2PasswordRequestForm ждёт "username" и "password"
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user.id,
            "email": user.email,
            "role": user.role.name,
        },
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}


# ---------------------------------------------------------------------
# ENDPOINTS
# ---------------------------------------------------------------------


@app.get("/health")
def health():
    return {"status": "ok"}


# ---- Статьи вместо JSONPlaceholder ----


@app.get("/posts", response_model=List[schems.ArticleOut])
async def posts(
    limit: int | None = None,
    current_user: models.User = Depends(get_current_user),
):
    """
    Возвращает список статей (реальные ссылки), эндпоинт защищён JWT.
    Если передан ?limit=, режем список.
    """
    items = ARTICLES if limit is None else ARTICLES[:limit]
    return items


# ---- Инвертер изображений ----


@app.post("/invert-image", response_class=Response)
async def invert_image(
    file: UploadFile = File(...), current_user: models.User = Depends(get_current_user)
):
    try:
        raw = await file.read()
        img = Image.open(io.BytesIO(raw))
        if img.mode in ("RGBA", "LA"):
            rgb = img.convert("RGB")
            inv = ImageOps.invert(rgb)
            alpha = img.split()[-1]
            inv = Image.merge("RGBA", (*inv.split(), alpha))
        else:
            inv = ImageOps.invert(img.convert("RGB"))
        buf = io.BytesIO()
        inv.save(buf, format="PNG")
        buf.seek(0)
        return Response(content=buf.read(), media_type="image/png")
    except Exception as e:
        raise HTTPException(400, detail=f"Bad image: {e}")


# ---- Страницы и KPI ----


@app.post("/pages", response_model=schems.PageOut)
def create_pages(
    page_in: schems.PageCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(models.Page).filter(models.Page.name == page_in.name).first()
    if existing:
        raise HTTPException(
            status_code=400, detail="Страница с таким именем уже существует"
        )

    page = models.Page(name=page_in.name)
    db.add(page)
    db.flush()

    kpi = models.Kpi(page_id=page.id, cnt_visits=0, total_time=0.0)
    db.add(kpi)

    db.commit()
    db.refresh(page)
    return page


@app.get("/pages/{page_id}", response_model=schems.PageOut)
def get_page(
    page_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    page = db.query(models.Page).filter(models.Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Страница не найдена")
    return page


@app.post("/pages/{page_id}/time")
def update_page_time(
    page_id: int,
    payload: schems.TimeSpentIn,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    kpi = db.query(models.Kpi).filter(models.Kpi.page_id == page_id).first()
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI для этой страницы не найден")

    kpi.cnt_visits += 1
    kpi.total_time += payload.time_spent
    db.commit()
    return {"status": "ok"}


@app.get("/kpi", response_model=List[schems.KpiOut])
def get_all_kpi(
    current_admin: models.User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(
            models.Page.id.label("page_id"),
            models.Page.name.label("page_name"),
            models.Kpi.cnt_visits,
            models.Kpi.total_time,
        )
        .join(models.Kpi, models.Kpi.page_id == models.Page.id)
        .all()
    )
    return [
        {
            "page_id": row.page_id,
            "page_name": row.page_name,
            "visits": row.cnt_visits,
            "total_time": row.total_time,
        }
        for row in rows
    ]


# ---------------------------------------------------------------------
# CUSTOM OPENAPI — ДАЁТ КНОПКУ AUTHORIZE В SWAGGER
# ---------------------------------------------------------------------


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Pages KPI API",
        version="1.0.0",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    openapi_schema["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
