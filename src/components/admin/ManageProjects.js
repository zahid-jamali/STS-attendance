import { useState, useEffect, useRef } from 'react';
import { Modal, Button, Table, Form, Card } from 'react-bootstrap';
import { AddGoals, TrackGoals } from './ManageGoals';

const ManageProjects = () => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [works, setWorks] = useState([]);
  const [showWorksModel, setShowWorksModel] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);
  const [showTrackGoalsModel, setShowTrackGoalsModel] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [is_active, setIs_active] = useState(false);

  const titleRef = useRef();
  const descRef = useRef();
  const typeRef = useRef();
  const deadlineRef = useRef();

  useEffect(() => {
    if (selectedProject?._id) {
      const getWorks = async () => {
        setWorks([]);

        const projectId = selectedProject._id;
        let req = await fetch(
          `${process.env.REACT_APP_API_URLS}/get-my-works`,
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              projectId: projectId,
            }),
          }
        );
        if (req.ok) {
          let data = await req.json();
          setWorks(data);
        }
      };
      getWorks();
    }
  }, [selectedProject]);

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
    if (!showTrackGoalsModel) {
      getProjects();
    }
  }, [showTrackGoalsModel]);

  useEffect(() => {
    getProjects();
    getUsers();
  }, []);

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleWorksClick = (project) => {
    setSelectedProject(project);
    setShowWorksModel(true);
  };

  const handleAddGoalClick = (P) => {
    setSelectedProject(P);
    setShowAddModel(true);
  };

  const handleTrackGoalClick = (P) => {
    setShowTrackGoalsModel(true);
    setSelectedProject(P);
  };

  const handleClose = () => {
    setShowEditModal(false);
    setShowWorksModel(false);
    setShowAddModel(false);
    setShowTrackGoalsModel(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    let req = await fetch(`${process.env.REACT_APP_API_URLS}/update-project`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        projectId: selectedProject._id,
        title: titleRef.current.value,
        desc: descRef.current.value,
        type: typeRef.current.value,
        deadline: deadlineRef.current.value,
        team: selectedProject.Team,
        is_active: is_active,
      }),
    });
    if (req.ok) {
      alert('Successfully updated Project');
    } else {
      alert('Error occurred');
    }
    getProjects();
    handleClose();
  };

  const handleAddMember = () => {
    if (!selectedUser) return;
    const userToAdd = users.find((user) => user._id === selectedUser);
    if (
      userToAdd &&
      !selectedProject.Team.some((member) => member._id === userToAdd._id)
    ) {
      setSelectedProject({
        ...selectedProject,
        Team: [...selectedProject.Team, userToAdd],
      });
    }
  };

  const handleRemoveMember = (id) => {
    setSelectedProject({
      ...selectedProject,
      Team: selectedProject.Team.filter((member) => member._id !== id),
    });
  };

  return (
    <>
      <h3 className="text-center my-4">Active Projects</h3>
      <Table
        striped
        bordered
        hover
        responsive
        className="table-hover align-middle"
      >
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Team</th>
            <th>Type</th>
            <th>Deadline</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((P) => (
            <tr key={P._id}>
              <td className="fw-bold">{P.Title}</td>
              <td>{P.Description}</td>
              <td>
                {P.Team.map((U) => (
                  <div key={U._id} className="badge bg-secondary me-1 mb-1">
                    {U.Name}
                  </div>
                ))}
              </td>
              <td>{P.ProjectType}</td>
              <td>{P.Deadline.split('T')[0]}</td>
              <td>
                <span
                  className={`badge ${
                    P.is_Active ? 'bg-success' : 'bg-danger'
                  }`}
                >
                  {P.is_Active ? 'Active' : 'Closed'}
                </span>
              </td>
              <td>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditClick(P)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleWorksClick(P)}
                    >
                      Commits
                    </Button>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => handleAddGoalClick(P)}
                    >
                      Add Goal
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      onClick={() => handleTrackGoalClick(P)}
                    >
                      Track Goals
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AddGoals
        project={selectedProject}
        showmodel={showAddModel}
        handleclose={handleClose}
      />
      <TrackGoals
        project={selectedProject}
        showmodel={showTrackGoalsModel}
        handleclose={handleClose}
      />

      {/* Edit Project Modal */}
      <Modal show={showEditModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  defaultValue={selectedProject.Title}
                  ref={titleRef}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  rows="4"
                  defaultValue={selectedProject.Description}
                  ref={descRef}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  Type
                </label>
                <input
                  type="text"
                  id="type"
                  className="form-control"
                  defaultValue={selectedProject.ProjectType}
                  ref={typeRef}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="deadline" className="form-label">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  className="form-control"
                  defaultValue={selectedProject.Deadline.split('T')[0]}
                  ref={deadlineRef}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Team Members</label>
                <div className="input-group">
                  <select
                    className="form-select"
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="">Select a team member</option>
                    {users.map((usr) => (
                      <option key={usr._id} value={usr._id}>
                        {usr.Name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleAddMember}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="mt-3">
                {selectedProject.Team.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {selectedProject.Team.map((member) => (
                      <span key={member._id} className="badge bg-info p-2 m-1">
                        {member.Name}
                        <button
                          className="btn btn-sm btn-danger ms-2"
                          onClick={() => handleRemoveMember(member._id)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No team members added</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  Status
                </label>
                <Form.Check
                  type="switch"
                  id={`switch-${selectedProject._id}`}
                  defaultChecked={selectedProject.is_Active}
                  onChange={(e) => setIs_active(e.target.checked)}
                />
              </div>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Works Modal */}
      <Modal show={showWorksModel} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Commits on Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {works.map((W, index) => (
            <Card key={index} className="mb-3 shadow-sm">
              <Card.Body>
                <h5 className="mb-1">{W.User.Name}</h5>
                <p className="text-muted">{W.Work}</p>
                <small className="text-secondary">{W.date}</small>
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageProjects;
