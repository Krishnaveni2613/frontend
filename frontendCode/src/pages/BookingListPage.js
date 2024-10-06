import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { localIP } from '../components/GetLocalIpAddress';
const BookingListPage = () => {
  const [bookings, setBookings] = useState([]);
  const [show, setShow] = useState(false);
  const [newBooking, setNewBooking] = useState({
    tripId: '',
    userId: '',
    bookingDate: ''
  });
  const [trips, setTrips] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://${localIP}:5000/api/bookings/bookings`,{headers: { Authorization: `Bearer ${token}` }}).then(response => {
      setBookings(response.data);
    });
    axios.get(`http://${localIP}:5000/api/trips`,{headers: { Authorization: `Bearer ${token}` }}).then(response => {
      setTrips(response.data);
    });
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    setNewBooking({ ...newBooking, [e.target.name]: e.target.value });
  };

  const handleAddBooking = () => {
    axios.post(`http://${localIP}:5000/api/bookings/bookings`, newBooking,{headers: { Authorization: `Bearer ${token}` }}).then(response => {
      setBookings([...bookings, response.data]);
      handleClose();
    });
  };

  return (
    <Container>
      <h1>Bookings</h1>
      <Button variant="primary" onClick={handleShow}>Add New Booking</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Trip</th>
            <th>User</th>
            <th>Booking Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id}>
              <td>{trips.find(trip => trip._id === booking.tripId)?.destination}</td>
              <td>{booking.userId}</td>
              <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTripId">
              <Form.Label>Trip</Form.Label>
              <Form.Control
                as="select"
                name="tripId"
                value={newBooking.tripId}
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
            <Form.Group controlId="formUserId">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                name="userId"
                value={newBooking.userId}
                onChange={handleChange}
                placeholder="Enter user ID"
              />
            </Form.Group>
            <Form.Group controlId="formBookingDate">
              <Form.Label>Booking Date</Form.Label>
              <Form.Control
                type="date"
                name="bookingDate"
                value={newBooking.bookingDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddBooking}>
              Add Booking
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BookingListPage;
