import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.app.core.config import settings

logger = logging.getLogger("cybertrace.db")

Base = declarative_base()

def get_engine():
    # Attempt connecting to primary PostgreSQL database
    try:
        db_url = settings.DATABASE_URL
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)

        is_postgres = "postgresql" in db_url
        connect_args = {}
        if is_postgres:
            connect_args["connect_timeout"] = 15
            if "sslmode=" not in db_url and "localhost" not in db_url and "127.0.0.1" not in db_url:
                connect_args["sslmode"] = "require"

        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=300,
            connect_args=connect_args,
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
