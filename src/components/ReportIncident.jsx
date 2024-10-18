import { useState, useEffect} from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { CheckCheckIcon } from "lucide-react";

const ReportIncident = ({ token, incidentDetails }) => {
  const { authUser } = useAuthContext();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // For loader state
  const [success, setSuccess] = useState(false); // For success state
  const [formData, setFormData] = useState({
    description: "",
    image: "",
    reportedBy: "", // Will be set dynamically
    firstname:"",
    lastname:"",
  });

  // Fetch user details if email is not available in context
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedToken = JSON.parse(localStorage.getItem("events-app"))["token"];
        if (!storedToken) {
          navigator("/"); // Redirect if token is not available
        }

        const response = await fetch("/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken || token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        // Set the email as reportedBy
        setFormData((prevState) => ({
          ...prevState,
          reportedBy: data.email,
          firstname:data.firstname,
          lastname:data.lastname,
        }));
      } catch (error) {
        console.error("Error fetching user details:", error.message);
      }
    };

    if (authUser && authUser.email) {
      setFormData((prevState) => ({
        ...prevState,
        reportedBy: authUser.email,
        firstname:authUser.firstname,
        lastname:authUser.lastname,
      }));
    } else {
      fetchUserDetails(); // Fetch user details if email is not in context
    }
  }, [authUser, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevState) => ({
        ...prevState,
        image: reader.result.split(",")[1], // get the base64 part
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const [startTime, endTime] = incidentDetails.time.split(" - ");
    const dateParts = incidentDetails.date.split("/");
    const formattedDate = `${dateParts.join("-")}T${startTime}`;
  
    const reportData = {
      title: incidentDetails.title,
      description: formData.description,
      location: incidentDetails.location,
      image: formData.image,
      date: formattedDate,
      reportedBy: formData.reportedBy,
      firstName: formData.firstname,
      lastName: formData.lastname,
      group: incidentDetails.group,
    };
    try {
      const response = await fetch(`https://campus-safety.azurewebsites.net/incidentReporting/reportExternalIncident/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setSuccess(true);
        setFormData({
          description: "",
          image: "",
          reportedBy: "",
          firstname:"",
          lastname:"",
        });
      } else {
        toast.error(data.error || "Internal Server error");
        console.error("Error reporting incident:", data);
      }
    } catch (error) {
      console.error("Error reporting incident:", error);
      toast.error("Error reporting incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        onClick={() => setShowModal(true)}
      >
        Report
      </button>

      {/* Modal */}
      {showModal && (
        <div className="z-10 fixed inset-0 flex w-full items-center text-black justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            {!success ? (
              <>
                <h2 className="text-2xl text-center font-bold mb-4">Report an Incident</h2>

                {loading ? (
                  <div className="flex justify-center">
                    <div className="loader"></div> 
                    <span className="ml-2">Submitting...</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                      Description:
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="report to us"
                        className="block text-sm w-full p-2 border rounded"
                      ></textarea>
                    </label>
                    <label className="block mb-4">
                      Image (Optional):
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full p-2 border rounded"
                      />
                    </label>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-gray-400 text-white p-2 mr-2 rounded"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center w-72">
                <CheckCheckIcon className="h-24 w-24 text-green-500 text-6xl mb-4"/>
                <h2 className="text-xl text-green-500 mb-4">Thank you!</h2>
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Exit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportIncident;
