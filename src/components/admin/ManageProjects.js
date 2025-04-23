import { useState, useEffect, useRef } from 'react';
import { Button, Table } from 'react-bootstrap';
import { AddGoals, TrackGoals } from './ManageGoals';
import EditProjectModal from './sub-components/EditProjectModal';
import WorksModal from './sub-components/WorksModal';

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
  const [showTotalProjects, setShowTotalProjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const projects = records.filter(
      (P) =>
        P.Title.toLowerCase().includes(value.toLowerCase()) ||
        P.Description.toLowerCase().includes(value.toLowerCase())
    );
    if (value === '') {
      return setFilteredProjects(records);
    }
    setFilteredProjects(projects);
  };

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
      setFilteredProjects(data);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Checkbox (Toggle Switch) on the Left */}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="toggleSwitch"
            checked={showTotalProjects}
            onChange={(e) => setShowTotalProjects(e.target.checked)}
            style={{ width: '3rem', height: '1.5rem' }} // Larger toggle switch
          />
          <label className="form-check-label ms-2" htmlFor="toggleSwitch">
            <b>
              Show Total Users <i>Inactive</i> Included
            </b>
          </label>
        </div>

        {/* Search Box on the Right */}
        <div style={{ width: '300px' }}>
          {' '}
          {/* Controlled width for search box */}
          <input
            type="text"
            className="form-control"
            placeholder="Search Here..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              borderRadius: '25px', // Rounded corners
              padding: '12px 20px', // Padding for height and width
              fontSize: '16px', // Larger font size
              border: '2px solid #ddd', // Light border
              transition: 'border-color 0.3s ease', // Smooth transition
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff'; // Highlight on focus
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd'; // Reset on blur
            }}
          />
        </div>
      </div>
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
          {!showTotalProjects ? (
            <>
              {filteredProjects.map((P) =>
                P.is_Active ? (
                  <tr key={P._id}>
                    <td className="fw-bold">{P.Title}</td>
                    <td>{P.Description}</td>
                    <td>
                      {P.Team.map((U) => (
                        <div
                          key={U._id}
                          className="badge bg-secondary me-1 mb-1"
                        >
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
                ) : (
                  <></>
                )
              )}
            </>
          ) : (
            <>
              {filteredProjects.map((P) => (
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
            </>
          )}
        </tbody>
      </Table>
      {/* This section of jsx is for the Goals and these components are in the manage goals  */}
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
      {/* ----------------------------------------------------------------------------------------------------- */}

      {/* The following code is in sub-components */}
      {/* Edit Project Modal */}
      <EditProjectModal
        show={showEditModal}
        handleClose={handleClose}
        selectedProject={selectedProject}
        users={users}
        titleRef={titleRef}
        descRef={descRef}
        typeRef={typeRef}
        deadlineRef={deadlineRef}
        handleUpdate={handleUpdate}
        handleAddMember={handleAddMember}
        handleRemoveMember={handleRemoveMember}
        setSelectedUser={setSelectedUser}
        setIs_active={setIs_active}
      />

      {/* Works Modal */}

      <WorksModal
        show={showWorksModel}
        handleClose={handleClose}
        works={works}
      />
    </>
  );
};

export default ManageProjects;
