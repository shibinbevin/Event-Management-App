import React from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

interface IFormInput {
  email: string;
  name: string;
  dob: string;
  password: string;
  security_question: string;
  security_answer: string;
}

const securityQuestions = [
  'What was your childhood nickname?',
  'What is the name of your favorite childhood friend?',
  'What was the name of your first pet?',
  'In what city did you meet your spouse/significant other?',
  'What is your favorite movie?',
];

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const [error, setError] = React.useState<string>('');
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', data);

      if (response.data.success) {
        console.log('User registered successfully:', response.data);
        navigate('/login');
      } else {
        setError(response.data.msg);
      }
    } catch (error: any) {
      console.error('There was an error registering the user:', error);
      setError(error.response?.data?.msg || 'An error occurred');
    }
  };

  return (
    <>
      {error && (
        <Col lg={10} className="mx-auto mb-4">
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        </Col>
      )}
      <Container>
        <Row className="py-5 mt-4 align-items-center">
          {/* For Demo Purpose */}
          <Col md={5} className="pr-lg-5 mb-5 mb-md-0">
            <img
              src="https://bootstrapious.com/i/snippets/sn-registeration/illustration.svg"
              alt=""
              className="img-fluid mb-3 d-none d-md-block"
            />
            <h1>Register User</h1>
          </Col>
          {/* Registration Form */}
          <Col md={7} lg={6} className="ml-auto">
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
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                  </Form.Group>
                </Col>
                {/* Name */}
                <Col lg={12} className="mb-4">
                  <Form.Group controlId="name">
                    <Form.Control
                      type="text"
                      placeholder="Name"
                      className={`bg-white border-left-0 border-md ${errors.name ? 'is-invalid' : ''}`}
                      {...register('name', { required: 'Name is required',
                      minLength: {
                        value: 3,
                        message: 'Name should contain at least 3 characters'
                      },
                      maxLength: {
                        value: 15,
                        message: 'Name should not be more than 15 characters long'
                      }
                     })}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                  </Form.Group>
                </Col>
                {/* Date of Birth */}
                <Col lg={12} className="mb-4">
                  <Form.Group controlId="dob">
                    <Form.Control
                      type="date"
                      placeholder="Date of Birth"
                      className={`bg-white border-left-0 border-md ${errors.dob ? 'is-invalid' : ''}`}
                      {...register('dob', { required: 'Date of Birth is required' })}
                    />
                    {errors.dob && <div className="invalid-feedback">{errors.dob.message}</div>}
                  </Form.Group>
                </Col>
                {/* Password */}
                <Col lg={12} className="mb-4">
                  <Form.Group controlId="password">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      className={`bg-white border-left-0 border-md ${errors.password ? 'is-invalid' : ''}`}
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </Form.Group>
                </Col>
                {/* Security Question */}
                <Col lg={12} className="mb-4">
                  <Form.Group controlId="security_question">
                    <Form.Control
                      as="select"
                      className={`bg-white border-left-0 border-md ${errors.security_question ? 'is-invalid' : ''}`}
                      {...register('security_question', { required: 'Security question is required' })}
                    >
                      <option value="">Select a security question...</option>
                      {securityQuestions.map((question, index) => (
                        <option key={index} value={question}>
                          {question}
                        </option>
                      ))}
                    </Form.Control>
                    {errors.security_question && <div className="invalid-feedback">{errors.security_question.message}</div>}
                  </Form.Group>
                </Col>
                {/* Security Answer */}
                <Col lg={12} className="mb-4">
                  <Form.Group controlId="security_answer">
                    <Form.Control
                      type="text"
                      placeholder="Security Answer"
                      className={`bg-white border-left-0 border-md ${errors.security_answer ? 'is-invalid' : ''}`}
                      {...register('security_answer', { required: 'Security answer is required' })}
                    />
                    {errors.security_answer && <div className="invalid-feedback">{errors.security_answer.message}</div>}
                  </Form.Group>
                </Col>
                {/* Submit Button */}
                <Col lg={12} className="mx-auto mb-4">
                  <Button type="submit" className="btn-block py-2" variant="primary">
                    <span className="font-weight-bold">Sign Up</span>
                  </Button>
                </Col>
                {/* Already Registered */}
                <Col lg={12}>
                  <p className="text-muted font-weight-bold">
                    Already have an Account?{' '}
                    <Link to="/login" className="text-primary ml-2">Sign In</Link>
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

export default Register;
