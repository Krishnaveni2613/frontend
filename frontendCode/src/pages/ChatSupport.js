// components/ChatSupport.js
import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ChatSupport = () => {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="info" onClick={handleShow}>Chat Support</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Chat Support</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Chat functionality here */}
          <p>Chat support feature will be implemented here.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ChatSupport;
