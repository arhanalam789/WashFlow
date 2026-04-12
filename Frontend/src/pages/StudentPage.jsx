/**
 * Student Page Component
 *
 * Student dashboard for submitting laundry and tracking status.
 */

import { useState, useEffect } from 'react';
import { laundryAPI } from '../services/api';

function StudentPage({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitData, setSubmitData] = useState({ declaredItems: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await laundryAPI.getMy();
      if (response.success) {
        setRequests(response.data);
      }
    } catch (error) {
      showMessage('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSubmitSubmit = async (e) => {
    e.preventDefault();
    if (!submitData.declaredItems || submitData.declaredItems < 1) {
      showMessage('error', 'Please enter a valid number of items');
      return;
    }

    try {
      const response = await laundryAPI.submit({
        studentId: user.id,
        declaredItems: parseInt(submitData.declaredItems)
      });

      if (response.success) {
        showMessage('success', 'Laundry request submitted successfully!');
        setShowSubmitForm(false);
        setSubmitData({ declaredItems: '' });
        fetchRequests();
      }
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleConfirmPickup = async (requestId) => {
    if (!window.confirm('Are you sure you want to confirm pickup?')) {
      return;
    }

    try {
      const response = await laundryAPI.updateStatus(requestId, 'delivered');
      if (response.success) {
        showMessage('success', 'Pickup confirmed successfully!');
        fetchRequests();
      }
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: 'badge-pending',
      collected: 'badge-collected',
      washing: 'badge-washing',
      ready: 'badge-ready',
      delivered: 'badge-delivered'
    };
    return statusMap[status] || 'badge-pending';
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <h1 style={{ fontSize: '20px', margin: 0 }}>WashFlow - Student Portal</h1>
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

        {/* Actions */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="button button-primary"
          >
            {showSubmitForm ? 'Cancel' : '+ Submit New Laundry'}
          </button>
        </div>

        {/* Submit Form */}
        {showSubmitForm && (
          <div className="card">
            <h2 className="card-title">Submit Laundry Request</h2>
            <form onSubmit={handleSubmitSubmit} style={{ marginTop: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="items">Number of Items</label>
                <input
                  id="items"
                  type="number"
                  min="1"
                  className="form-input"
                  placeholder="Enter total number of clothes"
                  value={submitData.declaredItems}
                  onChange={(e) => setSubmitData({ declaredItems: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="button button-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Requests */}
        <div className="card">
          <h2 className="card-title">My Laundry Requests</h2>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <p>No laundry requests found. Submit your first request!</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td>{request.requestId}</td>
                      <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td>
                        {request.declaredItems}
                        {request.hasDiscrepancy && (
                          <span className="badge badge-error" style={{ marginLeft: '5px' }}>
                            Discrepancy
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        {request.status === 'ready' && (
                          <button
                            onClick={() => handleConfirmPickup(request._id)}
                            className="button button-success"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            Confirm Pickup
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentPage;
