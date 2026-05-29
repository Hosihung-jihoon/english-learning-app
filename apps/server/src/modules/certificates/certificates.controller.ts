import { Controller, Get, UseGuards } from '@nestjs/common';
import type { Certificate, UserProfile } from '@shared/types';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CertificatesService } from './certificates.service';

@Controller('certificates')
@UseGuards(AuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  findAll(@CurrentUser() user: UserProfile): Promise<Certificate[]> {
    return this.certificatesService.getForUser(user.id);
  }
}
