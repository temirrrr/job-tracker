# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta

import crud, models, schemas
from database import SessionLocal, engine

# создаём таблицы
models.Base.metadata.create_all(bind=engine)

# CORS — разрешаем только свой фронтенд и локалхост
origins = [
    "https://temirrrr.github.io",    # GitHub Pages без пути /job-tracker
    "http://localhost:5173",         # Vite dev server
]

app = FastAPI(title="Job Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # конкретные origin
    allow_credentials=True,
    allow_methods=["*"],         # все методы
    allow_headers=["*"],         # все заголовки
)

# JWT-настройки
SECRET_KEY = "changeme-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Зависимость: подключение к БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Зависимость: извлечь пользователя из токена
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = crud.get_user(db, user_id)
    if user is None:
        raise credentials_exception
    return user

# Регистрация
@app.post("/register", response_model=schemas.UserOut)
def register(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    if crud.get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user)

# Логин, выдача токена
@app.post("/token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not crud.pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = jwt.encode(
        {
            "sub": str(user.id),
            "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        },
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": access_token, "token_type": "bearer"}

# CRUD вакансий
@app.post("/jobs/", response_model=schemas.Job)
def create_job_for_user(
    job: schemas.JobCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_job(db, job, current_user.id)

@app.get("/jobs/", response_model=list[schemas.Job])
def read_jobs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_jobs(db, user_id=current_user.id, skip=skip, limit=limit)

@app.get("/jobs/{job_id}", response_model=schemas.Job)
def read_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_job = crud.get_job(db, job_id)
    if not db_job or db_job.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job

@app.put("/jobs/{job_id}", response_model=schemas.Job)
def update_job(
    job_id: int,
    job: schemas.JobCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_job = crud.get_job(db, job_id)
    if not db_job or db_job.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    return crud.update_job(db, job_id, job)

@app.delete("/jobs/{job_id}", response_model=schemas.Job)
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_job = crud.get_job(db, job_id)
    if not db_job or db_job.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found")
    return crud.delete_job(db, job_id)
