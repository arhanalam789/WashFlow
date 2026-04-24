import { useState } from 'react'

export function AdminPage({
  requests,
  centers,
  isBusy,
  onAssignRequest,
  onSelectDraftCenter,
  notificationForm,
  setNotificationForm,
  onSendNotification,
  centerForm,
  setCenterForm,
  onCreateCenter,
  formatDateTime,
  formatRequestStatus,
}) {
  const [statusFilter, setStatusFilter] = useState('pending')

  const filteredRequests = statusFilter === 'all'
    ? requests
    : requests.filter((r) => r.status === statusFilter)
  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Assign to washing center</p>
            <h2>Manage request routing</h2>
          </div>
        </div>

        <div className="tab-row" style={{ marginBottom: '16px' }}>
          {['pending', 'assigned', 'all'].map((s) => (
            <button
              key={s}
              className={statusFilter === s ? 'tab active' : 'tab'}
              onClick={() => setStatusFilter(s)}
              type="button"
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="card-list">
          {filteredRequests.length === 0 ? (
            <div className="empty-state">No requests match this filter.</div>
          ) : (
            filteredRequests.map((request) => (
              <article className="card" key={request._id}>
                <div className="card-top">
                  <div>
                    <h3>Request {request._id.slice(-6)}</h3>
                    <p>
                      {request.userId?.name || 'Unknown customer'} ·{' '}
                      {request.clothesCount} items
                    </p>
                  </div>
                  <span className={`status-pill status-${request.status}`}>
                    {formatRequestStatus(request.status)}
                  </span>
                </div>

                <p>Pickup: {formatDateTime(request.preferredPickupDate)}</p>

                <div className="assignment-row">
                  <select
                    value={request._draftCenterId || request.washingCenterId?._id || ''}
                    onChange={(event) =>
                      onSelectDraftCenter(request._id, event.target.value)
                    }
                  >
                    <option value="">Select center</option>
                    {centers.map((center) => (
                      <option key={center._id} value={center._id}>
                        {center.centerName}
                      </option>
                    ))}
                  </select>

                  <button
                    className="primary-button"
                    disabled={isBusy}
                    onClick={() =>
                      onAssignRequest(
                        request._id,
                        request._draftCenterId || request.washingCenterId?._id,
                      )
                    }
                    type="button"
                  >
                    Assign
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Send notification</p>
            <h2>Update customers directly</h2>
          </div>
        </div>

        <form className="stack-form" onSubmit={onSendNotification}>
          <label>
            <span>Request</span>
            <select
              value={notificationForm.requestId}
              onChange={(event) =>
                setNotificationForm({
                  ...notificationForm,
                  requestId: event.target.value,
                })
              }
              required
            >
              <option value="">Select request</option>
              {requests.map((request) => (
                <option key={request._id} value={request._id}>
                  {request._id.slice(-6)} · {request.userId?.name || 'Customer'}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Message</span>
            <textarea
              rows="4"
              value={notificationForm.message}
              onChange={(event) =>
                setNotificationForm({
                  ...notificationForm,
                  message: event.target.value,
                })
              }
              placeholder="Your request is scheduled for pickup tomorrow morning."
              required
            />
          </label>

          <button className="primary-button" disabled={isBusy} type="submit">
            Send notification
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Washing centers</p>
            <h2>Add a new center</h2>
          </div>
        </div>

        <form className="stack-form" onSubmit={onCreateCenter}>
          <label>
            <span>Center name</span>
            <input
              value={centerForm.centerName}
              onChange={(e) => setCenterForm({ ...centerForm, centerName: e.target.value })}
              placeholder="WashFlow Eastside"
              required
            />
          </label>

          <div className="split-grid">
            <label>
              <span>Location</span>
              <input
                value={centerForm.location}
                onChange={(e) => setCenterForm({ ...centerForm, location: e.target.value })}
                placeholder="East Market Road"
                required
              />
            </label>

            <label>
              <span>Contact phone</span>
              <input
                value={centerForm.contactPhone}
                onChange={(e) => setCenterForm({ ...centerForm, contactPhone: e.target.value })}
                placeholder="+1-555-0199"
                required
              />
            </label>
          </div>

          <label>
            <span>Operation status</span>
            <select
              value={centerForm.operationStatus}
              onChange={(e) => setCenterForm({ ...centerForm, operationStatus: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="busy">Busy</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <button className="primary-button" disabled={isBusy} type="submit">
            Create washing center
          </button>
        </form>
      </section>
    </>
  )
}
