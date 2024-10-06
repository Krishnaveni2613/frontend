import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import { localIP } from '../components/GetLocalIpAddress';
import { jwtDecode } from 'jwt-decode';

const LoginScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email format').required('Required'),
        password: Yup.string().required('Required'),
    });

    // const onSubmit = async (values) => {
    //     try {
    //         // Send login request to backend
    //         const { data } = await axios.post(`http://${localIP}:5000/api/auth/login`, {
    //             email: values.email,
    //             password: values.password,
    //         });
    
    //         // Assuming `data.token` contains the JWT token
    //         const token = data.token;
    
    //         // Decode the token to extract user information
    //         const decodedToken = jwtDecode(token);
    //         console.log('Decoded token:', decodedToken);
    
    //         // Assuming the role is stored in the `role` field within the token
    //         const userRole = decodedToken.role;
    
    //         // Store the token and role in local storage
    //         localStorage.setItem('token', token);
    //         localStorage.setItem('role', userRole);
    
    //         // Navigate based on the role
    //         if (userRole === 'admin') {
    //             navigate('/admin'); // Redirect to admin dashboard
    //         } else {
    //             navigate('/trips'); // Redirect to user trips page
    //         }
    //     } catch (error) {
    //         console.error('Login error:', error);
    //         alert('Login failed. Please try again.');
    //     }
    // };


    const onSubmit = async (values) => {
        try {
            // Send login request to backend
            const { data } = await axios.post(`http://localhost:5000/api/auth/login`, {
                email: values.email,
                password: values.password,
            });
    
            // Assuming `data.token` contains the JWT token
            const token = data.token;
    
            // Decode the token to extract user information
            const decodedToken = jwtDecode(token);
            console.log('Decoded token:', decodedToken,token);
    
            // Assuming the role is stored in the `role` field within the token
            const userRole = decodedToken.role;
    
            // Store the token and role in local storage
            localStorage.setItem('token', token);
            localStorage.setItem('role', userRole);
    
            // Check role and navigate accordingly
            if (userRole === 'admin') {
                navigate('/admin'); // Redirect to admin dashboard
            } else {
                navigate('/trips'); // Redirect to user trips page
            }
        } catch (error) {
            console.error('Login error:', error.response || error.message);  // Log the full error response
            alert('Login failed. Please try again.');
        }
    };
    
    return (
        <div className="container" style={{ padding: "50px 50px 100px 50px", width: "400px", backgroundColor: "#F2F2F2", marginTop: "130px", borderRadius: "10px", boxShadow: "initial" }}>
            <h2 style={{ textAlign: "center" }}>Login</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-group" style={{ marginTop: "30px" }}>
                            <Field type="email" id="email" name="email" placeholder="Email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                        <div className="form-group" style={{ marginTop: "30px" }}>
                            <Field type="password" id="password" name="password" placeholder="Password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                        <div style={{ marginTop: "30px", textAlign: "center" }}>
                            <button type="submit" className="btn btn-primary" style={{ width: "250px" }} disabled={isSubmitting}>
                                Login
                            </button>
                        </div>
                        <div style={{ marginTop: "60px", textAlign: "center" }}>
                            <span className="text-gray-600">Don't have an account? </span>
                            <Link to="/register" className="text-indigo-500 hover:underline">
                                Register
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LoginScreen;
