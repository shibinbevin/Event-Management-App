import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect } from 'react';
import { ColDef } from 'ag-grid-community';
import { useAppSelector } from '~/modules/hooks';
import { selectUser } from '~/selectors';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

function UserBookings() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAppSelector(selectUser);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tickets/user/${user.user_id}`);
        setTickets(res.data);
      } catch (err: any) {
        setError(err.response.data.msg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user.user_id]);

  const columnDefs: ColDef[] = [
    { headerName: 'Event', field: 'event.event_name' },
    { headerName: 'Venue', field: 'event.venue.venue_name' },
    { headerName: 'Category', field: 'event.category.category_name' },
    { headerName: 'On', field: 'event.event_date' },
    { headerName: 'No of Tickets', field: 'ticket_count' },
  ];

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className='py-5'>
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (

    <Container className='py-5'>
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">My Bookings</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
            <AgGridReact rowData={tickets} columnDefs={columnDefs}></AgGridReact>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default UserBookings;
