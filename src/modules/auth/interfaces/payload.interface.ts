import { AdminRole, AdminStatus } from 'src/shares/enum/admin.enum';
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
