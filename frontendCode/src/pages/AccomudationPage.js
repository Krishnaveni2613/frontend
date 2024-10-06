import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, InputGroup, FormControl, Col, Row, Card } from 'react-bootstrap';
import axios from 'axios';
import { localIP } from '../components/GetLocalIpAddress';
// import MapView from './MapView';
import ChatSupport from './ChatSupport'; // Assuming you have a ChatSupport component

const AccommodationPage = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [show, setShow] = useState(false);
  const [newAccommodation, setNewAccommodation] = useState({
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    type: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editAccommodation, setEditAccommodation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ location: '', priceRange: '', amenities: [], rating: '', type: '' });
  const [sortOption, setSortOption] = useState('price');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://${localIP}:5000/api/accommodations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccommodations(data);
        setFilteredAccommodations(data);
      } catch (error) {
        console.error('Failed to fetch accommodations:', error);
      }
    };

    fetchAccommodations();
  }, []);

  useEffect(() => {
    let results = accommodations.filter(acc => {
      return (
        (searchQuery ? acc.destination.toLowerCase().includes(searchQuery.toLowerCase()) : true) &&
        (filters.location ? acc.destination.toLowerCase().includes(filters.location.toLowerCase()) : true) &&
        (filters.type ? acc.type === filters.type : true) &&
        (filters.priceRange ? acc.priceRange <= filters.priceRange : true) &&
        (filters.rating ? acc.rating >= filters.rating : true)
      );
    });

    if (sortOption === 'price') {
      results = results.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'rating') {
      results = results.sort((a, b) => b.rating - a.rating);
    }

    setFilteredAccommodations(results);
  }, [searchQuery, filters, sortOption, accommodations]);

  const handleShow = (accommodation = null) => {
    setEditMode(!!accommodation);
    setEditAccommodation(accommodation);
    setNewAccommodation(accommodation || {
      destination: '',
      checkInDate: '',
      checkOutDate: '',
      type: ''
    });
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    setNewAccommodation({ ...newAccommodation, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateAccommodation = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        await axios.put(`http://${localIP}:5000/api/accommodations/${editAccommodation._id}`, newAccommodation, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccommodations(accommodations.map(acc => acc._id === editAccommodation._id ? newAccommodation : acc));
      } else {
        const { data } = await axios.post(`http://${localIP}:5000/api/accommodations`, newAccommodation, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccommodations([...accommodations, data]);
      }
      handleClose();
    } catch (error) {
      console.error('Failed to add or update accommodation:', error);
    }
  };


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://${localIP}:5000/api/accommodations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccommodations(accommodations.filter(acc => acc._id !== id));
    } catch (error) {
      console.error('Failed to delete accommodation:', error);
    }
  };
  return (
    <Container>
      <h1>Accommodations</h1>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by destination"
          aria-label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={() => setSearchQuery('')}>Clear</Button>
      </InputGroup>

      <Row>
        <Col sm={6}>
          <Form.Group controlId="formFilters">
            <Form.Label>Filters</Form.Label>
            <Form.Control
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
            <Form.Control
              as="select"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Type</option>
              <option value="hotel">Hotel</option>
              <option value="hostel">Hostel</option>
              <option value="apartment">Apartment</option>
              {/* Add more types as needed */}
            </Form.Control>
            <Form.Control
              type="number"
              placeholder="Price Range"
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            />
            <Form.Control
              type="number"
              placeholder="Rating"
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="formSort">
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
              <option value="popularity">Popularity</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Button variant="primary" onClick={() => handleShow(null)}>Add New Accommodation</Button>

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Images</th>
            <th>Destination</th>
            <th>Check-In Date</th>
            <th>Check-Out Date</th>
            <th>Type</th>
            <th>Description</th>
            <th>Amenities</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAccommodations.map(acc => (
            <tr key={acc._id}>
              <td><img src={acc.images[0]} alt={acc.destination} width="100" /></td>
              <td>{acc.destination}</td>
              <td>{new Date(acc.checkInDate).toLocaleDateString()}</td>
              <td>{new Date(acc.checkOutDate).toLocaleDateString()}</td>
              <td>{acc.type}</td>
              <td>{acc.description}</td>
              <td>{acc.amenities.join(', ')}</td>
              <td>{acc.rating}</td>
              <td>
                <Button variant="warning" onClick={() => handleShow(acc)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(acc._id)}>Delete</Button>
                <Button variant="info" onClick={() => setShowMap(true)}>View on Map</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Accommodation' : 'Add New Accommodation'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDestination">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                value={newAccommodation.destination}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCheckInDate">
              <Form.Label>Check-In Date</Form.Label>
              <Form.Control
                type="date"
                name="checkInDate"
                value={newAccommodation.checkInDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCheckOutDate">
              <Form.Label>Check-Out Date</Form.Label>
              <Form.Control
                type="date"
                name="checkOutDate"
                value={newAccommodation.checkOutDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={newAccommodation.type}
                onChange={handleChange}
              >
                <option value="hotel">Hotel</option>
                <option value="hostel">Hostel</option>
                <option value="apartment">Apartment</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newAccommodation.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formAmenities">
              <Form.Label>Amenities</Form.Label>
              <Form.Control
                type="text"
                name="amenities"
                value={newAccommodation.amenities}
                onChange={handleChange}
                placeholder="Comma-separated amenities"
              />
            </Form.Group>
            <Form.Group controlId="formImages">
              <Form.Label>Images (URL)</Form.Label>
              <Form.Control
                type="text"
                name="images"
                value={newAccommodation.images}
                onChange={handleChange}
                placeholder="Comma-separated image URLs"
              />
            </Form.Group>
            <Form.Group controlId="formRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={newAccommodation.rating}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleAddOrUpdateAccommodation}>
            {editMode ? 'Update Accommodation' : 'Add Accommodation'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* {showMap && (
        <Modal show={showMap} onHide={() => setShowMap(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Map View</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MapView accommodations={accommodations} />
          </Modal.Body>
        </Modal>
      )} */}

      <ChatSupport />

    </Container>
  );
};

export default AccommodationPage;
