export function DashboardShell({
  session,
  stats,
  feedback,
  isRefreshing,
  isBusy,
  onRefresh,
  onLogout,
  mainContent,
  sidebarContent,
}) {
  return (
    <main className="dashboard-shell">
      <section className="masthead">
        <div>
          <p className="eyebrow">Operations dashboard</p>
          <h1>
            {session.user.name}
            <span className="role-chip">{session.user.role}</span>
          </h1>
          <p className="hero-copy">
            Every role now has its own page and the actions match the WashFlow
            diagrams: request creation, assignment, notifications, status tracking,
            concern handling, and concern confirmation.
          </p>
        </div>

        <div className="masthead-actions">
          <button
            className="secondary-button"
            disabled={isRefreshing || isBusy}
            onClick={() => onRefresh()}
            type="button"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh data'}
          </button>
          <button className="secondary-button" onClick={onLogout} type="button">
            Log out
          </button>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Requests</span>
          <strong>{stats.requests}</strong>
        </article>
        <article className="stat-card">
          <span>Unread notifications</span>
          <strong>{stats.unreadNotifications}</strong>
        </article>
        <article className="stat-card">
          <span>Concerns</span>
          <strong>{stats.concerns}</strong>
        </article>
        <article className="stat-card">
          <span>Centers</span>
          <strong>{stats.centers}</strong>
        </article>
      </section>

      <div className="feedback-banner">{feedback}</div>

      <section className="dashboard-grid">
        <div className="main-column">{mainContent}</div>
        <aside className="side-column">{sidebarContent}</aside>
      </section>
    </main>
  )
}
