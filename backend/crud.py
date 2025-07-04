# backend/crud.py

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User, Job
from schemas import UserCreate, JobCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ----- User CRUD -----
def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user(db: Session, user_id: int):
    return db.query(User).get(user_id)

def create_user(db: Session, user: UserCreate):
    hashed = pwd_context.hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ----- Job CRUD -----
def get_jobs(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(Job)
          .filter(Job.owner_id == user_id)
          .offset(skip)
          .limit(limit)
          .all()
    )

def get_job(db: Session, job_id: int):
    return db.query(Job).get(job_id)

def create_job(db: Session, job: JobCreate, user_id: int):
    db_job = Job(**job.dict(), owner_id=user_id)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def update_job(db: Session, job_id: int, job_data: JobCreate):
    db_job = db.query(Job).get(job_id)
    for key, value in job_data.dict(exclude_unset=True).items():
        setattr(db_job, key, value)
    db.commit()
    db.refresh(db_job)
    return db_job

def delete_job(db: Session, job_id: int):
    db_job = db.query(Job).get(job_id)
    db.delete(db_job)
    db.commit()
    return db_job
