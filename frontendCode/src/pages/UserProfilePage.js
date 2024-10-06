import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Image, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { localIP } from '../components/GetLocalIpAddress';

const UserProfilePage = () => {
  const [userData, setUserData] = useState({
    email: '',
    phoneNumber: '',
    profilePicture: '',
  });
  const [travelHistory, setTravelHistory] = useState([]);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data: userDetails } = await axios.get(`http://${localIP}:5000/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data: history } = await axios.get(`http://${localIP}:5000/api/user/travel-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(userDetails);
      setTravelHistory(history);
      setNewProfilePicture(null)
    } catch (error) {
      setError('Failed to fetch user data.');
      console.error(error);
    }
  };
  useEffect(() => {
    // Fetch user details and travel history on component mount
    

    fetchUserProfile();
  }, []);

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    setNewProfilePicture(e.target.files[0]);
  };

  // Handle contact info update
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle form submission for profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
  
      // 1. Update Profile Info
      const profileData = {
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      };
  
      await axios.put(`http://${localIP}:5000/api/user/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
  
      // 2. Upload Profile Picture (if any)
      if (newProfilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', newProfilePicture);
  
        await axios.put(`http://${localIP}:5000/api/user/profile-picture`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchUserProfile();
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError('Failed to update profile.');
      console.error(error);
    }
  };
  
  return (
    <Container>
      <h1>User Profile</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleUpdateProfile}>
        <Row>
          <Col md={4}>
            <Image 
              src={userData.profilePicture || '/default-profile.png'} 
              roundedCircle 
              fluid 
              style={{ maxWidth: '150px', maxHeight: '150px' }}
            />
            <Form.Group controlId="formProfilePicture" className="mt-3">
              <Form.Label>Change Profile Picture</Form.Label>
              <Form.Control 
                type="file" 
                accept="image/*" 
                onChange={handleProfilePictureChange} 
              />
              {newProfilePicture && (
                <div className="mt-2">
                  <Image 
                    src={URL.createObjectURL(newProfilePicture)} 
                    roundedCircle 
                    fluid 
                    style={{ maxWidth: '150px', maxHeight: '150px' }}
                  />
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Update Profile
            </Button>
          </Col>
        </Row>
      </Form>

      <h2 className="mt-4">Travel History</h2>
      <ListGroup>
        {travelHistory.map((trip) => (
          <ListGroup.Item key={trip._id}>
            <h5>{trip.destination}</h5>
            <p>{new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h2 className="mt-4">Account Settings</h2>
      {/* Here you can add fields for changing the password and managing notification preferences */}
    </Container>
  );
};

export default UserProfilePage;
