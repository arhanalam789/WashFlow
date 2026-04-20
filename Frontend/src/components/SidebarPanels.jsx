export function SidebarPanels({
  centers,
  requests,
  notifications,
  concerns,
  isBusy,
  onMarkNotificationRead,
  formatDateTime,
  formatRequestStatus,
  formatConcernType,
}) {
  return (
    <>
      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Centers</p>
            <h2>Available washing centers</h2>
          </div>
        </div>

        <div className="card-list compact">
          {centers.map((center) => (
            <article className="card" key={center._id}>
              <h3>{center.centerName}</h3>
              <p>{center.location}</p>
              <p>{center.contactPhone}</p>
              <span className="mini-chip">{center.operationStatus}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Requests</p>
            <h2>Recent activity</h2>
          </div>
        </div>

        <div className="card-list compact">
          {requests.length === 0 ? (
            <div className="empty-state">No requests to show yet.</div>
          ) : (
            requests.map((request) => (
              <article className="card" key={request._id}>
                <div className="card-top">
                  <h3>{request._id.slice(-6)}</h3>
                  <span className={`status-pill status-${request.status}`}>
                    {formatRequestStatus(request.status)}
                  </span>
                </div>
                <p>{request.userId?.name || 'Customer'}</p>
                <p>{request.washingCenterId?.centerName || 'Awaiting assignment'}</p>
                <p>{formatDateTime(request.preferredPickupDate)}</p>
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Notifications</p>
            <h2>Inbox</h2>
          </div>
        </div>

        <div className="card-list compact">
          {notifications.length === 0 ? (
            <div className="empty-state">No notifications yet.</div>
          ) : (
            notifications.map((notification) => (
              <article className="card" key={notification._id}>
                <div className="card-top">
                  <h3>{notification.type.replaceAll('_', ' ')}</h3>
                  {!notification.isRead ? <span className="mini-chip">new</span> : null}
                </div>
                <p>{notification.message}</p>
                <p>{formatDateTime(notification.sentAt)}</p>
                {!notification.isRead ? (
                  <button
                    className="secondary-button"
                    disabled={isBusy}
                    onClick={() => onMarkNotificationRead(notification._id)}
                    type="button"
                  >
                    Mark as read
                  </button>
                ) : null}
              </article>
            ))
          )}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Concern tickets</p>
            <h2>Open issue trail</h2>
          </div>
        </div>

        <div className="card-list compact">
          {concerns.length === 0 ? (
            <div className="empty-state">No concern tickets created yet.</div>
          ) : (
            concerns.map((concern) => (
              <article className="card" key={concern._id}>
                <div className="card-top">
                  <h3>{formatConcernType(concern.type)}</h3>
                  <span className="mini-chip">
                    {concern.requestId?._id?.slice(-6) || 'request'}
                  </span>
                </div>
                <p>Raised by: {concern.raisedByManagerId?.name || 'Unknown user'}</p>
                <p>
                  Expected {concern.expectedCount} / Received {concern.receivedCount}
                </p>
                <p>{concern.note || 'No note added.'}</p>
                <p>
                  Status:{' '}
                  {concern.customerConfirmed ? 'confirmed by customer' : 'awaiting customer'}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  )
}
