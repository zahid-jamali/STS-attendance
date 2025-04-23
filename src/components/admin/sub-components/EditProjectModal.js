import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditProjectModal = ({
  show,
  handleClose,
  selectedProject,
  users,
  titleRef,
  descRef,
  typeRef,
  deadlineRef,
  handleUpdate,
  handleAddMember,
  handleRemoveMember,
  setSelectedUser,
  setIs_active,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
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
  );
};

export default EditProjectModal;
