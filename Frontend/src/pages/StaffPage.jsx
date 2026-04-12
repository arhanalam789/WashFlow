/**
 * Staff Page Component
 *
 * Staff dashboard for managing laundry requests.
 */

import { useState, useEffect } from 'react';
import { laundryAPI } from '../services/api';

function StaffPage({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [verifyData, setVerifyData] = useState({ receivedItems: '', notes: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let response;

      if (filter === 'pending') {
        response = await laundryAPI.getPending();
      } else if (filter === 'discrepancy') {
        response = await laundryAPI.getWithDiscrepancy();
      } else {
        response = await laundryAPI.getByStatus(filter);
      }

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

  const handleMarkCollected = async (requestId) => {
    if (!window.confirm('Mark this laundry as collected?')) {
      return;
    }

    try {
      const response = await laundryAPI.markCollected(requestId);
      if (response.success) {
        showMessage('success', 'Laundry marked as collected!');
        fetchRequests();
      }
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const response = await laundryAPI.updateStatus(requestId, newStatus);
      if (response.success) {
        showMessage('success', `Status updated to ${newStatus}!`);
        fetchRequests();
      }
    } catch (error) {
      showMessage('error', error.message);
    }
  };

  const handleVerify = async (request) => {
    setSelectedRequest(request);
    setVerifyData({
      receivedItems: request.receivedItems || request.declaredItems,
      notes: request.discrepancyNotes || ''
    });
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await laundryAPI.verify(
        selectedRequest._id,
        parseInt(verifyData.receivedItems),
        verifyData.notes
      );

      if (response.success) {
        showMessage('success', 'Laundry verified successfully!');
        setSelectedRequest(null);
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

  const getNextAction = (request) => {
    if (request.status === 'pending') {
      return { label: 'Collect', action: () => handleMarkCollected(request._id), class: 'button-primary' };
    } else if (request.status === 'collected') {
      return { label: 'Verify', action: () => handleVerify(request), class: 'button-success' };
    } else if (request.status === 'washing') {
      return { label: 'Mark Ready', action: () => handleUpdateStatus(request._id, 'ready'), class: 'button-success' };
    }
    return null;
  };

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div>
          <h1 style={{ fontSize: '20px', margin: 0 }}>WashFlow - Staff Portal</h1>
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

        {/* Filter Tabs */}
        <div className="card">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['pending', 'collected', 'washing', 'ready', 'discrepancy'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`button ${filter === status ? 'button-primary' : 'button-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {status === 'discrepancy' ? 'Discrepancies' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="card">
          <h2 className="card-title">
            {filter.charAt(0).toUpperCase() + filter.slice(1)} Requests
            {requests.length > 0 && (
              <span style={{ fontSize: '14px', color: '#666', marginLeft: '10px' }}>
                ({requests.length})
              </span>
            )}
          </h2>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <p>No {filter} requests found.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Student</th>
                    <th>Bag #</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => {
                    const action = getNextAction(request);
                    return (
                      <tr key={request._id}>
                        <td>{request.requestId}</td>
                        <td>{request.studentName}</td>
                        <td>{request.bagNumber}</td>
                        <td>
                          Declared: {request.declaredItems}
                          {request.receivedItems && (
                            <>
                              <br />
                              Received: {request.receivedItems}
                            </>
                          )}
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
                        <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                        <td>
                          {action && (
                            <button
                              onClick={action.action}
                              className={`button ${action.class}`}
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              {action.label}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Verify Modal */}
        {selectedRequest && (
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
              <h3 className="card-title">Verify Laundry Items</h3>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Request: {selectedRequest.requestId}<br />
                Declared: {selectedRequest.declaredItems} items
              </p>

              <form onSubmit={handleVerifySubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="receivedItems">Received Items Count</label>
                  <input
                    id="receivedItems"
                    type="number"
                    min="0"
                    className="form-input"
                    value={verifyData.receivedItems}
                    onChange={(e) => setVerifyData({ ...verifyData, receivedItems: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="notes">Notes (if discrepancy)</label>
                  <textarea
                    id="notes"
                    className="form-textarea"
                    rows="3"
                    placeholder="Add any notes about discrepancy..."
                    value={verifyData.notes}
                    onChange={(e) => setVerifyData({ ...verifyData, notes: e.target.value })}
                  />
                </div>

                {parseInt(verifyData.receivedItems) !== selectedRequest.declaredItems && (
                  <div className="alert alert-error">
                    Discrepancy detected! Difference: {Math.abs(selectedRequest.declaredItems - parseInt(verifyData.receivedItems))} items
                  </div>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="button button-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="button button-primary">
                    Verify
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffPage;
