import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IFormInput {
    email: string;
}

function ForgotPassword() {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/get-security-question', { email: data.email });
            if (response.data.success) {
                setError('');
                navigate('/reset-password', { state: { email: data.email, security_question: response.data.security_question } });
            } else {
                setError(response.data.msg);
            }
        } catch (error: any) {
            console.error('Error retrieving security question', error);
            setError(error.response.data.msg);
        }
    };

    return (
        <Container>
            <Row className="py-5 mt-4 align-items-center">
                <Col md={5} className="pr-lg-5 mb-5 mb-md-0">
                    <img
                        src="https://bootstrapious.com/i/snippets/sn-registeration/illustration.svg"
                        alt=""
                        className="img-fluid mb-3 d-none d-md-block"
                    />
                    <h1>Forgot Password</h1>
                </Col>
                <Col md={7} lg={6} className="ml-auto">
                    {error && (
                        <Alert variant="danger" onClose={() => setError('')} dismissible>
                            {error}
                        </Alert>
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
                            <Col lg={12} className="mx-auto mb-4">
                                <Button type="submit" className="btn-block py-2" variant="primary">
                                    <span className="font-weight-bold">Get Security Question</span>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ForgotPassword;
