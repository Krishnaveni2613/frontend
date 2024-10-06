import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, Form ,Col,Row} from 'react-bootstrap';
import { localIP } from '../components/GetLocalIpAddress';
import TripDetailPage from './TripDetailPage';

const TripListPage = () => {
  const [trips, setTrips] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetail, setShowDetail] = useState(false); // To determine if it's a detail view
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    activities: [{ activityName: '', description: '', date: '' }],
    accommodations: [{ name: '', type: '', address: '', checkInDate: '', checkOutDate: '' }],
    transportation: [{ type: '', departureLocation: '', arrivalLocation: '', departureDate: '', returnDate: '', provider: '' }]
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://${localIP}:5000/api/trips`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTrips(data);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      }
    };

    fetchTrips();
  }, []);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleAddNewTrip = () => {
    setShowDetail(false); // Show the form for adding a new trip
    handleShow();
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setShowDetail(true); // Show the detail view
    handleShow();
  };

  const handleChange = (e, index, field, type) => {
    const updatedData = { ...newTrip };
    updatedData[type][index][field] = e.target.value;
    setNewTrip(updatedData);
  };

  const handleAddTrip = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!newTrip.destination || !newTrip.startDate || !newTrip.endDate || !newTrip.budget ||
          !newTrip.activities.every(activity => activity.activityName && activity.date) ||
          !newTrip.accommodations.every(acc => acc.name && acc.type && acc.address && acc.checkInDate && acc.checkOutDate) ||
          !newTrip.transportation.every(trans => trans.type && trans.departureLocation && trans.arrivalLocation && trans.departureDate)) {
        alert("Please fill in all required fields.");
        return;
      }

      const tripData = {
        destination: newTrip.destination,
        startDate: new Date(newTrip.startDate).toISOString(),
        endDate: new Date(newTrip.endDate).toISOString(),
        budget: parseFloat(newTrip.budget),
        activities: newTrip.activities.map(activity => ({
          activityName: activity.activityName,
          description: activity.description || '',
          date: new Date(activity.date).toISOString()
        })),
        accommodations: newTrip.accommodations.map(acc => ({
          name: acc.name,
          type: acc.type,
          address: acc.address,
          checkInDate: new Date(acc.checkInDate).toISOString(),
          checkOutDate: new Date(acc.checkOutDate).toISOString()
        })),
        transportation: newTrip.transportation.map(trans => ({
          type: trans.type,
          departureLocation: trans.departureLocation,
          arrivalLocation: trans.arrivalLocation,
          departureDate: new Date(trans.departureDate).toISOString(),
          returnDate: trans.returnDate ? new Date(trans.returnDate).toISOString() : undefined,
          provider: trans.provider || ''
        }))
      };

      const { data } = await axios.post(`http://${localIP}:5000/api/trips`, tripData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTrips([...trips, data]);
      handleClose();
    } catch (error) {
      console.error('Failed to add trip:', error);
    }
  };

  return (
    <Container>
      <h1 className="my-4">Trips</h1>
      <Button variant="primary" onClick={handleAddNewTrip}>Add New Trip</Button>

      <Table className="mt-4" striped bordered hover>
        <thead>
          <tr>
            <th>Destination</th>
            <th>Dates</th>
            <th>Budget</th>
            <th>Activities</th>
            <th>Accommodations</th>
            <th>Transportation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map(trip => (
            <tr key={trip._id}>
              <td>{trip.destination}</td>
              <td>{`${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`}</td>
              <td>${trip.budget}</td>
              <td>{trip.activities.map(a => a.activityName).join(', ')}</td>
              <td>{trip.accommodations.map(a => a.name).join(', ')}</td>
              <td>{trip.transportation.map(t => t.type).join(', ')}</td>
              <td>
                <Button variant="info" onClick={() => handleViewDetails(trip)}>View Details</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{showDetail ? `Trip Details - ${selectedTrip?.destination}` : 'Add New Trip'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showDetail && selectedTrip ? (
            <TripDetailPage trip={selectedTrip} />
          ) : (
            <Form>
            <Form.Group as={Row} controlId="formDestination">
              <Form.Label column sm={3}>Destination</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="text"
                  name="destination"
                  value={newTrip.destination}
                  onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                  placeholder="Enter destination"
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formStartDate">
              <Form.Label column sm={3}>Start Date</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={newTrip.startDate}
                  onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formEndDate">
              <Form.Label column sm={3}>End Date</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={newTrip.endDate}
                  onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formBudget">
              <Form.Label column sm={3}>Budget</Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="number"
                  name="budget"
                  value={newTrip.budget}
                  onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
                  placeholder="Enter budget"
                  required
                />
              </Col>
            </Form.Group>

            <Form.Group controlId="formActivities">
              <Form.Label>Activities</Form.Label>
              {newTrip.activities.map((activity, index) => (
                <div key={index} className="mb-3 p-3 border rounded">
                  <Row>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        name="activityName"
                        value={activity.activityName}
                        onChange={(e) => handleChange(e, index, 'activityName', 'activities')}
                        placeholder="Activity Name"
                        required
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="text"
                        name="description"
                        value={activity.description}
                        onChange={(e) => handleChange(e, index, 'description', 'activities')}
                        placeholder="Description"
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Control
                        type="date"
                        name="date"
                        value={activity.date}
                        onChange={(e) => handleChange(e, index, 'date', 'activities')}
                        required
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </Form.Group>

            <Form.Group controlId="formAccommodations">
              <Form.Label>Accommodations</Form.Label>
              {newTrip.accommodations.map((acc, index) => (
                <div key={index} className="mb-3 p-3 border rounded">
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        name="name"
                        value={acc.name}
                        onChange={(e) => handleChange(e, index, 'name', 'accommodations')}
                        placeholder="Accommodation Name"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        name="type"
                        value={acc.type}
                        onChange={(e) => handleChange(e, index, 'type', 'accommodations')}
                        placeholder="Type"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        name="address"
                        value={acc.address}
                        onChange={(e) => handleChange(e, index, 'address', 'accommodations')}
                        placeholder="Address"
                        required
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="date"
                        name="checkInDate"
                        value={acc.checkInDate}
                        onChange={(e) => handleChange(e, index, 'checkInDate', 'accommodations')}
                        placeholder="Check-In Date"
                        required
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="date"
                        name="checkOutDate"
                        value={acc.checkOutDate}
                        onChange={(e) => handleChange(e, index, 'checkOutDate', 'accommodations')}
                        placeholder="Check-Out Date"
                        required
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </Form.Group>

            <Form.Group controlId="formTransportation">
              <Form.Label>Transportation</Form.Label>
              {newTrip.transportation.map((trans, index) => (
                <div key={index} className="mb-3 p-3 border rounded">
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        name="type"
                        value={trans.type}
                        onChange={(e) => handleChange(e, index, 'type', 'transportation')}
                        placeholder="Type"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        name="departureLocation"
                        value={trans.departureLocation}
                        onChange={(e) => handleChange(e, index, 'departureLocation', 'transportation')}
                        placeholder="Departure Location"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        name="arrivalLocation"
                        value={trans.arrivalLocation}
                        onChange={(e) => handleChange(e, index, 'arrivalLocation', 'transportation')}
                        placeholder="Arrival Location"
                        required
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="date"
                        name="departureDate"
                        value={trans.departureDate}
                        onChange={(e) => handleChange(e, index, 'departureDate', 'transportation')}
                        placeholder="Departure Date"
                        required
                      />
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        type="date"
                        name="returnDate"
                        value={trans.returnDate}
                        onChange={(e) => handleChange(e, index, 'returnDate', 'transportation')}
                        placeholder="Return Date"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        name="provider"
                        value={trans.provider}
                        onChange={(e) => handleChange(e, index, 'provider', 'transportation')}
                        placeholder="Provider"
                      />
                    </Col>
                  </Row>
                </div>
              ))}
            </Form.Group>

            <Button variant="primary" onClick={handleAddTrip}>Add Trip</Button>
          </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TripListPage;
