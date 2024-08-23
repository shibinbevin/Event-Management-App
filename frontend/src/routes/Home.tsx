import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, Alert } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import { useAppSelector } from '~/modules/hooks';
import { selectUser } from '~/selectors';

interface EventData {
  event_id?: string;
  event_name: string;
  organizer_name: string;
  event_date: string;
  status: string;
  image?: string; // Changed to string for image URL
  venue: VenueData;
  category: Category;
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

function Home() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventData>();
  const [events, setEvents] = useState<EventData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [venues, setVenues] = useState<VenueData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [eventName, setEventName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [eventsToShow, setEventsToShow] = useState<number>(8); // Number of events to show initially

  const { role } = useAppSelector(selectUser);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events/');
      setEvents(res.data);
    } catch (error) {
      throw new Error('Unable to fetch event data');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/categories');
      setCategories(res.data);
    } catch (error) {
      throw new Error('Unable to fetch category data');
    }
  };

  const fetchVenues = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/venues');
      setVenues(res.data);
    } catch (error) {
      throw new Error('Unable to fetch venue data');
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchVenues();
  }, []);

  const filteredEvents = events.filter(event => {
    return (
      event.status === 'active' && // Filter only active events
      (selectedCategory ? event.category.category_name === selectedCategory : true) &&
      (selectedVenue ? `${event.venue.city}-${event.venue.country}` === selectedVenue : true) &&
      (eventName ? event.event_name.toLowerCase().includes(eventName.toLowerCase()) : true)
    );
  });

  const openModal = () => {
    reset({
      event_name: '',
      organizer_name: '',
      event_date: '',
      venue: { venue_id: '', venue_name: '', city: '', country: '', capacity: 0 },
      category: { category_id: '', category_name: '' },
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onSubmit = async (data: EventData) => {
    try {
      const formData = new FormData();
      formData.append('event_name', data.event_name);
      formData.append('organizer_name', data.organizer_name);
      formData.append('event_date', data.event_date);
      formData.append('venue', JSON.stringify(data.venue));
      formData.append('category', JSON.stringify(data.category));
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      const res = await axios.post('http://localhost:5000/api/events/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setEvents(prevEvents => [...prevEvents, res.data.newEvent]);
      setSuccess('Event Submitted for Approval');
      setIsModalOpen(false);
    } catch (error: any) {
      setError(error.response.data.msg);
      console.error(error);
    }
  };

  const handleViewMore = () => {
    setEventsToShow(prevCount => prevCount + 8); // Increase the number of events shown
  };

  return (
    <section id="service" className="py-5">
      <Container>
        {/* Success Alert */}
        {success && (
          <Col lg={10} className="mx-auto mb-4">
            <Alert variant="success" onClose={() => setSuccess('')} dismissible>
              {success}
            </Alert>
          </Col>
        )}
        {role === 'user' && (
          <Button variant="primary" className="mb-4" onClick={openModal}>
            Create Event
          </Button>
        )}
        <Modal show={isModalOpen} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{'Create Event'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="event_name">Event Name</label>
              <input
                type="text"
                {...register('event_name', { required: 'Event Name is required' })}
                placeholder="Event Name"
                className={`form-control mb-3 ${errors.event_name ? 'is-invalid' : ''}`}
              />
              {errors.event_name && (
                <div className="invalid-feedback">{errors.event_name.message}</div>
              )}

              <label htmlFor="organizer_name">Event Organizer</label>
              <input
                type="text"
                {...register('organizer_name', { required: 'Event Organizer is required' })}
                placeholder="Event Organizer"
                className={`form-control mb-3 ${errors.organizer_name ? 'is-invalid' : ''}`}
              />
              {errors.organizer_name && (
                <div className="invalid-feedback">{errors.organizer_name.message}</div>
              )}

              <label htmlFor="event_date">Event Date</label>
              <input
                type="date"
                {...register('event_date', { required: 'Event Date is required' })}
                className={`form-control mb-3 ${errors.event_date ? 'is-invalid' : ''}`}
              />
              {errors.event_date && (
                <div className="invalid-feedback">{errors.event_date.message}</div>
              )}

              <label htmlFor="category">Category</label>
              <Controller
                name="category.category_id"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`form-control mb-3 ${errors.category?.category_id ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.category?.category_id && (
                <div className="invalid-feedback">{errors.category.category_id.message}</div>
              )}

              <label htmlFor="venue">Venue</label>
              <Controller
                name="venue.venue_id"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className={`form-control mb-3 ${errors.venue?.venue_id ? 'is-invalid' : ''}`}
                  >
                    <option value="">Select Venue</option>
                    {venues.map(venue => (
                      <option key={venue.venue_id} value={venue.venue_id}>
                        {venue.venue_name}
                      </option>
                    ))}
                  </select>
                )}
              />

              <label htmlFor="image">Event Image</label>
              <input
                type="file"
                {...register('image')}
                className={`form-control mb-3 ${errors.image ? 'is-invalid' : ''}`}
              />
              {errors.venue?.venue_id && (
                <div className="invalid-feedback">{errors.venue.venue_id.message}</div>
              )}

              <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                  Close
                </Button>
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
        {error && (
          <Col lg={10} className="mx-auto mb-4">
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          </Col>
        )}
        <Form>
          <Row className="mb-4">
            <Col md={4}>
              <Form.Select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories.map(category => (
                  <option key={category.category_id} value={category.category_name}>
                    {category.category_name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select value={selectedVenue} onChange={e => setSelectedVenue(e.target.value)}>
                <option value="">Select Venue</option>
                {venues.map(venue => (
                  <option key={venue.venue_id} value={`${venue.city}-${venue.country}`}>
                    {venue.city}, {venue.country}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Control
                type="search"
                placeholder="Search Event"
                value={eventName}
                onChange={e => setEventName(e.target.value)}
              />
            </Col>
          </Row>
        </Form>

        <h1 className="text-center mb-4">Upcoming Events</h1>
        <Row>
          {filteredEvents.slice(0, eventsToShow).map((event, index) => (
            <Col lg={3} className="mb-4" key={index}>
              <Card
                style={{
                  width: '25rem',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  overflow: 'hidden',
                }}
              >
                <Card.Img
                  variant="top"
                  src={`http://localhost:5000/${event.image}`}
                  style={{ height: '200px', objectFit: 'cover' }} // Adjust height as needed
                />
                <Card.Body>
                  <Card.Title>
                    <h4 style={{ marginBottom: '0.5rem' }}>{event.event_name}</h4>
                  </Card.Title>
                  <Button
                    as={NavLink as any}
                    to={`/event/${event.event_id}`}
                    variant="primary"
                    style={{ width: 'auto', padding: '0.5rem 1rem', display: 'inline-block' }}
                  >
                    View Event
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {filteredEvents.length > eventsToShow && (
          <div className="text-center mt-4">
            <Button variant="primary" onClick={handleViewMore}>
              View More
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

export default Home;