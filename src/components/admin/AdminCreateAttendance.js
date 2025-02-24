import { useEffect, useState } from "react";

const AdminCreateAttendance = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [date, setDate] = useState("");
    const [entryTime, setEntryTime] = useState("");
    const [exitTime, setExitTime] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);

    // Open modal
    const openModal = () => setIsOpen(true);


    const closeModal = () => {
        setIsOpen(false);
        setMessage("");
        setUserId("");
        setDate("");
        setEntryTime("");
        setExitTime("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !date || !entryTime) {
            setMessage("User ID, Date, and Entry Time are required.");
            return;
        }

        // Convert time strings to Date objects
        const entryDateTime = new Date(`${date}T${entryTime}:00Z`);
        const exitDateTime = exitTime ? new Date(`${date}T${exitTime}:00Z`) : null;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URLS}/admin-creates-attendance`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    date,
                    entryTime: entryDateTime,
                    exitTime: exitDateTime,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Attendance added successfully!");
                setTimeout(closeModal, 1000);
            } else {
                setMessage(result.message || "Something went wrong.");
            }
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    
    const getUsers = async () => {
        try {
            let response = await fetch(`${process.env.REACT_APP_API_URLS}/getAllUsers`);
            if (response.ok) {
                let data = await response.json();
                setUsers(data);
            } else {
                setMessage("Failed to fetch users.");
            }
        } catch (error) {
            setMessage("Error fetching users: " + error.message);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="text-center">
            {/* Button to open modal */}
            <button className="btn btn-primary" onClick={openModal}>
                Add Attendance
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add / Update Attendance</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>

                            <div className="modal-body">
                                {message && <p className="text-danger">{message}</p>}

                                <form onSubmit={handleSubmit}>
                                    {/* User Selection */}
                                    <div className="mb-3">
                                        <select
                                            className="form-control"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            required
                                        >
                                            <option value="">Select User</option>
                                            {users.length > 0 ? (
                                                users.map((usr) => (
                                                    <option key={usr._id} value={usr._id}>
                                                        {usr.Name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No Users Available</option>
                                            )}
                                        </select>
                                    </div>

                                    {/* Date Input */}
                                    <div className="mb-3">
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Entry Time */}
                                    <div className="mb-3">
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={entryTime}
                                            onChange={(e) => setEntryTime(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Exit Time */}
                                    <div className="mb-3">
                                        <input
                                            type="time"
                                            className="form-control"
                                            value={exitTime}
                                            onChange={(e) => setExitTime(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <button type="submit" className="btn btn-success">
                                            Submit
                                        </button>
                                        <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop - Click to close */}
            {isOpen && <div className="modal-backdrop fade show" onClick={closeModal}></div>}
        </div>
    );
};

export default AdminCreateAttendance;
