import { API_BASE_URL } from '../lib/api.js'

export function AuthPage({
  authMode,
  setAuthMode,
  signupForm,
  setSignupForm,
  loginForm,
  setLoginForm,
  onAuth,
  isBusy,
  feedback,
}) {
  return (
    <main className="auth-shell">
      <section className="auth-hero">
        <p className="eyebrow">WashFlow</p>
        <h1>Laundry operations, delivery updates, and concern handling in one place.</h1>
        <p className="hero-copy">
          Register or log in as a customer, manager, or admin. Each role opens its
          own page and is connected to the live backend workflow.
        </p>

        <div className="auth-summary">
          <span>Live API</span>
          <code>{API_BASE_URL}</code>
        </div>
      </section>

      <section className="auth-card">
        <div className="tab-row">
          <button
            className={authMode === 'login' ? 'tab active' : 'tab'}
            onClick={() => setAuthMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={authMode === 'signup' ? 'tab active' : 'tab'}
            onClick={() => setAuthMode('signup')}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="stack-form" onSubmit={onAuth}>
          {authMode === 'signup' ? (
            <>
              <label>
                <span>Name</span>
                <input
                  value={signupForm.name}
                  onChange={(event) =>
                    setSignupForm({ ...signupForm, name: event.target.value })
                  }
                  placeholder="Avery Walker"
                  required
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(event) =>
                    setSignupForm({ ...signupForm, email: event.target.value })
                  }
                  placeholder="avery@example.com"
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(event) =>
                    setSignupForm({ ...signupForm, password: event.target.value })
                  }
                  placeholder="At least 6 characters"
                  required
                />
              </label>

              <label>
                <span>Role</span>
                <select
                  value={signupForm.role}
                  onChange={(event) =>
                    setSignupForm({ ...signupForm, role: event.target.value })
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
            </>
          ) : (
            <>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm({ ...loginForm, email: event.target.value })
                  }
                  placeholder="avery@example.com"
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm({ ...loginForm, password: event.target.value })
                  }
                  placeholder="Your password"
                  required
                />
              </label>
            </>
          )}

          <button className="primary-button" disabled={isBusy} type="submit">
            {isBusy ? 'Working...' : authMode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div className="feedback-box">{feedback}</div>
      </section>
    </main>
  )
}
