import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { localIP } from '../components/GetLocalIpAddress';

const ExpenseListPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [show, setShow] = useState(false);
  const [newExpense, setNewExpense] = useState({
    tripId: '',
    amount: '',
    description: '',
    date: '' 
  });
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Fetch expenses and trips from the server
    const token = localStorage.getItem('token');
    axios.get(`http://${localIP}:5000/api/expenses/expenses/1`,{headers: { Authorization: `Bearer ${token}` }}).then(response => {
      setExpenses(response.data);
    });
    axios.get(`http://${localIP}:5000/api/trips`,{headers: { Authorization: `Bearer ${token}` }}).then(response => {
      setTrips(response.data);
    });
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };

  const handleAddExpense = () => {
    const token = localStorage.getItem('token');

    axios.post(`http://${localIP}:5000/api/expenses/expenses`, newExpense,{headers: { Authorization: `Bearer ${token}` }}).then(response => {
      setExpenses([...expenses, response.data]);
      handleClose();
    });
  };

  return (
    <Container>
      <h1>Expenses</h1>
      <Button variant="primary" onClick={handleShow}>Add New Expense</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Trip</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense._id}>
              <td>{trips.find(trip => trip._id === expense.tripId)?.destination}</td>
              <td>${expense.amount}</td>
              <td>{expense.description}</td>
              <td>{new Date(expense.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTripId">
              <Form.Label>Trip</Form.Label>
              <Form.Control
                as="select"
                name="tripId"
                value={newExpense.tripId}
                onChange={handleChange}
              >
                <option>Select a trip</option>
                {trips.map(trip => (
                  <option key={trip._id} value={trip._id}>
                    {trip.destination}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={newExpense.amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newExpense.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newExpense.date}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddExpense}>
              Add Expense
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ExpenseListPage;
