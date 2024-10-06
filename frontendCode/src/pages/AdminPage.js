import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert } from 'react-bootstrap';
// import io from 'socket.io-client'; // For real-time notifications

// const socket = io('http://localhost:5000'); // Adjust the URL to your backend

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    userCount: 0,
    activeBookings: 0,
    flaggedContent: 0
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch metrics from API
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();

    // // Real-time notifications
    // socket.on('notification', (notification) => {
    //   setNotifications((prevNotifications) => [notification, ...prevNotifications]);
    // });

    // return () => {
    //   socket.off('notification');
    // };
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>Key Metrics</Card.Header>
            <Card.Body>
              <Card.Text>User Count: {metrics.userCount}</Card.Text>
              <Card.Text>Active Bookings: {metrics.activeBookings}</Card.Text>
              <Card.Text>Flagged Content: {metrics.flaggedContent}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card>
            <Card.Header>Notifications</Card.Header>
            <Card.Body>
              {notifications.length === 0 ? (
                <Alert variant="info">No new notifications</Alert>
              ) : (
                <ListGroup>
                  {notifications.map((notif, index) => (
                    <ListGroup.Item key={index}>{notif.message}</ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header>Manage Content</Card.Header>
            <Card.Body>
              <Button variant="primary">Approve/Deny Content</Button>
              <Button variant="secondary" className="ms-2">View Reports</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
