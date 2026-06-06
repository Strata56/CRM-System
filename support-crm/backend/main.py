from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base, SessionLocal
import models
import crud
import schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CRM API")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {
        "message": "CRM Running"
    }

@app.post("/api/tickets")
def create_ticket(
    ticket: schemas.TicketCreate,
    db: Session = Depends(get_db)
):
    return crud.create_ticket(db, ticket)

@app.get("/api/tickets")
def get_tickets(
    search: str = None,
    status: str = None,
    db: Session = Depends(get_db)
):
    return crud.get_tickets(db, search, status)

@app.get("/api/tickets/{ticket_id}")
def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db)
):
    return crud.get_ticket_by_id(db, ticket_id)

@app.put("/api/tickets/{ticket_id}")
def update_ticket(
    ticket_id: str,
    ticket_update: schemas.TicketUpdate,
    db: Session = Depends(get_db)
):
    return crud.update_ticket_status(db, ticket_id, 
        ticket_update.status)

@app.delete("/api/tickets/{ticket_id}")
def delete_ticket(
    ticket_id: str, 
    db: Session = Depends(get_db)
):
    return crud.delete_ticket(db, ticket_id)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)