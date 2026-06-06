from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime,UTC

from database import Base
    

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True)
    customer_name = Column(String)
    customer_email = Column(String)
    subject = Column(String)
    description = Column(Text)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime, default=lambda: datetime.now(UTC))