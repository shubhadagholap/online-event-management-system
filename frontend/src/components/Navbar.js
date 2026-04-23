import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">Event Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/events">Events</Nav.Link>
            <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
            {user && (
              <>
                {user.role === 'admin' && (
                  <NavDropdown title="Admin" id="admin-dropdown">
                    <NavDropdown.Item as={Link} to="/admin/dashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/events">All Events</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/users">Users</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/categories">Categories</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/bookings">All Bookings</NavDropdown.Item>
                  </NavDropdown>
                )}
                {(user.role === 'organizer' || user.role === 'admin') && (
                  <NavDropdown title="Organizer" id="organizer-dropdown">
                    <NavDropdown.Item as={Link} to="/organizer/dashboard">Dashboard</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/organizer/events">My Events</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/organizer/bookings">Event Bookings</NavDropdown.Item>
                  </NavDropdown>
                )}
                {user.role === 'user' && (
                  <NavDropdown title="My Account" id="user-dropdown">
                    <NavDropdown.Item as={Link} to="/my-bookings">My Bookings</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/tickets">My Tickets</NavDropdown.Item>
                  </NavDropdown>
                )}
                <NavDropdown title="Services" id="services-dropdown">
                  <NavDropdown.Item as={Link} to="/notifications">Notifications</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/payments">Payments</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/feedback">Feedback</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/certificates">Certificates</NavDropdown.Item>
                  {(user.role === 'organizer' || user.role === 'admin') && (
                    <NavDropdown.Item as={Link} to="/analytics">Analytics</NavDropdown.Item>
                  )}
                </NavDropdown>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown 
                title={
                  <span className="d-flex align-items-center">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=${user.role === 'admin' ? '667eea' : user.role === 'organizer' ? '28a745' : '007bff'}&color=fff&size=32`}
                      alt={user.name}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', marginRight: '8px' }}
                    />
                    {user.name}
                  </span>
                } 
                id="user-dropdown" 
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2"></i>Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
