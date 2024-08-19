import React from 'react';
import { Nav } from 'react-bootstrap';

interface SidebarProps {
  active: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ active }) => {
  return (
    <div className={`sidebar ${active ? 'active' : ''}`}>
      <Nav className="flex-column sidebar-sticky">
        <Nav.Link className="nav-link" href="/dashboard">
          Dashboard
        </Nav.Link>
        <Nav.Link className="nav-link" href="/dashboard/events">
          Events
        </Nav.Link>
        <Nav.Link className="nav-link" href="/dashboard/venue">
          Venues
        </Nav.Link>
        <Nav.Link className="nav-link" href="/dashboard/category">
          Categories
        </Nav.Link>
        <Nav.Link className="nav-link" href="/dashboard/user">
          Users
        </Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;
