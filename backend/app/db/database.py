import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings

logger = logging.getLogger("cybertrace.db")

Base = declarative_base()

def get_engine():
    # Attempt connecting to primary PostgreSQL database
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 3} if "postgresql" in settings.DATABASE_URL else {}
        )
        # Test connection
        with engine.connect() as conn:
            logger.info("Successfully connected to primary PostgreSQL database.")
            return engine
    except Exception as e:
        logger.warning(
            f"Primary PostgreSQL connection failed ({e}). Falling back to SQLite database at {settings.SQLITE_FALLBACK_URL}."
        )
        return create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False},
        )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
