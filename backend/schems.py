from pydantic import BaseModel
from pydantic import EmailStr

# ---------- Страницы ---------- #
class PageCreate(BaseModel):
    name: str

class PageOut(BaseModel):
    id: int
    name: str 

    class Config():
        from_attributes = True

# ---------- KPI ---------- #
class TimeSpentIn(BaseModel):
    time_spent: float

class KpiOut(BaseModel):
    page_id: int
    page_name:str
    visits: int
    total_time: float
    
    class Config:
        from_attributes = True

# ---------- Пользователи / авторизация ----------

class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ArticleOut(BaseModel):
    id: int
    title: str
    url: str
    source: str | None = None
    description: str | None = None