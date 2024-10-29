import { useState } from "react";
import { Alert } from "react-bootstrap";
import toast from "react-hot-toast";
import { myConstant } from "../../const/const";
import loadingGif from "../../assets/loading.gif";

const TicketAcceptance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticketId, setTicketId] = useState("");

  const handleInputChange = (e) => {
    setTicketId(e.target.value.trim());
  };

  const handleAcceptById = async () => {
    if (!ticketId) {
      toast.error("Please enter a ticket ID.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${myConstant}/api/tickets/${ticketId}/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("events-app"))["token"]
            }`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Ticket accepted successfully!");
        setTicketId(null);
      } else {
        toast.error(`${data.error}`);
      }
    } catch (error) {
      console.error("Error accepting ticket:", error);
      toast.error("Error accepting ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col mb-3 justify-center px-2">
      <h1 className="text-3xl text-center text-blue-500 font-bold mb-4">
        Ticket Management
      </h1>
      <input
        type="text"
        value={ticketId}
        onChange={handleInputChange}
        placeholder="Enter Ticket ID"
        className="mb-4 p-2 border w-[200px] border-blue-500 rounded"
      />
      <button
        onClick={handleAcceptById}
        className="mb-4 bg-blue-500 w-[200px] text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? (
          <img src={loadingGif} width={20} alt="loading..." />
        ) : (
          "Ticket Accepted"
        )}
      </button>
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  );
};

export default TicketAcceptance;
