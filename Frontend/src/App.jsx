import { startTransition, useCallback, useEffect, useState } from 'react'
import './App.css'
import { DashboardShell } from './components/DashboardShell.jsx'
import { SidebarPanels } from './components/SidebarPanels.jsx'
import { AdminPage } from './pages/AdminPage.jsx'
import { AuthPage } from './pages/AuthPage.jsx'
import { CustomerPage } from './pages/CustomerPage.jsx'
import { ManagerPage } from './pages/ManagerPage.jsx'
import { apiRequest } from './lib/api.js'
import {
  formatConcernType,
  formatDateTime,
  formatRequestStatus,
} from './lib/format.js'
import { readStoredSession } from './lib/session.js'

const signupDefaults = {
  name: '',
  email: '',
  password: '',
  role: 'customer',
}

const loginDefaults = {
  email: '',
  password: '',
}

const requestDefaults = {
  clothesCount: '',
  preferredPickupDate: '',
  washingCenterId: '',
}

const concernDefaults = {
  requestId: '',
  type: 'count_mismatch',
  expectedCount: '',
  receivedCount: '',
  note: '',
}

const notificationDefaults = {
  requestId: '',
  message: '',
}

function App() {
  const [authMode, setAuthMode] = useState('login')
  const [signupForm, setSignupForm] = useState(signupDefaults)
  const [loginForm, setLoginForm] = useState(loginDefaults)
  const [requestForm, setRequestForm] = useState(requestDefaults)
  const [concernForm, setConcernForm] = useState(concernDefaults)
  const [notificationForm, setNotificationForm] = useState(notificationDefaults)
  const [session, setSession] = useState(readStoredSession)
  const [centers, setCenters] = useState([])
  const [requests, setRequests] = useState([])
  const [concerns, setConcerns] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isBusy, setIsBusy] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [feedback, setFeedback] = useState('Sign up or log in to use WashFlow.')

  const handleLogout = useCallback(() => {
    setSession(null)
    setCenters([])
    setRequests([])
    setConcerns([])
    setNotifications([])
    setFeedback('You have been logged out.')
  }, [])

  useEffect(() => {
    if (session) {
      localStorage.setItem('washflow-session', JSON.stringify(session))
    } else {
      localStorage.removeItem('washflow-session')
    }
  }, [session])

  const loadWorkspace = useCallback(
    async (tokenOverride) => {
      const activeToken = tokenOverride || session?.token

      if (!activeToken) {
        return
      }

      setIsRefreshing(true)

      try {
        const [user, centerData, requestData, concernData, notificationData] =
          await Promise.all([
            apiRequest('/api/auth/me', { token: activeToken }),
            apiRequest('/api/washing-centers', { token: activeToken }),
            apiRequest('/api/requests', { token: activeToken }),
            apiRequest('/api/concerns', { token: activeToken }),
            apiRequest('/api/notifications', { token: activeToken }),
          ])

        startTransition(() => {
          setSession((current) => (current ? { ...current, user } : current))
          setCenters(centerData)
          setRequests(requestData)
          setConcerns(concernData)
          setNotifications(notificationData)
        })
      } catch (error) {
        setFeedback(error.message)

        if (error.message.includes('Invalid or expired token')) {
          handleLogout()
        }
      } finally {
        setIsRefreshing(false)
      }
    },
    [handleLogout, session?.token],
  )

  useEffect(() => {
    if (session?.token) {
      void loadWorkspace(session.token)
    }
  }, [loadWorkspace, session?.token])

  const handleAuth = async (event) => {
    event.preventDefault()
    setIsBusy(true)
    setFeedback('')

    try {
      const endpoint = authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
      const body = authMode === 'signup' ? signupForm : loginForm
      const data = await apiRequest(endpoint, {
        method: 'POST',
        body,
      })

      const nextSession = {
        token: data.token,
        user: data.user,
      }

      setSession(nextSession)
      setFeedback(
        authMode === 'signup'
          ? `Account created for ${data.user.email}.`
          : `Welcome back, ${data.user.name}.`,
      )

      if (authMode === 'signup') {
        setSignupForm(signupDefaults)
      } else {
        setLoginForm(loginDefaults)
      }

      await loadWorkspace(data.token)
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleCreateRequest = async (event) => {
    event.preventDefault()
    setIsBusy(true)

    try {
      await apiRequest('/api/requests', {
        method: 'POST',
        token: session.token,
        body: {
          clothesCount: Number(requestForm.clothesCount),
          preferredPickupDate: requestForm.preferredPickupDate,
          washingCenterId: requestForm.washingCenterId || undefined,
        },
      })

      setRequestForm(requestDefaults)
      setFeedback('Laundry request created successfully.')
      await loadWorkspace()
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleAssignRequest = async (requestId, washingCenterId) => {
    if (!washingCenterId) {
      setFeedback('Choose a washing center before assigning the request.')
      return
    }

    setIsBusy(true)

    try {
      await apiRequest(`/api/requests/${requestId}/assign`, {
        method: 'PATCH',
        token: session.token,
        body: { washingCenterId },
      })

      setFeedback('Request assigned successfully.')
      await loadWorkspace()
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleSelectDraftCenter = (requestId, centerId) => {
    setRequests((current) =>
      current.map((entry) =>
        entry._id === requestId ? { ...entry, _draftCenterId: centerId } : entry,
      ),
    )
  }

  const handleUpdateStatus = async (requestId, status) => {
    setIsBusy(true)

    try {
      await apiRequest(`/api/requests/${requestId}/status`, {
        method: 'PATCH',
        token: session.token,
        body: { status },
      })

      setFeedback(`Request moved to ${formatRequestStatus(status)}.`)
      await loadWorkspace()
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleCreateConcern = async (event) => {
    event.preventDefault()
    setIsBusy(true)

    try {
      await apiRequest('/api/concerns', {
        method: 'POST',
        token: session.token,
        body: {
          requestId: concernForm.requestId,
          type: concernForm.type,
          expectedCount: Number(concernForm.expectedCount || 0),
          receivedCount: Number(concernForm.receivedCount || 0),
          note: concernForm.note,
        },
      })

      setConcernForm(concernDefaults)
      setFeedback('Concern ticket created successfully.')
      await loadWorkspace()
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleConfirmConcern = async (concernId) => {
    setIsBusy(true)

    try {
      await apiRequest(`/api/concerns/${concernId}/confirm`, {
        method: 'PATCH',
        token: session.token,
      })

      setFeedback('Concern ticket confirmed successfully.')
      await loadWorkspace()
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleMarkNotificationRead = async (notificationId) => {
    setIsBusy(true)

    try {
      await apiRequest(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        token: session.token,
      })

      setFeedback('Notification marked as read.')
      await loadWorkspace()
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const handleSendNotification = async (event) => {
    event.preventDefault()
    const selectedRequest = requests.find(
      (request) => request._id === notificationForm.requestId,
    )

    if (!selectedRequest?.userId?._id) {
      setFeedback('Choose a request linked to a customer before sending a notification.')
      return
    }

    setIsBusy(true)

    try {
      await apiRequest('/api/notifications', {
        method: 'POST',
        token: session.token,
        body: {
          userId: selectedRequest.userId._id,
          requestId: selectedRequest._id,
          message: notificationForm.message,
        },
      })

      setNotificationForm(notificationDefaults)
      setFeedback('Notification sent successfully.')
      await loadWorkspace()
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setIsBusy(false)
    }
  }

  const stats = {
    requests: requests.length,
    unreadNotifications: notifications.filter((notification) => !notification.isRead)
      .length,
    concerns: concerns.length,
    centers: centers.length,
  }

  const sharedSidebar = (
    <SidebarPanels
      centers={centers}
      concerns={concerns}
      formatConcernType={formatConcernType}
      formatDateTime={formatDateTime}
      formatRequestStatus={formatRequestStatus}
      isBusy={isBusy}
      notifications={notifications}
      onMarkNotificationRead={handleMarkNotificationRead}
      requests={requests}
    />
  )

  const rolePage = session?.user?.role === 'customer'
    ? (
        <CustomerPage
          centers={centers}
          concerns={concerns}
          formatConcernType={formatConcernType}
          formatDateTime={formatDateTime}
          formatRequestStatus={formatRequestStatus}
          isBusy={isBusy}
          onConfirmConcern={handleConfirmConcern}
          onCreateRequest={handleCreateRequest}
          requestForm={requestForm}
          requests={requests}
          setRequestForm={setRequestForm}
        />
      )
    : session?.user?.role === 'manager'
      ? (
          <ManagerPage
            concernForm={concernForm}
            formatDateTime={formatDateTime}
            formatRequestStatus={formatRequestStatus}
            isBusy={isBusy}
            onCreateConcern={handleCreateConcern}
            onUpdateStatus={handleUpdateStatus}
            requests={requests}
            setConcernForm={setConcernForm}
          />
        )
      : (
          <AdminPage
            centers={centers}
            formatDateTime={formatDateTime}
            formatRequestStatus={formatRequestStatus}
            isBusy={isBusy}
            notificationForm={notificationForm}
            onAssignRequest={handleAssignRequest}
            onSelectDraftCenter={handleSelectDraftCenter}
            onSendNotification={handleSendNotification}
            requests={requests}
            setNotificationForm={setNotificationForm}
          />
        )

  if (!session?.token) {
    return (
      <AuthPage
        authMode={authMode}
        feedback={feedback}
        isBusy={isBusy}
        loginForm={loginForm}
        onAuth={handleAuth}
        setAuthMode={setAuthMode}
        setLoginForm={setLoginForm}
        setSignupForm={setSignupForm}
        signupForm={signupForm}
      />
    )
  }

  return (
    <DashboardShell
      feedback={feedback}
      isBusy={isBusy}
      isRefreshing={isRefreshing}
      mainContent={rolePage}
      onLogout={handleLogout}
      onRefresh={loadWorkspace}
      session={session}
      sidebarContent={sharedSidebar}
      stats={stats}
    />
  )
}

export default App
