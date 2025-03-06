import { useState } from 'react';
import { Modal, Button, Card } from 'react-bootstrap';

const TrackGoals = ({ project, showmodel, handleclose }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCloseEditModel = () => {
    setShowEditModal(false);
  };

  const handlleEditClick = () => {
    // handleclose();
    setShowEditModal(true);
  };

  const Delete = async (goal) => {
    let req = await fetch(`${process.env.REACT_APP_API_URLS}/delete-goal`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        goalId: goal,
      }),
    });
    if (req.ok) {
      alert('Goal Deleted!');
      handleclose();
    }
  };
  return (
    <>
      <UpdateGoals
        project={project}
        handleclose={handleCloseEditModel}
        showmodel={showEditModal}
      />
      <Modal show={showmodel} onHide={handleclose} centered>
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fw-bold fs-4">
            🎯 Goals on Project
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {project && (
            <>
              <h4 className="fw-bold mb-4 text-primary">{project.Title}</h4>
              {project.Goals.length <= 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted fs-5">
                    No goals are set for this project.
                  </p>
                </div>
              ) : (
                <>
                  {project.Goals.map((G, index) => (
                    <Card
                      key={index}
                      className="mb-3 border-0 shadow-sm hover-shadow"
                    >
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <h5 className="mb-0 fw-bold text-dark">
                              {G.User.Name}
                            </h5>
                            {G.Status === 0 ? (
                              <span className="badge bg-warning text-dark">
                                Not Started
                              </span>
                            ) : G.Status >= 100 ? (
                              <span className="badge bg-success">
                                Completed
                              </span>
                            ) : (
                              <span className="badge bg-info">In Progress</span>
                            )}
                          </div>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="px-3"
                              onClick={() => handlleEditClick()}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="px-3"
                              onClick={() => Delete(G._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-muted mb-3">{G.Goal}</p>
                        {G.Status > 0 && G.Status < 100 && (
                          <div className="mb-3">
                            <div className="progress" style={{ height: '8px' }}>
                              <div
                                className="progress-bar bg-primary"
                                role="progressbar"
                                style={{ width: `${G.Status}%` }}
                                aria-valuenow={G.Status}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <small className="text-muted d-block mt-1">
                              {G.Status}% completed
                            </small>
                          </div>
                        )}
                        {G.Status >= 100 && (
                          <p className="text-success mb-0">
                            <b>Completed in {G.Steps} steps.</b>{' '}
                            <small className="text-secondary">
                              on {G.Completion_Date}
                            </small>
                          </p>
                        )}
                      </Card.Body>
                    </Card>
                  ))}
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const UpdateGoals = ({ project, showmodel, handleclose }) => {
  const [goal, setGoal] = useState();
  const [user, setUser] = useState();

  let handleSubmit = async (e) => {
    e.preventDefault();
    let req = await fetch(`${process.env.REACT_APP_API_URLS}/create-goal`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        projectId: project._id,
        goal: goal,
        userId: user,
      }),
    });
    let data = await req.json();
    alert(data.message);
    handleclose();
  };

  return (
    <>
      <Modal show={showmodel} onHide={handleclose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {project && (
            <form>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Set Goal
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  placeholder=""
                  onChange={(e) => setGoal(e.target.value)}
                  rows="4"
                />
              </div>
              <select
                className="form-control"
                onChange={(e) => setUser(e.target.value)}
                required
              >
                <option value="">Select User</option>
                {project.Team.length > 0 ? (
                  project.Team.map((usr) => (
                    <option key={usr._id} value={usr._id}>
                      {usr.Name}
                    </option>
                  ))
                ) : (
                  <option disabled>No Users Available</option>
                )}
              </select>

              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Save Changes
              </Button>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const AddGoals = ({ project, showmodel, handleclose }) => {
  const [goal, setGoal] = useState();
  const [user, setUser] = useState();

  let handleSubmit = async (e) => {
    e.preventDefault();
    let req = await fetch(`${process.env.REACT_APP_API_URLS}/create-goal`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        projectId: project._id,
        goal: goal,
        userId: user,
      }),
    });
    let data = await req.json();
    alert(data.message);
    handleclose();
  };

  return (
    <>
      <Modal show={showmodel} onHide={handleclose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {project && (
            <form>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Set Goal
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  placeholder=""
                  onChange={(e) => setGoal(e.target.value)}
                  rows="4"
                />
              </div>
              <select
                className="form-control"
                onChange={(e) => setUser(e.target.value)}
                required
              >
                <option value="">Select User</option>
                {project.Team.length > 0 ? (
                  project.Team.map((usr) => (
                    <option key={usr._id} value={usr._id}>
                      {usr.Name}
                    </option>
                  ))
                ) : (
                  <option disabled>No Users Available</option>
                )}
              </select>

              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Save Changes
              </Button>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleclose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { AddGoals, TrackGoals };
