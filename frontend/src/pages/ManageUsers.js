import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { usersAPI } from '../services/api';
import { downloadCSV } from '../utils/csvExport';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user', phone: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const params = {
        search: searchTerm,
        role: roleFilter
      };
      const response = await usersAPI.getAll({ params });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, phone: user.phone || '' });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.delete(userId);
      setMessage({ type: 'success', text: 'User deleted successfully' });
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to delete user' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.update(editingUser.id, formData);
      setMessage({ type: 'success', text: 'User updated successfully' });
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      setMessage({ type: 'danger', text: 'Failed to update user' });
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <h2 className="mb-4">Manage Users</h2>

      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <div className="mb-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div className="mb-2">
          <Form.Control
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Form.Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </div>
        <div className="mt-2 mt-md-0">
          <Button variant="outline-secondary" size="sm" onClick={() => {
            const params = new URLSearchParams({ search: searchTerm, role: roleFilter });
            downloadCSV(`http://localhost:5000/api/users/export?${params.toString()}`, 'users.csv');
          }}>
            Export CSV
          </Button>
        </div>
      </div>
      {selectedUsers.size > 0 && (
        <div className="mb-2">
          <Button variant="danger" size="sm" onClick={async () => {
            if (!window.confirm('Delete selected users?')) return;
            try {
              await Promise.all(Array.from(selectedUsers).map(id => usersAPI.delete(id)));
              setMessage({ type: 'success', text: 'Selected users deleted' });
              setSelectedUsers(new Set());
              fetchUsers();
            } catch (e) {
              setMessage({ type: 'danger', text: 'Bulk delete failed' });
            }
          }}>
            Delete Selected ({selectedUsers.size})
          </Button>
        </div>
      )}
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                checked={selectedUsers.size === users.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedUsers(new Set(users.map(u => u.id)));
                  } else {
                    setSelectedUsers(new Set());
                  }
                }}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter(u => {
              const matchesSearch =
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesRole =
                roleFilter === 'all' || u.role === roleFilter;
              return matchesSearch && matchesRole;
            })
            .map((user) => (
            <tr key={user.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={(e) => {
                    const newSet = new Set(selectedUsers);
                    if (e.target.checked) newSet.add(user.id);
                    else newSet.delete(user.id);
                    setSelectedUsers(newSet);
                  }}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.phone || 'N/A'}</td>
              <td>
                <Button variant="primary" size="sm" className="me-2" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageUsers;
