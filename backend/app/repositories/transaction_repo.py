from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models.transaction import Transaction
from backend.app.repositories.base import BaseRepository


class TransactionRepository(BaseRepository[Transaction]):
    def __init__(self, db: Session):
        super().__init__(db, Transaction)

    def get_by_complaint_id(self, complaint_id: str) -> List[Transaction]:
        return (
            self.db.query(Transaction)
            .filter(Transaction.complaint_id == complaint_id)
            .order_by(Transaction.timestamp.asc())
            .all()
        )

    def get_by_account(self, account_number: str) -> List[Transaction]:
        return (
            self.db.query(Transaction)
            .filter(
                (Transaction.sender_account == account_number)
                | (Transaction.receiver_account == account_number)
            )
            .order_by(Transaction.timestamp.desc())
            .all()
        )

    def add_bulk(self, transactions: List[Transaction]) -> List[Transaction]:
        self.db.add_all(transactions)
        self.db.commit()
        return transactions
