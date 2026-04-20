export const formatDateTime = (value) => {
  if (!value) {
    return 'Not set'
  }

  return new Date(value).toLocaleString()
}

export const formatRequestStatus = (status) =>
  (status || 'unknown').replaceAll('_', ' ')

export const formatConcernType = (type) =>
  (type || 'unknown').replaceAll('_', ' ')
