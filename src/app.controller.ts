import { Controller, Get, Param, Post } from '@nestjs/common'
import { AppService } from './app.service'
import { bufferToHex, ecrecover, fromRpcSig, publicToAddress } from '@ethereumjs/util'
import { RequestService } from './request.service'
import { firstValueFrom } from 'rxjs'

@Controller()
export class AppController {
  private nonces = {}
  constructor(private readonly appService: AppService, private readonly requestService: RequestService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('nonce')
  getNonce(@Param('address') addr: string) {
    const nonce = `sign in to btm: ${+new Date()}`
    this.nonces[addr] = nonce
    return nonce
  }

  @Post('signVerify')
  async signin(@Param('sign') sign: string, @Param('address') addr: string) {
    const res = fromRpcSig(sign)
    const pubBuffer = ecrecover(Buffer.from(this.nonces[addr]), res.v, res.r, res.s)
    const addrBuffer = publicToAddress(pubBuffer)
    const resolvedAddr = bufferToHex(addrBuffer)
    if (resolvedAddr != addr) {
      return
    }
    const twitterAccounts = await firstValueFrom(this.requestService.getTwitterByAddr(resolvedAddr))
    if (twitterAccounts.length) {
      return
    }
  }
}
