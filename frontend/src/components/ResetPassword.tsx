import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IFormInput {
    newPassword: string;
    security_answer: string;
}

function ResetPassword() {
    const location = useLocation();
    const { email, security_question } = location.state;
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const response = await axios.post('http://localhost:5000/api/users/reset-password', {
                email,
                security_answer: data.security_answer,
                newPassword: data.newPassword
            });
            if (response.data.success) {
                setSuccess('Password reset successful');
                setError('');
                setTimeout(() => {
                    navigate('/login');
                }, 3000); // Redirect to login after 3 seconds
            } else {
                setError(response.data.msg);
                setSuccess('');
            }
        } catch (error: any) {
            console.error('Error resetting password', error);
            setError(error.response.data.msg);
            setSuccess('');
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
                    <h1>Reset Password</h1>
                </Col>
                <Col md={7} lg={6} className="ml-auto">
                    {error && (
                        <Alert variant="danger" onClose={() => setError('')} dismissible>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                            {success}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col lg={12} className="mb-4">
                                <Form.Group controlId="security_question">
                                    <Form.Label>{security_question}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Security Answer"
                                        className={`bg-white border-left-0 border-md ${errors.security_answer ? 'is-invalid' : ''}`}
                                        {...register('security_answer', { required: 'Security answer is required' })}
                                    />
                                    {errors.security_answer && (
                                        <div className="invalid-feedback">
                                            {errors.security_answer.message}
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={12} className="mb-4">
                                <Form.Group controlId="newPassword">
                                    <Form.Control
                                        type="password"
                                        placeholder="New Password"
                                        className={`bg-white border-left-0 border-md ${errors.newPassword ? 'is-invalid' : ''}`}
                                        {...register('newPassword', {
                                            required: 'New password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters'
                                            }
                                        })}
                                    />
                                    {errors.newPassword && (
                                        <div className="invalid-feedback">
                                            {errors.newPassword.message}
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col lg={12} className="mx-auto mb-4">
                                <Button type="submit" className="btn-block py-2" variant="primary">
                                    <span className="font-weight-bold">Reset Password</span>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ResetPassword;
