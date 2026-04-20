export function CustomerPage({
  requestForm,
  setRequestForm,
  onCreateRequest,
  centers,
  requests,
  concerns,
  onConfirmConcern,
  isBusy,
  formatDateTime,
  formatRequestStatus,
  formatConcernType,
}) {
  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Create laundry request</p>
            <h2>Specify pickup details</h2>
          </div>
        </div>

        <form className="stack-form" onSubmit={onCreateRequest}>
          <label>
            <span>Clothes count</span>
            <input
              min="1"
              onChange={(event) =>
                setRequestForm({ ...requestForm, clothesCount: event.target.value })
              }
              placeholder="12"
              type="number"
              value={requestForm.clothesCount}
              required
            />
          </label>

          <label>
            <span>Preferred pickup</span>
            <input
              type="datetime-local"
              value={requestForm.preferredPickupDate}
              onChange={(event) =>
                setRequestForm({
                  ...requestForm,
                  preferredPickupDate: event.target.value,
                })
              }
              required
            />
          </label>

          <label>
            <span>Preferred washing center</span>
            <select
              value={requestForm.washingCenterId}
              onChange={(event) =>
                setRequestForm({
                  ...requestForm,
                  washingCenterId: event.target.value,
                })
              }
            >
              <option value="">Assign later</option>
              {centers.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.centerName}
                </option>
              ))}
            </select>
          </label>

          <button className="primary-button" disabled={isBusy} type="submit">
            Create request
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Track request status</p>
            <h2>Follow each laundry request</h2>
          </div>
        </div>

        <div className="card-list">
          {requests.length === 0 ? (
            <div className="empty-state">You have not created any laundry requests yet.</div>
          ) : (
            requests.map((request) => (
              <article className="card" key={request._id}>
                <div className="card-top">
                  <div>
                    <h3>Request {request._id.slice(-6)}</h3>
                    <p>{request.clothesCount} items</p>
                  </div>
                  <span className={`status-pill status-${request.status}`}>
                    {formatRequestStatus(request.status)}
                  </span>
                </div>
                <p>Pickup: {formatDateTime(request.preferredPickupDate)}</p>
                <p>
                  Washing center:{' '}
                  {request.washingCenterId?.centerName || 'Not assigned yet'}
                </p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Confirm concern ticket</p>
            <h2>Acknowledge issues raised by the washing center</h2>
          </div>
        </div>

        <div className="card-list">
          {concerns.length === 0 ? (
            <div className="empty-state">No concern tickets require your attention.</div>
          ) : (
            concerns.map((concern) => (
              <article className="card" key={concern._id}>
                <div className="card-top">
                  <div>
                    <h3>{formatConcernType(concern.type)}</h3>
                    <p>Request {concern.requestId?._id?.slice(-6) || 'unknown'}</p>
                  </div>
                  <span className="mini-chip">
                    {concern.customerConfirmed ? 'confirmed' : 'awaiting confirm'}
                  </span>
                </div>
                <p>
                  Expected {concern.expectedCount} / Received {concern.receivedCount}
                </p>
                <p>{concern.note || 'No additional note was provided.'}</p>
                <p>Raised by: {concern.raisedByManagerId?.name || 'Manager'}</p>
                {!concern.customerConfirmed ? (
                  <button
                    className="primary-button"
                    disabled={isBusy}
                    onClick={() => onConfirmConcern(concern._id)}
                    type="button"
                  >
                    Confirm concern ticket
                  </button>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>
    </>
  )
}
