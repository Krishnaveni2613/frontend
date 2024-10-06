import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminNavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/admin">Admin Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin/accommodations">Manage Accommodations</Nav.Link>
            <Nav.Link as={Link} to="/admin/bookings">Manage Bookings</Nav.Link>
            <Nav.Link as={Link} to="/admin/users">User Management</Nav.Link>
            {/* <Nav.Link as={Link} to="/admin/reports">Reports</Nav.Link> */}
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/Profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavBar;
