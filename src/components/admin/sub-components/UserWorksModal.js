import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';

const UserWorksModal = ({ show, handleClose, works = [] }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
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
          <div className="text-center text-muted">
            No work records available.
          </div>
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

export default UserWorksModal;
