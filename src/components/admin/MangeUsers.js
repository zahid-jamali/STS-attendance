import { useEffect, useState, useCallback, useRef } from "react";
import AdminCreateAttendance from "./AdminCreateAttendance";
import { Modal, Button, Card } from "react-bootstrap";

const ManageUsers=()=>{
    const [users, setUsers]=useState([]);
    const [selectedUser, setSelectedUser]=useState({});
    const [showEditModal, setShowEditModal]=useState(false);
    const [showWorksModel, setShowWorksModel]=useState(false);
    const [works, setWorks]=useState([]);
    const [record, setRecord]=useState([]);
    const [showAttendanceModel, setShowAttendanceModel]=useState(false);

    const nameRef=useRef();
    const emailRef=useRef();
    const phoneRef=useRef();
    const roleRef=useRef();
    const bioRef=useRef();
    const activeRef=useRef();
    const adminRef=useRef();
    const newPasswordRef=useRef();


    
    const updateUser=async (e)=>{
        e.preventDefault();
        const updatedUser={
            userId:selectedUser._id,
            name:nameRef.current.value,
            email:emailRef.current.value,
            phone:phoneRef.current.value,
            role:roleRef.current.value,
            bio:bioRef.current.value,
            newPassword:newPasswordRef.current.value,
            is_active:activeRef.current.checked,
            is_admin:adminRef.current.checked,
            admin:true,
        }
        let req = await fetch(`${process.env.REACT_APP_API_URLS}/updateUser`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
        });
        console.log(req)
        if (req.ok) {
            alert("Profile updated successfully!");
            
        } else {
            alert("Failed to update the profile.");
        }
    }



    


    
    let today = new Date();
    let monthBefore = new Date();
    monthBefore.setDate(today.getDate() - 30);

    const [startingDate, setStartingDate] = useState(monthBefore.toISOString().split("T")[0]);
    const [endingDate, setEndingDate] = useState(today.toISOString().split("T")[0]);


    const getAttendance = useCallback(async(userId) => {
        if (!selectedUser) return; 

        try {
            let req = await fetch(`${process.env.REACT_APP_API_URLS}/getUserAttendance`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    userId:selectedUser._id,
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
    }, [endingDate, startingDate, selectedUser]);

    useEffect(() => {
        if (showWorksModel) {
            const getMyWork = async () => {
                let req = await fetch(`${process.env.REACT_APP_API_URLS}/getMyWork`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify({ userId: selectedUser._id })
                });
                if (req.ok) {
                    let data = await req.json();
                    setWorks(data);
                }
            };
            getMyWork();
        }
    }, [showWorksModel, selectedUser._id]); 



    const handleAttendanceClick=(user)=>{
        setSelectedUser(user);
        setShowAttendanceModel(true);
        getAttendance();
    }


    const handleWorksClick=(user)=>{
        setSelectedUser(user);
        setShowWorksModel(true);
    }


    const handleEditClick=(user)=>{
        setSelectedUser(user)
        setShowEditModal(true);
    }

    const handleClose=()=>{
        setShowEditModal(false);
        setShowAttendanceModel(false);
        setShowWorksModel(false);
    }

    const getAllUsers=async ()=>{
        let req=await fetch(`${process.env.REACT_APP_API_URLS}/getAllUsers`)
        if(req.ok){
            let data=await req.json();
            setUsers(data);
        }
    }
    useEffect(()=>{
        getAllUsers();
    }, [])
    return(<>
    <h2>Manage Users</h2>
    <AdminCreateAttendance />
        <div className="container mt-4">
            <div className="table-responsive">
                <table className="table table-hover table-bordered text-center align-middle shadow-sm">
                    <thead className="table-primary">
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((U) => (
                            <tr key={U.Email}>
                                <td className="fw-bold">{U.Name}</td>
                                <td>{U.Email}</td>
                                <td>
                                    <div className="d-flex flex-wrap justify-content-center gap-2">
                                        <button className="btn btn-outline-primary btn-sm px-3" onClick={() => handleEditClick(U)}>
                                            ✏️ Edit
                                        </button>
                                        <button className="btn btn-outline-success btn-sm px-3" onClick={() => handleWorksClick(U)}>
                                            📊 Track Progress
                                        </button>
                                    </div>
                                    <hr />
                                    <div className="d-flex flex-column align-items-center gap-2">
                                        <div className="d-flex gap-2">
                                            <div>
                                                <label className="form-label fw-bold">From</label>
                                                <input type="date" className="form-control form-control-sm" onChange={(e) => setStartingDate(e.target.value)} />
                                            </div>
                                            <div>
                                                <label className="form-label fw-bold">To</label>
                                                <input type="date" className="form-control form-control-sm" onChange={(e) => setEndingDate(e.target.value)} />
                                            </div>
                                        </div>
                                        <button className="btn btn-warning btn-sm px-3 mt-2" onClick={() => handleAttendanceClick(U)}>
                                            📅 Attendance
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>





        <Modal show={showEditModal} onHide={handleClose} centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedUser && (
                    <form onSubmit={updateUser}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="name" className="form-label fw-bold">Name</label>
                                <input type="text" id="name" className="form-control" defaultValue={selectedUser.Name} placeholder="Enter name" ref={nameRef} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="email" className="form-label fw-bold">Email</label>
                                <input type="email" id="email" className="form-control" defaultValue={selectedUser.Email} placeholder="Enter email" ref={emailRef} />
                            </div>
                        </div>

                        <div className="row g-3 mt-2">
                            <div className="col-md-6">
                                <label htmlFor="phone" className="form-label fw-bold">Phone</label>
                                <input type="tel" id="phone" className="form-control" defaultValue={selectedUser.Phone} placeholder="Enter phone number" ref={phoneRef} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="roll" className="form-label fw-bold">Role</label>
                                <input type="text" id="roll" className="form-control" defaultValue={selectedUser.Roll} placeholder="Enter role" ref={roleRef} />
                            </div>
                        </div>

                        <div className="mt-3">
                            <label htmlFor="bio" className="form-label fw-bold">Bio</label>
                            <textarea id="bio" className="form-control" rows="3" defaultValue={selectedUser.Bio} placeholder="Enter user bio" ref={bioRef}></textarea>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="isActiveSwitch" defaultChecked={selectedUser.is_Active} ref={activeRef} />
                                <label className="form-check-label fw-bold ms-2" htmlFor="isActiveSwitch" >Is Active</label>
                            </div>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" id="isAdminSwitch" defaultChecked={selectedUser.is_Admin} ref={adminRef} />
                                <label className="form-check-label fw-bold ms-2" htmlFor="isAdminSwitch">Is Admin</label>
                            </div>
                        </div>
                        <div className="row g-3 mt-2">
                            <div className="col-md-6">
                                <label htmlFor="phone" className="form-label fw-bold">New Password</label>
                                <input type="password" id="password" className="form-control"  placeholder="Password" ref={newPasswordRef} />
                            </div>
                        </div>

                        <button className="btn btn-primary w-100 mt-3" type="submit">
                            💾 Save Changes
                        </button>
                    </form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>





        <Modal show={showWorksModel} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>User Tracks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {works.length > 0 ? (
            works.map((W, index) => (
                <Card key={index} className="mb-3 border-primary shadow-sm">
                <Card.Body>
                    <h5 className="fw-bold text-primary">{W.Project.Title}</h5>
                    <p className="text-muted">{W.Work}</p>
                    <small className="fst-italic text-secondary">{W.date}</small>
                </Card.Body>
                </Card>
            ))
            ) : (
            <div className="text-center text-muted">No work records available.</div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
        </Modal>



      <Modal show={showAttendanceModel} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>User Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th>Date</th>
                    <th>Entry</th>
                    <th>Exit</th>
                    <th>Work Hours</th>
                    <th>Remarks</th>
                </tr>
                </thead>
                <tbody>
                {record.length > 0 ? (
                    [...record].reverse().map((entry, index) =>
                    entry.records.map((rec, recIndex) =>
                        selectedUser._id === rec.user._id ? (
                        <tr key={`${index}-${recIndex}`}>
                            <td>{entry.date}</td>
                            <td>{rec.entryTime ? new Date(rec.entryTime).toLocaleTimeString() : "N/A"}</td>
                            <td>{rec.exitTime ? new Date(rec.exitTime).toLocaleTimeString() : "N/A"}</td>
                            <td>{rec.workHours ?? "N/A"}</td>
                            <td>{rec.Remarks || "—"}</td>
                        </tr>
                        ) : null
                    )
                    )
                ) : (
                    <tr>
                    <td colSpan="5" className="text-center text-muted">No records found</td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
        </Modal>

    </>)
}




export default ManageUsers;