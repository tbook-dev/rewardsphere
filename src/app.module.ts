import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { HttpModule } from '@nestjs/axios'
import { RequestService } from './request.service'

@Module({
  imports: [HttpModule],
  //controllers: [AppController],
  //providers: [AppService, RequestService],
})
export class AppModule {}
