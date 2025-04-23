import React from 'react';
import { Modal, Button, Card } from 'react-bootstrap';

const WorksModal = ({ show, handleClose, works }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Commits on Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {works.map((W, index) => (
          <Card key={index} className="mb-3 shadow-sm">
            <Card.Body>
              <h5 className="mb-1">{W?.User?.Name}</h5>
              <p className="text-muted">{W?.Work}</p>
              <small className="text-secondary">{W?.date}</small>
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
  );
};

export default WorksModal;
