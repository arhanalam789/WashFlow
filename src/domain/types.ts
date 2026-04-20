export enum UserRole {
  Customer = "CUSTOMER",
  Manager = "MANAGER",
  Admin = "ADMIN",
}

export enum RequestStatus {
  Pending = "PENDING",
  Assigned = "ASSIGNED",
  InProgress = "IN_PROGRESS",
  Completed = "COMPLETED",
  ConcernRaised = "CONCERN_RAISED",
}

export enum ConcernType {
  MissingItem = "MISSING_ITEM",
  CountMismatch = "COUNT_MISMATCH",
  DeliveryIssue = "DELIVERY_ISSUE",
}

export enum NotificationType {
  RequestCreated = "REQUEST_CREATED",
  RequestAssigned = "REQUEST_ASSIGNED",
  RequestCompleted = "REQUEST_COMPLETED",
  ConcernRaised = "CONCERN_RAISED",
}
