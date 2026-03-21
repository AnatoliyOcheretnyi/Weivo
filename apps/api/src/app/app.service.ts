import type { HealthResponse } from '@weivo/contracts'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getData(): HealthResponse {
    return {
      status: 'ok',
      service: 'api',
    }
  }
}
