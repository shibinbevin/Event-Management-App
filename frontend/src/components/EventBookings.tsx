import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState, useEffect } from 'react';
import { ColDef } from 'ag-grid-community';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function UserBookings() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { event_id } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tickets/event/${event_id}`);
        setTickets(res.data);
      } catch (err: any) {
        setError(err.response.data.msg);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columnDefs: ColDef[] = [
    { headerName: 'Ticket ID', field: 'ticket_id' },
    { headerName: 'Name', field: 'user.name' },
    { headerName: 'Email', field: 'user.email' },
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

    <Container>
      <Row>
        <Col>
          <h1 className="text-center">Booked Tickets</h1>
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
