import { useState, useEffect, useRef } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";

const ManageProjects = () => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);

  const titleRef=useRef();
  const descRef=useRef();
  const typeRef=useRef();
  const deadlineRef = useRef();



  const handleUpdate=async (e)=>{
    e.preventDefault();
    let req=await fetch(`${process.env.REACT_APP_API_URLS}/update-project`, {
      method:"PUT",
      headers:{
        "Content-type":"application/json",
      },
      body:JSON.stringify({
        projectId:selectedProject._id,
        title:titleRef.current.value,
        desc:descRef.current.value,
        type:typeRef.current.value,
        deadline: deadlineRef.current.value,
        team: selectedProject.Team,
        is_active:selectedProject.is_Active
      })
    })
    if(req.ok){
      alert("Successfully updated Project")
    }
    else{
      alert("Error occured");
    }
    // getProjects();
    handleClose()
  }

  
  const getProjects = async () => {
    let req = await fetch(`${process.env.REACT_APP_API_URLS}/get-all-projects`);
    if (req.ok) {
      let data = await req.json();
      setRecords(data);
    }
  };

  const getUsers = async () => {
    let req = await fetch(`${process.env.REACT_APP_API_URLS}/getAllUsers`);
    if (req.ok) {
      let data = await req.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    getProjects();
    getUsers();
  }, []);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  const toggleProjectStatus = (projectId) => {
    setRecords((prevRecords) =>
      prevRecords.map((project) =>
        project._id === projectId ? { ...project, is_Active: !project.is_Active } : project
      )
    );
  };

  const handleAddMember = () => {
    if (!selectedUser) return;
    const userToAdd = users.find((user) => user._id === selectedUser);
    if (userToAdd && !selectedProject.Team.some((member) => member._id === userToAdd._id)) {
      setSelectedProject({ ...selectedProject, Team: [...selectedProject.Team, userToAdd] });
    }
  };

  const handleRemoveMember = (id) => {
    setSelectedProject({ ...selectedProject, Team: selectedProject.Team.filter((member) => member._id !== id) });
  };

  return (
    <>
      <h3 className="text-center my-4">Active Projects</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Team</th>
            <th>Type</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((P) => (
            <tr key={P._id}>
              <td>{P.Title}</td>
              <td>{P.Description}</td>
              <td>{P.Team.map((U) => (<p key={U._id}>{U.Name}</p>))}</td>
              <td>{P.ProjectType}</td>
              <td>{P.Deadline}</td>
              <td>
                <p>{P.is_Active ? "Active" : "Closed"}</p>
              </td>
              <td>
                <Button variant="primary" onClick={() => handleEditClick(P)}>Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Project Modal */}
      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div>
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" id="title" className="form-control" defaultValue={selectedProject.Title} ref={titleRef} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea id="description" className="form-control" rows="4" defaultValue={selectedProject.Description} ref={descRef} />
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Type</label>
                  <input type="text" id="type" className="form-control" defaultValue={selectedProject.ProjectType} ref={typeRef} />
                </div>
                <div className="mb-3">
                  <label htmlFor="deadline" className="form-label">Deadline</label>
                  <input type="date" id="deadline" className="form-control" defaultValue={selectedProject.Deadline.split("T")[0]} ref={deadlineRef} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Team Members</label>
                  <div className="input-group">
                    <select className="form-select" onChange={(e) => setSelectedUser(e.target.value)}>
                      <option value="">Select a team member</option>
                      {users.map((usr) => (
                        <option key={usr._id} value={usr._id}>{usr.Name}</option>
                      ))}
                    </select>
                    <button className="btn btn-primary" type="button" onClick={handleAddMember}>Add</button>
                  </div>
                </div>
                <div className="mt-3">
                  {selectedProject.Team.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {selectedProject.Team.map((member) => (
                        <span key={member._id} className="badge bg-info p-2 m-1">
                          {member.Name} 
                          <button className="btn btn-sm btn-danger ms-2" onClick={() => handleRemoveMember(member._id)}>×</button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No team members added</p>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Status</label>
                  <Form.Check 
                  type="switch"
                  id={`switch-${selectedProject._id}`}
                  defaultChecked={true}
                  onChange={() => toggleProjectStatus(selectedProject._id)}
                />
                </div>
                <Button variant="primary" type="submit">Save Changes</Button>
              </form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageProjects;
