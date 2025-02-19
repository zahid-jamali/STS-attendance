import { useState, useEffect, useRef } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const Leaves = () => {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState();
    const [leaves, setLeaves] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const navigate = useNavigate();

    const titleRef = useRef();
    const descRef = useRef();
    const fromDateRef = useRef();
    const toDateRef = useRef();

    const applyLeave = async () => {
        setShowModal(false);
        const Body = {
            userId: user._id,
            title: titleRef.current.value,
            desc: descRef.current.value,
            fromDate: fromDateRef.current.value,
            toDate: toDateRef.current.value,
        };
        let req = await fetch(`${process.env.REACT_APP_API_URLS}/apply-leave`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(Body),
        });
        if (req.ok) {
            alert("Successfully applied for the leave");
        } else {
            alert("Application failed, please try again!");
        }
    };

    const getLeaves = async (userId) => {
        let req = await fetch(`${process.env.REACT_APP_API_URLS}/get-leaves-for-users`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ userId: userId }),
        });
        const data = await req.json();
        if (req.ok) {
            setLeaves(data.Leaves);
            setHolidays(data.Holidays);
        }
    };

    useEffect(() => {
        const usr = localStorage.getItem("user");
        if (!usr) {
            navigate("/login");
        } else {
            let tmp = JSON.parse(usr);
            setUser(tmp);
            getLeaves(tmp);
        }
    }, [navigate]);

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h2 className="text-center">Leaves Page</h2>
                <button className="btn btn-primary mb-3" onClick={() => setShowModal(true)}>Apply for Leave</button>

                <h4>Pending Leave Applications</h4>
                <table className="table table-bordered table-striped text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>Leave Title</th>
                            <th>Description</th>
                            <th>From</th>
                            <th>To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.filter(L => L.Status === "Pending").map(L => (
                            <tr key={L._id}>
                                <td>{L.Title}</td>
                                <td>{L.Description}</td>
                                <td>{L.fromDate}</td>
                                <td>{L.toDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <details className="mt-3">
                    <summary className="fw-bold">Accepted or Rejected Applications</summary>
                    <table className="table table-bordered table-striped text-center mt-2">
                        <thead className="table-dark">
                            <tr>
                                <th>Leave Title</th>
                                <th>Description</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.filter(L => L.Status !== "Pending").map(L => (
                                <tr key={L._id}>
                                    <td>{L.Title}</td>
                                    <td>{L.Description}</td>
                                    <td>{L.fromDate}</td>
                                    <td>{L.toDate}</td>
                                    <td>
                                        <span className={`badge ${L.Status === "Accepted" ? "bg-success" : "bg-danger"}`}>
                                            {L.Status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </details>

                <details className="mt-3">
                    <summary className="fw-bold">Holidays</summary>
                    <table className="table table-bordered table-striped text-center mt-2">
                        <thead className="table-dark">
                            <tr>
                                <th>Holiday</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holidays.map(H => (
                                <tr key={H._id}>
                                    <td>{H.Title}</td>
                                    <td>{H.HolidayDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </details>
            </div>

            {showModal && (
                <div className="modal d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Apply Leave</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Leave Title</label>
                                        <input type="text" className="form-control" ref={titleRef} placeholder="Subject for the leave" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea className="form-control" ref={descRef} placeholder="Please define why you are applying for the leave"></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">From</label>
                                        <input type="date" className="form-control" ref={fromDateRef} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">To</label>
                                        <input type="date" className="form-control" ref={toDateRef} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                                <button className="btn btn-primary" onClick={applyLeave}>Apply Leave</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default Leaves;
