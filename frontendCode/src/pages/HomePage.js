import React from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../HomePage.css'; // Custom CSS for additional styling

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="#home">Travel Planner</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero Section */}
      <header className="hero bg-primary text-white text-center py-5">
        <Container>
          <h1>Welcome to the Travel Planner</h1>
          <p>Your ultimate solution for travel planning and booking.</p>
          <Row className="justify-content-center mt-4">
            <Col md={4}>
              <Button variant="light" size="lg" onClick={handleRegisterClick}>
                Join Us - Start Your Journey Today!
              </Button>
            </Col>
            <Col md={4}>
              <Button variant="outline-light" size="lg" onClick={handleLoginClick}>
                Already Have an Account? Log In!
              </Button>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Features Section */}
      <Container className="my-5">
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Plan Your Trip</Card.Title>
                <Card.Text>
                  Organize your travel itinerary with ease and manage your plans efficiently.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Book Accommodations</Card.Title>
                <Card.Text>
                  Find and book the best accommodations to suit your travel needs.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Track Expenses</Card.Title>
                <Card.Text>
                  Keep track of your travel expenses and stay within your budget.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* About Section */}
      <section id="about" className="py-5 bg-light">
        <Container>
          <Row>
            <Col md={6}>
              <h2>About Us</h2>
              <p>
                Travel Planner is designed to help you plan and manage your trips with ease. Whether you're planning a vacation or a business trip, we have the tools to make your experience seamless and enjoyable.
              </p>
            </Col>
            <Col md={6}>
              {/* <img src={require("../components/about.png")} alt="Travel Planning" className="img-fluid" /> */}
              <img src={""} alt="Travel Planning" className="img-fluid" />

            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <Container>
          <h2>Contact Us</h2>
          <form>
            <Row>
              <Col md={6}>
                <input type="text" className="form-control mb-3" placeholder="Name" />
                <input type="email" className="form-control mb-3" placeholder="Email" />
                <textarea className="form-control mb-3" placeholder="Message" rows="4"></textarea>
                <Button variant="primary" type="submit">Send Message</Button>
              </Col>
            </Row>
          </form>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
