import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Card from './Card';
import axios from 'axios';

const Dashboard: React.FC = () => {
    const [totalEvents, setTotalEvents] = useState('');
    const [completedEvents, setCompletedEvents] = useState('');
    const [totalBookings, setTotalBookings] = useState('');
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchStats = async () => {
          try {
            const res = await axios.get('http://localhost:5000/api/events/stats');
            setTotalEvents(res.data.totalEvents);
            setCompletedEvents(res.data.completedEvents);
            setTotalBookings(res.data.totalBookings);
          } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
          }
        };
        fetchStats();
      }, []);
    
      if (error) {
        return <div>{error}</div>;
      }
    return (
        <Container fluid>
            <h1 className="mt-4 mb-4">Admin Dashboard</h1>
            <Row>
                <Col md={4} className="mb-4">
                    <Card title="Total Events" count={totalEvents} />
                </Col>
                <Col md={4} className="mb-4">
                    <Card title="Completed Events" count={completedEvents} />
                </Col>
                <Col md={4} className="mb-4">
                    <Card title="Total Bookings" count={totalBookings} />
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;
