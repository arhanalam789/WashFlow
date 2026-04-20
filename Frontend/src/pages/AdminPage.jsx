export function AdminPage({
  requests,
  centers,
  isBusy,
  onAssignRequest,
  onSelectDraftCenter,
  notificationForm,
  setNotificationForm,
  onSendNotification,
  formatDateTime,
  formatRequestStatus,
}) {
  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Assign to washing center</p>
            <h2>Manage request routing</h2>
          </div>
        </div>

        <div className="card-list">
          {requests.length === 0 ? (
            <div className="empty-state">No requests available for assignment.</div>
          ) : (
            requests.map((request) => (
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
    </>
  )
}
