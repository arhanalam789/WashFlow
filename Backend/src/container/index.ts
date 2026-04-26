import { NotificationFactory } from "../factories/notification.factory";
import { AuthController } from "../controllers/auth.controller";
import { ConcernController } from "../controllers/concern.controller";
import { LaundryRequestController } from "../controllers/laundry-request.controller";
import { NotificationController } from "../controllers/notification.controller";
import { WashingCenterController } from "../controllers/washing-center.controller";
import { ConcernTicketRepository } from "../repositories/concern-ticket.repository";
import { LaundryRequestRepository } from "../repositories/laundry-request.repository";
import { NotificationRepository } from "../repositories/notification.repository";
import { UserRepository } from "../repositories/user.repository";
import { WashingCenterRepository } from "../repositories/washing-center.repository";
import { AuthService } from "../services/auth.service";
import { ConcernService } from "../services/concern.service";
import { LaundryRequestService } from "../services/laundry-request.service";
import { NotificationService } from "../services/notification.service";
import { WashingCenterService } from "../services/washing-center.service";

const userRepository = new UserRepository();
const washingCenterRepository = new WashingCenterRepository();
const laundryRequestRepository = new LaundryRequestRepository();
const concernTicketRepository = new ConcernTicketRepository();
const notificationRepository = new NotificationRepository();
const notificationFactory = new NotificationFactory();

const washingCenterService = new WashingCenterService(washingCenterRepository);
const notificationService = new NotificationService(
  notificationRepository,
  notificationFactory,
);
const authService = new AuthService(userRepository, washingCenterService);
const laundryRequestService = new LaundryRequestService(
  laundryRequestRepository,
  washingCenterService,
  notificationService,
);
const concernService = new ConcernService(
  concernTicketRepository,
  laundryRequestRepository,
  notificationService,
);

export const authController = new AuthController(authService);
export const washingCenterController = new WashingCenterController(
  washingCenterService,
);
export const laundryRequestController = new LaundryRequestController(
  laundryRequestService,
);
export const concernController = new ConcernController(concernService);
export const notificationController = new NotificationController(
  notificationService,
);
