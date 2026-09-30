"""
Base generic repository implementation for SQLAlchemy.
Encapsulates common database queries, preventing raw DB sessions from leaking to routers.
"""

from typing import Generic, TypeVar, Type, Optional, List, Any
from sqlalchemy.orm import Session
from sqlalchemy import select

T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, db: Session, model_cls: Type[T]):
        self.db = db
        self.model_cls = model_cls

    def get_by_id(self, id_val: Any) -> Optional[T]:
        return self.db.query(self.model_cls).get(id_val)

    def list_all(self, skip: int = 0, limit: int = 100) -> List[T]:
        return self.db.query(self.model_cls).offset(skip).limit(limit).all()

    def add(self, entity: T) -> T:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, entity: T) -> T:
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def delete(self, entity: T) -> None:
        self.db.delete(entity)
        self.db.commit()
