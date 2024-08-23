import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, Modal, Button, Card, Container, Row, Col, Badge, Form, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppSelector } from '~/modules/hooks';
import { selectUser } from '~/selectors';

interface EventData {
  event_id?: string;
  event_name: string;
  organizer_name: string;
  event_date: string;
  venue: VenueData;
  category: Category;
  image?: string;
}

interface VenueData {
  venue_id?: string;
  venue_name: string;
  city: string;
  country: string;
  capacity: number;
}

interface Category {
  category_id?: string;
  category_name: string;
}

function EventDetail() {
  const { event_id } = useParams();
  const [event, setEvent] = useState<EventData>();
  const [show, setShow] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { user } = useAppSelector(selectUser);

  useEffect(() => {
    const fetching = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/events/getevent/${event_id}`);
        setEvent(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetching();
  }, [event_id]);

  if (!event) {
    return <h1>Not Found</h1>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (user.user_id) {
      try {
        e.preventDefault();
        const response = await axios.post('http://localhost:5000/api/tickets/book', {
          ticket_count: ticketCount,
          event_id,
          user_id: user.user_id
        });

        if (response.data.success) {
          setSuccess('Booking Successful');
          setShow(false);
        }
        else {
          setError(response.data.msg);
        }
      } catch (error: any) {
        setError(error.response?.data?.msg || 'Failed to book tickets.');
      }
    } else {
      setError("Please login to continue");
      setShow(false);
    }
  }

  return (
    <Container className="mt-5">
    {/* Error and Success Alerts */}
    {error && (
      <Col lg={8} className="mx-auto mb-4">
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      </Col>
    )}
    {success && (
      <Col lg={8} className="mx-auto mb-4">
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      </Col>
    )}
 
    <Row className="mb-4">
      <Col md={12} className="d-flex flex-column justify-content-between">
        <Card className="bg-dark text-white shadow-lg mb-4">
          <Card.Img
            variant="top"
            src={`http://localhost:5000/${event.image}`}
            className="img-fluid w-100" // Ensures full width
            style={{
              maxHeight: '300px', // Adjusted height for better fit
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <Card.Body>
            <Card.Title className="mb-3">
              <h2>{event.event_name}</h2>
            </Card.Title>
            <div className="d-flex align-items-center mb-3">
              <Badge bg="success" className="me-2">{event.organizer_name}</Badge>
              <Badge bg="secondary">Free Tickets</Badge>
            </div>
          </Card.Body>
        </Card>
 
        <div className="d-flex flex-column">
          <Card className="mb-4 rounded-4 shadow-sm">
            <Card.Body>
              <h4 className="text-center mb-3"><b>Location</b></h4>
              <p className="text-center"><b>{event.venue.venue_name}</b></p>
              <p className="text-center">{event.venue.city}, {event.venue.country}</p>
              <p className="text-center"><b>On</b>: {event.event_date} 06:30 PM (UTC)</p>
            </Card.Body>
          </Card>
          <Card className="mb-4 rounded-4 shadow-sm">
            <Card.Body className="text-center">
              <h3 className="mb-4">Get Tickets</h3>
              <Button variant="primary" onClick={() => setShow(true)} className="d-flex align-items-center justify-content-center mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-ticket-perforated me-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 4.85v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9z" />
                  <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 0 1 0-3A.5.5 0 0 0 16 6V4.5A1.5 1.5 0 0 0 14.5 3zM1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1.05a2.5 2.5 0 0 0 0 4.9v1.05a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1.05a2.5 2.5 0 0 0 0-4.9z" />
                </svg>
                Buy Now
              </Button>
 
              <Modal show={show} onHide={() => setShow(false)} centered size="lg">
                <Modal.Header closeButton>
                  <Modal.Title className="text-center">{event.venue.venue_name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <div className="mb-3">
                      <Form.Label>No of Tickets</Form.Label>
                      <Form.Range
                        min="1"
                        max="10"
                        value={ticketCount}
                        onChange={(e) => setTicketCount(Number(e.target.value))}
                      />
                    </div>
 
                    <ListGroup className="mb-3">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <strong>Total Tickets</strong>
                        <span>{ticketCount}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="primary" onClick={handleSubmit}>
                    <i className="bi bi-bag-plus me-2"></i> Checkout
                  </Button>
                  <Button variant="secondary" onClick={() => setShow(false)}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card.Body>
          </Card>
        </div>
      </Col>
    </Row>
  </Container>
  );
}

export default EventDetail;
