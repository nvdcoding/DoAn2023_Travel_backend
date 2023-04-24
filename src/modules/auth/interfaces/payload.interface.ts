import { AdminRole, AdminStatus } from 'src/shares/enum/admin.enum';
import { ActorRole } from 'src/shares/enum/auth.enum';
import { TourguideStatus } from 'src/shares/enum/tourguide.enum';
import { UserStatus } from 'src/shares/enum/user.enum';

export interface IJwtPayload {
  id: number;
  // username: string;
  email: string;
  verifyStatus: UserStatus;
  role: ActorRole;
}

export interface IJwtAdminPayload {
  id: number;
  email: string;
  status: AdminStatus;
  role: ActorRole;
}

export interface IJwtTourguidePayload {
  id: number;
  email: string;
  role: ActorRole;
  status: TourguideStatus;
  username: string;
}
