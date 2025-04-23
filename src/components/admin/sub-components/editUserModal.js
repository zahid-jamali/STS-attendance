import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EditUserModal = ({
  show,
  handleClose,
  selectedUser,
  updateUser,
  nameRef,
  emailRef,
  phoneRef,
  roleRef,
  bioRef,
  activeRef,
  adminRef,
  newPasswordRef,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedUser && (
          <form onSubmit={updateUser}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label fw-bold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  defaultValue={selectedUser.Name}
                  placeholder="Enter name"
                  ref={nameRef}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label fw-bold">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  defaultValue={selectedUser.Email}
                  placeholder="Enter email"
                  ref={emailRef}
                />
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label htmlFor="phone" className="form-label fw-bold">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="form-control"
                  defaultValue={selectedUser.Phone}
                  placeholder="Enter phone number"
                  ref={phoneRef}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="roll" className="form-label fw-bold">
                  Role
                </label>
                <input
                  type="text"
                  id="roll"
                  className="form-control"
                  defaultValue={selectedUser.Roll}
                  placeholder="Enter role"
                  ref={roleRef}
                />
              </div>
            </div>

            <div className="mt-3">
              <label htmlFor="bio" className="form-label fw-bold">
                Bio
              </label>
              <textarea
                id="bio"
                className="form-control"
                rows="3"
                defaultValue={selectedUser.Bio}
                placeholder="Enter user bio"
                ref={bioRef}
              ></textarea>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isActiveSwitch"
                  defaultChecked={selectedUser.is_Active}
                  ref={activeRef}
                />
                <label
                  className="form-check-label fw-bold ms-2"
                  htmlFor="isActiveSwitch"
                >
                  Is Active
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isAdminSwitch"
                  defaultChecked={selectedUser.is_Admin}
                  ref={adminRef}
                />
                <label
                  className="form-check-label fw-bold ms-2"
                  htmlFor="isAdminSwitch"
                >
                  Is Admin
                </label>
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label htmlFor="password" className="form-label fw-bold">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Password"
                  ref={newPasswordRef}
                />
              </div>
            </div>

            <button className="btn btn-primary w-100 mt-3" type="submit">
              💾 Save Changes
            </button>
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

export default EditUserModal;
