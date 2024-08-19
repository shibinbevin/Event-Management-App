import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '~/actions';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IFormInput {
    email: string;
    password: string;
}

function Login() {
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', data);
            if (response.data.success) {
                setSuccess('Login Successful');
                setError('');
                dispatch(login(response.data));
            } else {
                setError(response.data.msg);
                setSuccess('');
            }
        } catch (error) {
            console.error('Invalid Credentials', error);
            setError('Invalid Credentials');
            setSuccess('');
        }
    };

    return (
        <>
            <Container>
                <Row className="py-5 mt-4 align-items-center">
                    {/* For Demo Purpose */}
                    <Col md={5} className="pr-lg-5 mb-5 mb-md-0">
                        <img
                            src="https://bootstrapious.com/i/snippets/sn-registeration/illustration.svg"
                            alt=""
                            className="img-fluid mb-3 d-none d-md-block"
                        />
                        <h1>Login to your Account</h1>
                    </Col>
                    {/* Login Form */}
                    <Col md={7} lg={6}>
                        {/* Success Alert */}
                        {success && (
                            <Col lg={10}>
                                <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                                    {success}
                                </Alert>
                            </Col>
                        )}
                        {/* Error Alert */}
                        {error && (
                            <Col lg={10}>
                                <Alert variant="danger" onClose={() => setError('')} dismissible>
                                    {error}
                                </Alert>
                            </Col>
                        )}
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                {/* Email Address */}
                                <Col lg={12} className="mb-4">
                                    <Form.Group controlId="email">
                                        <Form.Control
                                            type="email"
                                            placeholder="Email Address"
                                            className={`bg-white border-left-0 border-md ${errors.email ? 'is-invalid' : ''}`}
                                            {...register('email', { 
                                                required: 'Email is required', 
                                                pattern: { 
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                                                    message: 'Invalid email address' 
                                                } 
                                            })}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                {/* Password */}
                                <Col lg={12} className="mb-4">
                                    <Form.Group controlId="password">
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            className={`bg-white border-left-0 border-md ${errors.password ? 'is-invalid' : ''}`}
                                            {...register('password', { required: 'Password is required' })}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password.message}
                                            </div>
                                        )}
                                    </Form.Group>
                                </Col>
                                {/* Submit Button */}
                                <Col lg={12} className="mx-auto mb-4">
                                    <Button type="submit" className="btn-block py-2" variant="primary">
                                        <span className="font-weight-bold">Login</span>
                                    </Button>
                                </Col>
                                {/* Not Registered */}
                                <Col lg={12}>
                                    <p className="text-muted font-weight-bold">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-primary ml-2">Sign Up</Link>
                                    </p>
                                </Col>
                                {/* Forgot Password */}
                                <Col lg={12}>
                                    <p className="text-muted font-weight-bold">
                                        Forgot your password?{' '}
                                        <Link to="/forgot-password" className="text-primary ml-2">Reset Password</Link>
                                    </p>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Login;
