import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [tickets, setTickets] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    loadTickets();
  }, [search, statusFilter]);

  const loadTickets = async () => {
    try {
      const response = await api.get("/tickets", {
        params: {
          search: search || undefined,
          status: statusFilter || undefined,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tickets", {
        customer_name: customerName,
        customer_email: customerEmail,
        subject: subject,
        description: description,
      });

      setCustomerName("");
      setCustomerEmail("");
      setSubject("");
      setDescription("");

      loadTickets();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tickets/${id}`, {
        status: status,
      });

      loadTickets();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const openCount = tickets.filter(
    (t) => t.status?.toLowerCase() === "open"
  ).length;

  const inProgressCount = tickets.filter(
    (t) =>
      t.status?.toLowerCase() === "processing" ||
      t.status?.toLowerCase() === "in_progress"
  ).length;

  const closedCount = tickets.filter(
    (t) => t.status?.toLowerCase() === "closed"
  ).length;

  const deleteTicket = async (id) => {
    try {
      await api.delete(`/tickets/${id}`);
      loadTickets();
    } catch (error) {
      console.error("Failed to delete ticket:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-5 min-h-screen">
        <h1 className="text-2xl font-bold mb-8">
          CRM System
        </h1>

        <nav className="space-y-3">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full text-left p-3 rounded ${
              activePage === "dashboard"
                ? "bg-blue-600"
                : "hover:bg-gray-800"
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActivePage("create")}
            className={`w-full text-left p-3 rounded ${
              activePage === "create"
                ? "bg-blue-600"
                : "hover:bg-gray-800"
            }`}
          >
            Create Ticket
          </button>

          <button
            onClick={() => setActivePage("tickets")}
            className={`w-full text-left p-3 rounded ${
              activePage === "tickets"
                ? "bg-blue-600"
                : "hover:bg-gray-800"
            }`}
          >
            View Tickets
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">

        {/* Create Ticket Page */}
        {activePage === "create" && (
          <form
            onSubmit={createTicket}
            className="bg-white p-4 rounded-lg shadow mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              Create Ticket
            </h2>

            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border rounded p-2 mb-3"
              required
            />

            <input
              type="email"
              placeholder="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border rounded p-2 mb-3"
              required
            />

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border rounded p-2 mb-3"
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2 mb-3"
              rows="3"
              required
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create Ticket
            </button>
          </form>
        )}

        {/* Dashboard Page — title + stats cards only */}
        {activePage === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-6">
              CRM Dashboard
            </h1>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="font-semibold">Open</h2>
                <p className="text-3xl">{openCount}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="font-semibold">Processing</h2>
                <p className="text-3xl">{inProgressCount}</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="font-semibold">Closed</h2>
                <p className="text-3xl">{closedCount}</p>
              </div>
            </div>
          </>
        )}

        {/* Tickets Page — search, filter, details & list */}
        {activePage === "tickets" && (
          <>
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded p-2 mb-3"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border rounded p-2 mb-6"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Processing">Processing</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Ticket Details */}
            {selectedTicket && (
              <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-2xl font-bold mb-4">
                  Ticket Details
                </h2>
                <p><strong>Ticket ID:</strong> {selectedTicket.ticket_id}</p>
                <p><strong>Customer:</strong> {selectedTicket.customer_name}</p>
                <p><strong>Email:</strong> {selectedTicket.customer_email}</p>
                <p><strong>Subject:</strong> {selectedTicket.subject}</p>
                <p><strong>Description:</strong> {selectedTicket.description}</p>
                <p><strong>Status:</strong> {selectedTicket.status}</p>

                <button
                  onClick={() => setSelectedTicket(null)}
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            )}

            {/* Tickets List */}
            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="bg-white p-4 rounded-lg shadow">
                  No tickets found.
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.ticket_id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="bg-white p-4 rounded-lg shadow cursor-pointer"
                  >
                    <h3 className="text-xl font-semibold">
                      {ticket.subject}
                    </h3>

                    <p className="text-gray-600">
                      {ticket.description}
                    </p>

                    <p className="mt-2">
                      Status: <strong>{ticket.status}</strong>
                    </p>

                    <select
                      value={ticket.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateStatus(ticket.ticket_id, e.target.value)
                      }
                      className="border rounded p-2 mt-2"
                    >
                      <option value="Open">Open</option>
                      <option value="Processing">Processing</option>
                      <option value="Closed">Closed</option>
                    </select>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTicket(ticket.ticket_id);
                      }}
                      className="bg-red-500 text-white px-3 py-1 rounded mt-2 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default App;