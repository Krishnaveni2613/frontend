import React from 'react';
import { Container, Card, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Make sure this path is correct

const TripDetailPage = ({ trip }) => {
  const {
    destination,
    startDate,
    endDate,
    budget,
    activities,
    accommodations,
    transportation
  } = trip;

  return (
    <Container className="my-5">
      <Card className="mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Body>
          <Card.Title className="text-center">
            <h2 className="font-weight-bold">{`Trip to ${destination}`}</h2>
            <h5 className="text-muted">{`${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`}</h5>
          </Card.Title>
          <Row className="justify-content-center">
            <Col md={6} lg={4}>
              <Card className="mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-cash"></i> Budget
                  </Card.Title>
                  <Card.Text>
                    <Badge pill bg="success" className="text-dark" style={{ fontSize: '1.25rem' }}>
                      ${budget}
                    </Badge>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-calendar-check"></i> Activities
                  </Card.Title>
                  <ListGroup variant="flush">
                    {activities.map((activity, index) => (
                      <ListGroup.Item key={index} className="d-flex align-items-start">
                        <i className="bi bi-geo-alt me-2"></i>
                        <div>
                          <strong>{activity.activityName}</strong>
                          <p className="mb-1">{activity.description}</p>
                          <small className="text-muted">Date: {new Date(activity.date).toLocaleDateString()}</small>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-house-door"></i> Accommodations
                  </Card.Title>
                  {accommodations.map((accommodation, index) => (
                    <Card key={index} className="mb-2" style={{ borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                      <Card.Body>
                        <Card.Title>
                          <strong>{accommodation.name}</strong>
                        </Card.Title>
                        <Card.Text>
                          <p><i className="bi bi-type"></i> Type: {accommodation.type}</p>
                          <p><i className="bi bi-geo-alt"></i> Address: {accommodation.address}</p>
                          <p><i className="bi bi-calendar"></i> Check-In: {new Date(accommodation.checkInDate).toLocaleDateString()}</p>
                          <p><i className="bi bi-calendar-x"></i> Check-Out: {new Date(accommodation.checkOutDate).toLocaleDateString()}</p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={4}>
              <Card className="mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Body>
                  <Card.Title>
                    <i className="bi bi-car-front"></i> Transportation
                  </Card.Title>
                  {transportation.map((transport, index) => (
                    <Card key={index} className="mb-2" style={{ borderRadius: '10px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                      <Card.Body>
                        <Card.Title>
                          <strong>{transport.type}</strong>
                        </Card.Title>
                        <Card.Text>
                          <p><i className="bi bi-geo-alt"></i> Departure Location: {transport.departureLocation}</p>
                          <p><i className="bi bi-geo-alt"></i> Arrival Location: {transport.arrivalLocation}</p>
                          <p><i className="bi bi-calendar"></i> Departure Date: {new Date(transport.departureDate).toLocaleDateString()}</p>
                          <p><i className="bi bi-calendar-x"></i> Return Date: {new Date(transport.returnDate).toLocaleDateString()}</p>
                          <p><i className="bi bi-truck"></i> Provider: {transport.provider}</p>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TripDetailPage;
