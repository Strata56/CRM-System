from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime

from models import Ticket
from schemas import TicketCreate


def create_ticket(db: Session, ticket: TicketCreate):

    ticket_count = db.query(Ticket).count()

    ticket_id = f"TKT-{ticket_count + 1:03d}"

    db_ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        status="Open"
    )   
    
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_tickets(db: Session, search=None, status=None):

    query = db.query(Ticket)

    if search:
        query = query.filter(
            or_(
                Ticket.ticket_id.contains(search),
                Ticket.customer_name.contains(search),
                Ticket.customer_email.contains(search),
                Ticket.description.contains(search)
            )
        )

    if status:
        query = query.filter(Ticket.status == status)
    return query.all()

def get_ticket_by_id(db: Session, ticket_id: str):
    return db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

def update_ticket_status(
    db: Session,
    ticket_id: str,
    status: str
):
    ticket = db.query(Ticket).filter(
        Ticket.ticket_id == ticket_id
    ).first()

    if not ticket:
        return None

    ticket.status = status

    db.commit()
    db.refresh(ticket)

    return ticket

def delete_ticket(db, ticket_id):
    ticket = get_ticket_by_id(db, ticket_id)

    if not ticket:
        return {"message": "Ticket not found"}

    db.delete(ticket)
    db.commit()

    return {"message": "Ticket deleted"}