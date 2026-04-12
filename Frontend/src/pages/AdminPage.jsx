/**
 * Admin Page Component
 *
 * Admin dashboard for managing users and viewing analytics.
 */

import { useState, useEffect } from 'react';
import { adminAPI, laundryAPI } from '../services/api';

function AdminPage({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student',
    studentId: '',
    roomNumber: '',
    employeeId: ''
  });
  const [assignBagData, setAssignBagData] = useState({ bagNumber: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics();
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const response = await adminAPI.createUser(formData);
      if (response.success) {
        showMessage('success', 'User created successfully!');
        setShowCreateForm(false);
        setFormData({
          email: '',
          password: '',
          name: '',
          role: 'student',
          studentId: '',
          roomNumber: '',
          employeeId: ''
        });
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleAssignBag = async () => {
    if (!assignBagData.bagNumber) {
      showMessage('error', 'Please enter a bag number');
      return;
    }

    try {
      const response = await adminAPI.assignBagNumber(selectedUser._id, assignBagData.bagNumber);
      if (response.success) {
        showMessage('success', 'Bag number assigned successfully!');
        setSelectedUser(null);
        setAssignBagData({ bagNumber: '' });
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      const response = isActive
        ? await adminAPI.deactivateUser(userId)
        : await adminAPI.activateUser(userId);

      if (response.success) {
        showMessage('success', `User ${isActive ? 'deactivated' : 'activated'} successfully!`);
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await adminAPI.deleteUser(userId);
      if (response.success) {
        showMessage('success', 'User deleted successfully!');
        fetchUsers();
      }
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <h1 style={{ fontSize: '20px', margin: 0 }}>WashFlow - Admin Portal</h1>
          <p style={{ fontSize: '14px', margin: '5px 0 0 0', opacity: 0.9 }}>
            Welcome, {user?.name} | {user?.email}
          </p>
        </div>
        <button onClick={onLogout} className="button button-secondary">
          Logout
        </button>
      </div>

      <div className="container">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="card">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['analytics', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`button ${activeTab === tab ? 'button-primary' : 'button-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {tab === 'analytics' ? 'Analytics' : 'Manage Users'}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            {loading ? (
              <div className="loading">Loading analytics...</div>
            ) : analytics && (
              <>
                {/* User Statistics */}
                <div className="card">
                  <h2 className="card-title">User Statistics</h2>
                  <div className="grid grid-3">
                    <div className="stats-card">
                      <div className="stats-value">{analytics.users.students}</div>
                      <div className="stats-label">Students</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value">{analytics.users.staff}</div>
                      <div className="stats-label">Staff</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value">{analytics.users.admins}</div>
                      <div className="stats-label">Admins</div>
                    </div>
                  </div>
                </div>

                {/* Laundry Statistics */}
                <div className="card">
                  <h2 className="card-title">Laundry Statistics</h2>
                  <div className="grid grid-3">
                    <div className="stats-card">
                      <div className="stats-value">{analytics.laundry.pending}</div>
                      <div className="stats-label">Pending</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value">{analytics.laundry.washing}</div>
                      <div className="stats-label">In Washing</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value">{analytics.laundry.ready}</div>
                      <div className="stats-label">Ready for Pickup</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value">{analytics.laundry.delivered}</div>
                      <div className="stats-label">Delivered</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value">{analytics.laundry.total}</div>
                      <div className="stats-label">Total Requests</div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-value" style={{ color: analytics.laundry.discrepancyCount > 0 ? '#d32f2f' : '#388e3c' }}>
                        {analytics.laundry.discrepancyCount}
                      </div>
                      <div className="stats-label">Discrepancies</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="button button-primary"
              >
                {showCreateForm ? 'Cancel' : '+ Create New User'}
              </button>
            </div>

            {/* Create User Form */}
            {showCreateForm && (
              <div className="card">
                <h3 className="card-title">Create New User</h3>
                <form onSubmit={handleCreateUser} style={{ marginTop: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {formData.role === 'student' && (
                    <>
                      <div className="form-group">
                        <label className="form-label">Student ID</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.studentId}
                          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Room Number</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.roomNumber}
                          onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {formData.role === 'staff' && (
                    <div className="form-group">
                      <label className="form-label">Employee ID</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="button button-secondary"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="button button-primary">
                      Create User
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List */}
            <div className="card">
              <h2 className="card-title">All Users</h2>

              {loading ? (
                <div className="loading">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="empty-state">
                  <p>No users found. Create your first user!</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Details</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td style={{ textTransform: 'capitalize' }}>{u.role}</td>
                          <td>
                            {u.role === 'student' && (
                              <>
                                ID: {u.studentId || '-'}<br />
                                Bag: {u.bagNumber || 'Not assigned'}<br />
                                Room: {u.roomNumber || '-'}
                              </>
                            )}
                            {u.role === 'staff' && <>ID: {u.employeeId || '-'}</>}
                            {u.role === 'admin' && <>ID: {u.adminId || '-'}</>}
                          </td>
                          <td>
                            <span className={`badge ${u.isActive ? 'badge-ready' : 'badge-error'}`}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            {u.role === 'student' && (
                              <button
                                onClick={() => setSelectedUser(u)}
                                className="button button-primary"
                                style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }}
                              >
                                {u.bagNumber ? 'Edit Bag' : 'Assign Bag'}
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleStatus(u._id, u.isActive)}
                              className={`button ${u.isActive ? 'button-danger' : 'button-success'}`}
                              style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }}
                            >
                              {u.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="button button-danger"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Assign Bag Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 className="card-title">Assign Bag Number</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Student: {selectedUser.name}<br />
              Current: {selectedUser.bagNumber || 'Not assigned'}
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="bagNumber">Bag Number</label>
              <input
                id="bagNumber"
                type="text"
                className="form-input"
                placeholder="e.g., BAG1001"
                value={assignBagData.bagNumber}
                onChange={(e) => setAssignBagData({ bagNumber: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setAssignBagData({ bagNumber: '' });
                }}
                className="button button-secondary"
              >
                Cancel
              </button>
              <button onClick={handleAssignBag} className="button button-primary">
                Assign Bag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
