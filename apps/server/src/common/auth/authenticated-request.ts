import type { Request } from 'express';
import type { UserProfile } from '@shared/types';

export interface AuthenticatedRequest extends Request {
  user: UserProfile;
}
