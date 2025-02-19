import { useEffect, useState } from "react";

const DashboardOverview = () => {
    const [records, setRecords] = useState([]);
    const [inputDate, setInputDate] = useState(new Date().toISOString().split("T")[0]);


    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        return `${month}-${day}-${year}`;
    };






    const handleRequest = async (date) => {
        const formattedDate = formatDate(date);

        try {
            const req = await fetch(`${process.env.REACT_APP_API_URLS}/getUsersAttendanceByDate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ date: formattedDate }),
            });

            if (req.ok) {
                const data = await req.json();
                setRecords(data);
            } else {
                console.error("Failed to fetch attendance by date");
            }
        } catch (error) {
            console.error("Error fetching attendance:", error);
        }
    };

    useEffect(() => {
        handleRequest(inputDate);
    }, []);

    return (
        <>
            <h2 align="center">Dashboard</h2>
            <h3>Attendance</h3>
                <input type="date" onChange={(e) => setInputDate(e.target.value)} />
                <button className="btn btn-primary m-5" onClick={()=>handleRequest(inputDate)}>Check</button>
            {inputDate}
            <table border="1" width="100%" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Entry Time</th>
                        <th>Exit Time</th>
                        <th>Work Hours</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map((rec) => {
                        const attendance = rec.attendanceRecords; // Can be an object or null

                        return (
                            <tr key={rec._id}>
                                <td>{rec.Name || "Unknown"}</td>
                                <td>
                                    {attendance && attendance.entryTime
                                        ? new Date(attendance.entryTime).toLocaleTimeString()
                                        : "N/A"}
                                </td>
                                <td>
                                    {attendance && attendance.exitTime
                                        ? new Date(attendance.exitTime).toLocaleTimeString()
                                        : "N/A"}
                                </td>
                                <td>
                                    {attendance && attendance.workHours
                                        ? attendance.workHours.toFixed(2)
                                        : "N/A"}
                                </td>

                                <td>
                                    {attendance && attendance.Remarks
                                        ? attendance.Remarks
                                        : "N/A"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default DashboardOverview;
