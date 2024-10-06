import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { localIP } from '../components/GetLocalIpAddress';

const RegisterScreen = () => {
    const navigate = useNavigate();

    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email format').required('Required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
    });

    const onSubmit = async (values) => {
        try {
            const { data } = await axios.post(`http://${localIP}:5000/api/auth/register`, {
                username: values.name,
                email: values.email,
                password: values.password,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container" style={{ padding: "50px 50px 70px 50px", width: "500px", backgroundColor: "#F2F2F2", marginTop: "130px", borderRadius: "10px", boxShadow: "initial" }}>
            <h2 style={{ textAlign: "center" }}>Register</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-group" style={{ marginTop: "30px" }}>
                            <Field type="text" id="name" name="name" className="form-control" placeholder="Name" />
                            <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>
                        <div className="form-group" style={{ marginTop: "30px" }}>
                            <Field type="email" id="email" name="email" className="form-control" placeholder="Email" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                        <div className="form-group" style={{ marginTop: "30px" }}>
                            <Field type="password" id="password" name="password" className="form-control" placeholder="Password" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                        <div className="form-group" style={{ marginTop: "30px" }}>
                            <Field type="password" id="confirmPassword" name="confirmPassword" className="form-control" placeholder="Confirm Password" />
                            <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                        </div>
                        <div style={{ marginTop: "30px", textAlign: "center" }}>
                            <button type="submit" className="btn btn-primary" style={{ width: "150px" }} disabled={isSubmitting}>
                                Register
                            </button>
                        </div>
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <span className="text-gray-600">Have an account? </span>
                            <Link to="/login" className="text-indigo-500 hover:underline">
                                Login Here
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default RegisterScreen;
