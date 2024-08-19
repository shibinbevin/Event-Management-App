import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect, useRef } from 'react';
import { ColDef } from 'ag-grid-community';
import { Button, Modal, Col, Alert, Form } from 'react-bootstrap';
import { useForm, SubmitHandler } from 'react-hook-form';

interface VenueData {
  venue_id?: string;
  venue_name: string;
  city: string;
  country: string;
  capacity: number;
  is_available: boolean;
}

function Venue() {
  const [venues, setVenues] = useState<VenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVenue, setCurrentVenue] = useState<VenueData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const gridRef = useRef<AgGridReact<VenueData>>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<VenueData>({
    defaultValues: {
      venue_name: '',
      city: '',
      country: '',
      capacity: NaN,
      is_available: false
    }
  });

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get<VenueData[]>('http://localhost:5000/api/venues');
        setVenues(res.data);
      } catch (error) {
        setError('Failed to fetch data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleAddVenue: SubmitHandler<VenueData> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post<VenueData>('http://localhost:5000/api/venues/add', data);
      setVenues((prevVenues) => [...prevVenues, res.data]);
      reset();
      setIsModalOpen(false);
      gridRef.current?.api.refreshCells();
    } catch (error: any) {
      setError(error.response.data.msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditVenue: SubmitHandler<VenueData> = async (data) => {
    if (!currentVenue) return;
    setLoading(true);
    try {
      const res = await axios.put<VenueData>(
        `http://localhost:5000/api/venues/edit/${currentVenue.venue_id}`,
        {
          venue_name: data.venue_name,
          city: data.city,
          country: data.country,
          capacity: data.capacity,
          is_available: data.is_available
        }
      );
      setVenues((prevVenues) =>
        prevVenues.map((venue) =>
          venue.venue_id === currentVenue.venue_id ? res.data : venue
        )
      );
      reset();
      setIsModalOpen(false);
      setIsEditMode(false);
      gridRef.current?.api.refreshCells();
    } catch (error: any) {
      setError(error.response.data.msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVenue = async (venue_id: number) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/venues/delete/${venue_id}`);
      setVenues((prevVenues) => prevVenues.filter((venue) => venue.venue_id !== venue_id.toString()));
    } catch (error: any) {
      setError(error.response.data.msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setIsEditMode(false);
    reset();
    setIsModalOpen(true);
  };

  const openEditModal = (venue: VenueData) => {
    setCurrentVenue(venue);
    setIsEditMode(true);
    setIsModalOpen(true);
    Object.keys(venue).forEach((key) => setValue(key as keyof VenueData, venue[key as keyof VenueData]));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const renderActionsCell = (params: any) => (
    <div>
      <Button variant="warning" onClick={() => openEditModal(params.data)}>
        Edit
      </Button>{' '}
      <Button variant="danger" onClick={() => handleDeleteVenue(params.data.venue_id)}>
        Delete
      </Button>
    </div>
  );

  const columnDefs: ColDef<VenueData>[] = [
    { headerName: 'Venue', field: 'venue_name' },
    { headerName: 'City', field: 'city' },
    { headerName: 'Country', field: 'country' },
    { headerName: 'Capacity', field: 'capacity' },
    { headerName: 'Is Available', field: 'is_available' },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => renderActionsCell(params),
    },
  ];

  return (
    <div className="venue-container">
      <h2 className="mb-3 text-center">
        <b>List of Venues</b>
      </h2>
      <Button variant="primary mb-3" onClick={openModal}>
        Create Venue
      </Button>
      <Modal show={isModalOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? 'Edit Venue' : 'Create Venue'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(isEditMode ? handleEditVenue : handleAddVenue)}>
            <Form.Group controlId="venue_name">
              <Form.Label>Venue Name</Form.Label>
              <Form.Control
                type="text"
                {...register('venue_name', { required: 'Venue name is required' })}
                placeholder="Venue Name"
                isInvalid={!!errors.venue_name}
              />
              {errors.venue_name && <Form.Control.Feedback type="invalid">{errors.venue_name.message}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                {...register('country', { required: 'Country is required' })}
                placeholder="Country"
                isInvalid={!!errors.country}
              />
              {errors.country && <Form.Control.Feedback type="invalid">{errors.country.message}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                {...register('city', { required: 'City is required' })}
                placeholder="City"
                isInvalid={!!errors.city}
              />
              {errors.city && <Form.Control.Feedback type="invalid">{errors.city.message}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="capacity">
              <Form.Label>Capacity</Form.Label>
              <Form.Control
                type="number"
                {...register('capacity', {
                  required: 'Capacity is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Capacity must be at least 1' }
                })}
                placeholder="Capacity"
                isInvalid={!!errors.capacity}
              />
              {errors.capacity && <Form.Control.Feedback type="invalid">{errors.capacity.message}</Form.Control.Feedback>}
            </Form.Group>
            <Form.Group controlId="is_available">
              <Form.Check
                type="checkbox"
                {...register('is_available')}
                label="Is Available"
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                {isEditMode ? 'Save Changes' : 'Add Venue'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <div className="table-responsive">
        {error && (
          <Col lg={10} className="mx-auto mb-4">
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          </Col>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="ag-theme-alpine" style={{ height: '70vh' }}>
            <AgGridReact<VenueData>
              ref={gridRef}
              rowData={venues}
              columnDefs={columnDefs}
            ></AgGridReact>
          </div>
        )}
      </div>
    </div>
  );
}

export default Venue;
