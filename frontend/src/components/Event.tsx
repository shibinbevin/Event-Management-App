import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect, useRef } from 'react';
import { ColDef } from 'ag-grid-community';
import { Button, Modal, Col, Alert } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '~/modules/hooks';
import { selectUser } from '~/selectors';

interface EventData {
    event_id?: string;
    event_name: string;
    organizer_name: string;
    event_date: string;
    venue: VenueData;
    category: Category;
    image?: FileList; 
    status?: string;
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

function Event() {
    const [events, setEvents] = useState<EventData[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [venues, setVenues] = useState<VenueData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [eventToApprove, setEventToApprove] = useState<EventData | null>(null);
    const gridRef = useRef<AgGridReact<EventData>>(null);

    const user = useAppSelector(selectUser);
    const { role } = user;
    const navigate = useNavigate();

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm<EventData>();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get<EventData[]>('http://localhost:5000/api/events');
                setEvents(res.data);
            } catch (error) {
                setError('Failed to fetch data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const res = await axios.get<Category[]>('http://localhost:5000/api/categories');
                setCategories(res.data);
            } catch (error) {
                setError('Unable to fetch category data');
                console.error(error);
            }
        };

        const fetchVenues = async () => {
            try {
                const res = await axios.get<VenueData[]>('http://localhost:5000/api/venues');
                setVenues(res.data);
            } catch (error) {
                setError('Unable to fetch venue data');
                console.error(error);
            }
        };
        fetchEvents();
        fetchCategories();
        fetchVenues();
    }, []);

    useEffect(() => {
        if (currentEvent) {
            reset(currentEvent);
        }
    }, [currentEvent, reset]);

    const onSubmit = async (data: EventData) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('event_name', data.event_name);
            formData.append('organizer_name', data.organizer_name);
            formData.append('event_date', data.event_date);
            formData.append('venue', JSON.stringify(data.venue));
            formData.append('category', JSON.stringify(data.category));
            formData.append('role', role);
    
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]);
            }
    
            let url = 'http://localhost:5000/api/events/add';
            let method = 'post';
    
            if (isEditMode && data.event_id) {
                url = `http://localhost:5000/api/events/edit/${data.event_id}`;
                method = 'put';
                formData.append('event_id', data.event_id); // Append event_id for edit
            }
    
            const res = await axios({
                method: method,
                url: url,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (isEditMode) {
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.event_id === data.event_id ? res.data : event
                    )
                );
            } else {
                setEvents((prevEvents) => [...prevEvents, res.data.newEvent]);
            }
    
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
    
    const handleDeleteEvent = async (event_id: number) => {
        setLoading(true);
        try {
            await axios.delete(`http://localhost:5000/api/events/delete/${event_id}`);
            setEvents((prevEvents) => prevEvents.filter((event) => event.event_id !== event_id.toString()));
        } catch (error: any) {
            setError(error.response.data.msg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveEvent = async () => {
        if (!eventToApprove) return;
    
        setLoading(true);
        try {
            await axios.patch(`http://localhost:5000/api/events/approve/${eventToApprove.event_id}`);
            setEvents((prevEvents) =>
                prevEvents.map((e) =>
                    e.event_id === eventToApprove.event_id ? { ...e, status: 'active' } : e
                )
            );
            setIsConfirmModalOpen(false);
            setEventToApprove(null);
        } catch (error: any) {
            setError(error.response.data.msg);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setIsEditMode(false);
        reset({
            event_name: '',
            organizer_name: '',
            event_date: '',
            venue: { venue_id: '', venue_name: '', city: '', country: '', capacity: 0 },
            category: { category_id: '', category_name: '' },
        });
        setIsModalOpen(true);
    };

    const openEditModal = (event: EventData) => {
        setCurrentEvent(event);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
    };

    const openConfirmModal = (event: EventData) => {
        setEventToApprove(event);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setEventToApprove(null);
    };

    const renderActionsCell = (params: any) => (
        <div>
            <Button variant="warning" onClick={() => openEditModal(params.data)}>
                Edit
            </Button>{' '}
            <Button variant="danger" onClick={() => handleDeleteEvent(params.data.event_id)}>
                Delete
            </Button>{' '}
            <Button variant="info" onClick={() => navigate(`./${params.data.event_id}`)}>
                View
            </Button>{' '}
            {params.data.status === 'pending' && (
                <Button variant="success" onClick={() => openConfirmModal(params.data)}>
                    Approve
                </Button>
            )}
        </div>
    );

    const columnDefs: ColDef<EventData>[] = [       
        { headerName: 'Event', field: 'event_name' },
        { headerName: 'Event Organizer', field: 'organizer_name' },
        { headerName: 'Event Date', field: 'event_date' },
        { headerName: 'Category', field: 'category.category_name' },
        { headerName: 'Venue', field: 'venue.venue_name' },
        { headerName: 'Image', field: 'image', cellRenderer: (params: any) => (
            params.data.image ? <img src={`http://localhost:5000/${params.value}`} alt="Event" style={{ width: '50px', height: '50px' }} /> : 'No Image'
        )},
        { headerName: 'Status', field: 'status' },
        {
            headerName: 'Actions',
            cellRenderer: (params: any) => renderActionsCell(params),
        },
    ];

    return (
        <div className="event-container">
            <h2 className="mb-3 text-center">
                <b>List of Events</b>
            </h2>
            <Button variant="primary mb-3" onClick={openModal}>
                Create Event
            </Button>
            <Modal show={isModalOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Event' : 'Create Event'}</Modal.Title>
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
                        {errors.event_name && <div className="invalid-feedback">{errors.event_name.message}</div>}

                        <label htmlFor="organizer_name">Event Organizer</label>
                        <input
                            type="text"
                            {...register('organizer_name', { required: 'Event Organizer is required' })}
                            placeholder="Event Organizer"
                            className={`form-control mb-3 ${errors.organizer_name ? 'is-invalid' : ''}`}
                        />
                        {errors.organizer_name && <div className="invalid-feedback">{errors.organizer_name.message}</div>}

                        <label htmlFor="event_date">Event Date</label>
                        <input
                            type="date"
                            {...register('event_date', { required: 'Event Date is required' })}
                            className={`form-control mb-3 ${errors.event_date ? 'is-invalid' : ''}`}
                        />
                        {errors.event_date && <div className="invalid-feedback">{errors.event_date.message}</div>}

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
                                    {categories.map((category) => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.category?.category_id && <div className="invalid-feedback">{errors.category.category_id.message}</div>}

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
                                    {venues.map((venue) => (
                                        <option key={venue.venue_id} value={venue.venue_id}>
                                            {venue.venue_name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.venue?.venue_id && <div className="invalid-feedback">{errors.venue.venue_id.message}</div>}

                        <label htmlFor="image">Upload Image</label>
                        <input
                            type="file"
                            {...register('image')}
                            className="form-control mb-3"
                        />

                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeModal}>
                                Close
                            </Button>
                            <Button type="submit" variant="primary">
                                {isEditMode ? 'Save Changes' : 'Add Event'}
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={isConfirmModalOpen} onHide={closeConfirmModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to approve this event?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeConfirmModal}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleApproveEvent}>
                        Approve
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="table-responsive">
                {error && (
                    <Col lg={10} className="mx-auto mb-4">
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error}
                        </Alert>
                    </Col>
                )}
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="ag-theme-alpine" style={{ height: '70vh' }}>
                        <AgGridReact<EventData>
                            ref={gridRef}
                            rowData={events}
                            columnDefs={columnDefs}
                        ></AgGridReact>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Event;
