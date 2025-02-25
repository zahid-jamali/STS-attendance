import { useEffect, useState } from "react";

const ManageComplains = () => {
    const [records, setRecords] = useState([]);

    const getComplains = async () => {
        try {
            let req = await fetch(`${process.env.REACT_APP_API_URLS}/get-all-complains`);
            if (req.ok) {
                let data = await req.json();
                setRecords(data);
            } else {
                console.error("Failed to fetch complains");
            }
        } catch (error) {
            console.error("Error fetching complains:", error);
        }
    };

    const updateComplain = async (complainId) => {
        let req = await fetch(`${process.env.REACT_APP_API_URLS}/update-complain`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                complainId: complainId,
                status: true,
            })
        });
        if(req.ok){
            getComplains();
        }
    };

    useEffect(() => {
        getComplains();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Manage Complaints & Suggestions</h2>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? (
                            records.map((R, index) => (
                                <tr key={index}>
                                    <td>{R.Title}</td>
                                    <td>{R.Description}</td>
                                    <td>
                                        {!R.Status ? (
                                            <button className="btn btn-success" onClick={() => updateComplain(R._id)}>Accept</button>
                                        ) : (
                                            <span className="text-success fw-bold">Accepted</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No complaints found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageComplains;
