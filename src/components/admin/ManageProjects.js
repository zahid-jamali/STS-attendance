import { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";

const ManageProjects = () => {
  const [records, setRecords] = useState([
    {
      _id: 1,
      Title: "Project A",
      Description: "Description of Project A",
      Team: [
        { _id: 1, Name: "Alice", DailyUpdates: [{ date: "2025-02-18", workDescription: "Completed task 1" }, { date: "2025-02-17", workDescription: "Completed task 2" }] },
        { _id: 2, Name: "Bob", DailyUpdates: [{ date: "2025-02-18", workDescription: "Reviewed task 1" }] }
      ],
      ProjectType: "Type 1",
      Deadline: "2025-03-01",
      is_Active: true
    },
    {
      _id: 2,
      Title: "Project B",
      Description: "Description of Project B",
      Team: [
        { _id: 3, Name: "Charlie", DailyUpdates: [{ date: "2025-02-18", workDescription: "Completed task 3" }] }
      ],
      ProjectType: "Type 2",
      Deadline: "2025-04-01",
      is_Active: true
    }
  ]);


  const getProjects=async()=>{
    let req=await fetch(`${process.env.REACT_APP_API_URLS}/get-all-projects`)
    if(req.ok){
        let data=await req.json();
        setRecords(data);
    }
}
useEffect(()=>{
    getProjects();
}, [])

  const [showEditModal, setShowEditModal] = useState(false);
  const [showWorkModal, setShowWorkModal]=useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleWorkClick = (project) => {
    setSelectedProject(project);
    setShowWorkModal(true);
  };

  const handleClose = () => {
    setShowEditModal(false);
    setShowWorkModal(false);
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((P) => {
            if (!P.is_Active) return null;
            return (
              <tr key={P._id}>
                <td>{P.Title}</td>
                <td>{P.Description}</td>
                <td>{P.Team.map((U) => (<p key={U._id}>{U.Name}</p>))}</td>
                <td>{P.ProjectType}</td>
                <td>{P.Deadline}</td>
                <td>
                  <Button variant="primary" onClick={() => handleEditClick(P)}>Edit</Button>
                  <Button variant="info" className="ms-2" onClick={() => handleWorkClick(P)}>Work Done</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

          {JSON.parse(showWorkModal)}
      {/* Edit Project Modal */}
      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div>
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    defaultValue={selectedProject.Title}
                  />

                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows="4"
                    defaultValue={selectedProject.Description}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Type</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    defaultValue={selectedProject.ProjectType}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Deadline</label>
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    defaultValue={selectedProject.Deadline}
                  />

                </div>
                {/* You can add more fields as necessary */}
                <Button variant="primary" type="submit">Save Changes</Button>
              </form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Work Done Modal */}
      {/* <Modal show={showWorkModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Work Done by Team Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
              <h5 className="text-muted">Daily Updates</h5>
              <ul className="list-unstyled">
                {selectedProject.Team.map((teamMember) => (
                  <li key={teamMember._id}>
                    <h6>{teamMember.Name}</h6>
                    <ul>
                      {teamMember.DailyUpdates.map((update, index) => (
                        <li key={index}>
                          <strong>{update.date}:</strong> {update.workDescription}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default ManageProjects;
