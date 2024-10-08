import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '~/actions';
import { Link } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { IFormInput } from '~/types';
import { STATUS } from '~/literals';
import { selectUser } from '~/selectors';

function Login() {
    const dispatch = useDispatch();
    const [errorState, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

    // Select authentication status and error messages from the Redux state
    const { status, isAuthenticated, error } = useSelector(selectUser);

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        dispatch(login(data));
    };

    // Use useEffect to handle side effects based on status changes
    useEffect(() => {
        if (status === STATUS.READY && isAuthenticated) {
            setSuccess('Login Successful');
            setError('');
        } else if (status === STATUS.FAILED) {  // Assuming you have a FAILED status
            setError(error);
            setSuccess('');
        }
    }, [status, isAuthenticated]);

    return (
        <>
            <Container>
                <Row className="py-5 mt-4 align-items-center">
                    <Col md={5} className="pr-lg-5 mb-5 mb-md-0">
                        <img
                            src="https://bootstrapious.com/i/snippets/sn-registeration/illustration.svg"
                            alt=""
                            className="img-fluid mb-3 d-none d-md-block"
                        />
                        <h1>Login to your Account</h1>
                    </Col>
                    <Col md={7} lg={6}>
                        {success && (
                            <Col lg={10}>
                                <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                                    {success}
                                </Alert>
                            </Col>
                        )}
                        {errorState && (
                            <Col lg={10}>
                                <Alert variant="danger" onClose={() => setError('')} dismissible>
                                    {error}
                                </Alert>
                            </Col>
                        )}
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
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
                                <Col lg={12} className="mx-auto mb-4">
                                    <Button type="submit" className="btn-block py-2" variant="primary" disabled={status === STATUS.RUNNING}>
                                        <span className="font-weight-bold">Login</span>
                                    </Button>
                                </Col>
                                <Col lg={12}>
                                    <p className="text-muted font-weight-bold">
                                        Don't have an account?{' '}
                                        <Link to="/register" className="text-primary ml-2">Sign Up</Link>
                                    </p>
                                </Col>
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
