import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Container } from 'react-bootstrap';
import axios from 'axios';
import { localIP } from '../components/GetLocalIpAddress';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch users
    const fetchUsers = async () => {
        const token = localStorage.getItem('token');

      const { data } = await axios.get(`http://${localIP}:5000/api/admin/users`,{headers: { Authorization: `Bearer ${token}` }});
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = async () => {
    // Save user changes
    const token = localStorage.getItem('token');
    await axios.put(`http://${localIP}:5000/api/admin/users/${selectedUser._id}`, selectedUser,{headers: { Authorization: `Bearer ${token}` }});
    setShowModal(false);
  };

  const handleActivateDeactivate = async (user) => {
    const token = localStorage.getItem('token');

    const { data }= await axios.patch(`http://${localIP}:5000/api/admin/users/${user._id}/status`, {
      isActive: !user.active,
    },{headers: { Authorization: `Bearer ${token}` }});
    console.log(data)
    setUsers(users.map(u => u._id === user._id ? { ...u, active: !u.active } : u));
  };

  return (
    <Container>
      <h2>User Management</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.active ? 'Active' : 'Inactive'}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(user)}>Edit</Button>
                <Button
                  variant={user.active ? 'danger' : 'success'}
                  onClick={() => handleActivateDeactivate(user)}
                  className="ms-2"
                >
                  {user.active ? 'Deactivate' : 'Activate'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      {selectedUser && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="userName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="userRole" className="mt-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default UserManagementPage;
