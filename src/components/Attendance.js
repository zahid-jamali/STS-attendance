import { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
    const [user, setUser] = useState(null);
    const [record, setRecord] = useState([]);
    
    let today = new Date();
    let monthBefore = new Date();
    monthBefore.setDate(today.getDate() - 30);

    const [startingDate, setStartingDate] = useState(monthBefore.toISOString().split("T")[0]);
    const [endingDate, setEndingDate] = useState(today.toISOString().split("T")[0]);

    const navigate = useNavigate();

    const getAttendance = useCallback(async(userId) => {
        if (!userId) return; // Prevent calling API if userId is missing

        try {
            let req = await fetch(`${process.env.REACT_APP_API_URLS}/getUserAttendance`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    startingDate,
                    endingDate,
                }),
            });

            if (req.ok) {
                let data = await req.json();
                setRecord(data);
            } else {
                console.error("Failed to fetch attendance");
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    }, [endingDate, startingDate]);

    useEffect(() => {
        const usr = localStorage.getItem("user");
        if (!usr) {
            navigate("/login");
        } else {
            let tmp = JSON.parse(usr);
            setUser(tmp);
            getAttendance(tmp._id);
        }
    }, [navigate, getAttendance]);

    return (
        <>
            <Header />
            <h2 align="center">Attendance</h2>

            <div className="container">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label>Start Date:</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={startingDate} 
                            onChange={(e) => setStartingDate(e.target.value)} 
                        />
                    </div>
                    <div className="col-md-4">
                        <label>End Date:</label>
                        <input 
                            type="date" 
                            className="form-control" 
                            value={endingDate} 
                            onChange={(e) => setEndingDate(e.target.value)} 
                        />
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-primary mt-4" onClick={() => getAttendance(user?._id)}>Fetch Attendance</button>
                    </div>
                </div>
            </div>
            
            <div className="container">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Entry Time</th>
                            <th>Exit Time</th>
                            <th>Work Hours</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                    {record.length > 0 ? (
                        record.map((entry, index) => 
                            entry.records.map((rec, recIndex) => (
                                <tr key={`${index}-${recIndex}`}>
                                    <td>{entry.date}</td>
                                    <td>{rec.entryTime ? new Date(rec.entryTime).toLocaleTimeString() : "N/A"}</td>
                                    <td>{rec.exitTime ? new Date(rec.exitTime).toLocaleTimeString() : "N/A"}</td>
                                    <td>{rec.workHours ?? "N/A"}</td>
                                    <td>{rec.Remarks || ""}</td>
                                </tr>
                            ))
                        )
                    ) : (
                        <tr>
                            <td colSpan="6" align="center">No records found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Attendance;
