export function ManagerPage({
  requests,
  isBusy,
  onUpdateStatus,
  concernForm,
  setConcernForm,
  onCreateConcern,
  formatDateTime,
  formatRequestStatus,
}) {
  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">View incoming requests</p>
            <h2>Process washing center work</h2>
          </div>
        </div>

        <div className="card-list">
          {requests.length === 0 ? (
            <div className="empty-state">No assigned requests yet.</div>
          ) : (
            requests.map((request) => (
              <article className="card" key={request._id}>
                <div className="card-top">
                  <div>
                    <h3>Request {request._id.slice(-6)}</h3>
                    <p>
                      Customer: {request.userId?.name || 'Unknown'} · Clothes:{' '}
                      {request.clothesCount}
                    </p>
                  </div>
                  <span className={`status-pill status-${request.status}`}>
                    {formatRequestStatus(request.status)}
                  </span>
                </div>

                <p>
                  Washing center:{' '}
                  {request.washingCenterId?.centerName || 'Waiting for assignment'}
                </p>
                <p>Pickup: {formatDateTime(request.preferredPickupDate)}</p>

                <div className="action-row">
                  <button
                    className="secondary-button"
                    disabled={
                      isBusy ||
                      !['assigned', 'concern_raised'].includes(request.status)
                    }
                    onClick={() => onUpdateStatus(request._id, 'in_progress')}
                    type="button"
                  >
                    Verify clothes count
                  </button>
                  <button
                    className="secondary-button"
                    disabled={
                      isBusy ||
                      !['in_progress', 'concern_raised'].includes(request.status)
                    }
                    onClick={() => onUpdateStatus(request._id, 'completed')}
                    type="button"
                  >
                    Mark request completed
                  </button>
                  <button
                    className="secondary-button"
                    disabled={isBusy}
                    onClick={() =>
                      setConcernForm({
                        ...concernForm,
                        requestId: request._id,
                        expectedCount: String(request.clothesCount),
                        receivedCount: String(request.clothesCount),
                      })
                    }
                    type="button"
                  >
                    Raise concern ticket
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
            <p className="eyebrow">Raise concern ticket</p>
            <h2>Report count mismatches and delivery issues</h2>
          </div>
        </div>

        <form className="stack-form" onSubmit={onCreateConcern}>
          <label>
            <span>Request</span>
            <select
              value={concernForm.requestId}
              onChange={(event) =>
                setConcernForm({ ...concernForm, requestId: event.target.value })
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

          <div className="triple-grid">
            <label>
              <span>Type</span>
              <select
                value={concernForm.type}
                onChange={(event) =>
                  setConcernForm({ ...concernForm, type: event.target.value })
                }
              >
                <option value="count_mismatch">Count mismatch</option>
                <option value="missing_item">Missing item</option>
                <option value="delivery_issue">Delivery issue</option>
                <option value="general_issue">General issue</option>
              </select>
            </label>

            <label>
              <span>Expected count</span>
              <input
                min="0"
                type="number"
                value={concernForm.expectedCount}
                onChange={(event) =>
                  setConcernForm({
                    ...concernForm,
                    expectedCount: event.target.value,
                  })
                }
              />
            </label>

            <label>
              <span>Received count</span>
              <input
                min="0"
                type="number"
                value={concernForm.receivedCount}
                onChange={(event) =>
                  setConcernForm({
                    ...concernForm,
                    receivedCount: event.target.value,
                  })
                }
              />
            </label>
          </div>

          <label>
            <span>Notes</span>
            <textarea
              rows="3"
              value={concernForm.note}
              onChange={(event) =>
                setConcernForm({ ...concernForm, note: event.target.value })
              }
              placeholder="Describe the issue found during verification"
            />
          </label>

          <button className="primary-button" disabled={isBusy} type="submit">
            Submit concern ticket
          </button>
        </form>
      </section>
    </>
  )
}
