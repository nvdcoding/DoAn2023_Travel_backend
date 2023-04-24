import { AdminRole, AdminStatus } from 'src/shares/enum/admin.enum';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { UserStatus } from 'src/shares/enum/user.enum';

export interface IJwtPayload {
  id: number;
  // username: string;
  email: string;
  verifyStatus: UserStatus;
}

export interface IJwtAdminPayload {
  id: number;
  email: string;
  status: AdminStatus;
  role: AdminRole;
}

export interface IJwtTourguidePayload {
  id: number;
  email: string;
  role: string;
  status: TourguideStatus;
  username: string;
}
