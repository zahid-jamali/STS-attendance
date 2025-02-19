import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Table } from "react-bootstrap";

const ManageLeaves = () => {
    const navigate = useNavigate();
    const [leaves, setLeaves] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const titleRef = useRef(null);
    const dateRef = useRef(null);

    const fetchLeavesAndHolidays = async () => {
        try {
            let req = await fetch(`${process.env.REACT_APP_API_URLS}/get-leaves`);
            let data = await req.json();
            if (req.ok) {
                setLeaves(data.Leaves);
                setHolidays(data.Holidays);
            }
            else{
            alert(data.message)
            }
        } catch (error) {
            console.error("Error fetching leaves:", error);
        }
    };

    const updateLeave = async (leaveId, status) => {
        try {
            let req = await fetch(`${process.env.REACT_APP_API_URLS}/update-leave`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ leaveId, status }),
            });

            if (req.ok) {
                alert("Leave updated!");
                fetchLeavesAndHolidays();
            }
        } catch (error) {
            console.error("Error updating leave:", error);
        }
    };

    const addHoliday = async () => {
        const title = titleRef.current.value;
        const date = dateRef.current.value;

        if (!title || !date) {
            alert("Please enter both title and date.");
            return;
        }

        try {
            let req = await fetch(`${process.env.REACT_APP_API_URLS}/add-holiday`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, date }),
            });

            if (req.ok) {
                alert("Holiday added!");
                setShowModal(false);
                fetchLeavesAndHolidays();
            }
        } catch (error) {
            console.error("Error adding holiday:", error);
        }
    };

    useEffect(() => {
        fetchLeavesAndHolidays();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Manage Leaves</h2>
            
            {/* Add Holiday Button */}
            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" onClick={() => setShowModal(true)}>Add Holiday</Button>
            </div>

            {/* Pending Leave Applications */}
            <h4 className="mb-3">Pending Leave Applications</h4>
            <Table bordered striped hover>
                <thead className="table-dark text-center">
                    <tr>
                        <th>Username</th>
                        <th>Leave Title</th>
                        <th>Description</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.filter(L => L.Status === "Pending").map(L => (
                        <tr key={L._id}>
                            <td>{L.user.Name}</td>
                            <td>{L.Title}</td>
                            <td>{L.Description}</td>
                            <td>{L.fromDate}</td>
                            <td>{L.toDate}</td>
                            <td>
                                <Button variant="success" size="sm" onClick={() => updateLeave(L._id, "Accepted")}>Accept</Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => updateLeave(L._id, "Rejected")}>Reject</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Accepted/Rejected Leave Applications */}
            <details>
                <summary className="mb-2 fw-bold">Accepted or Rejected Applications</summary>
                <Table bordered striped hover>
                    <thead className="table-dark text-center">
                        <tr>
                            <th>Username</th>
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
                                <td>{L.user.Name}</td>
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
                </Table>
            </details>

            {/* Holidays Section */}
            <details className="mt-3">
                <summary className="mb-2 fw-bold">Holidays</summary>
                <Table bordered striped hover>
                    <thead className="table-dark text-center">
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
                </Table>
            </details>

            {/* Add Holiday Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Holiday</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Holiday Title</Form.Label>
                            <Form.Control type="text" ref={titleRef} placeholder="Enter holiday title" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Holiday Date</Form.Label>
                            <Form.Control type="date" ref={dateRef} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={addHoliday}>Save Holiday</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageLeaves;
