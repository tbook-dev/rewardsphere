import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { map, Observable } from 'rxjs'
import { ProofResponse } from './models/NextId'

@Injectable()
export class RequestService {
  constructor(@Inject() private readonly httpService: HttpService) {}

  private twitterToken = 'AAAAAAAAAAAAAAAAAAAAAF3%2BcAEAAAAAww5nRctaDnOpRT9iuP9sJIzNQ%2FM%3DlhJQwGNjxp3B6TUbiepZ0lZ6oEuxDUmEn2Yd5VpDNOd4LMHLn8'
  private twitterEndpointURL = 'https://api.twitter.com/2/tweets'
  private twitterParams = {
    'tweet.fields': 'lang,author_id',
    'user.fields': 'created_at',
  }

  private nextIdEndpointURL = 'https://proof-service.next.id/v2'

  getTwit(id: string) {
    const params = new URLSearchParams({ ...this.twitterParams, ids: id })
    this.httpService.get(`${this.twitterEndpointURL}?${params.toString()}`, {
      headers: {
        'User-Agent': 'v2TweetLookupJS',
        authorization: `Bearer ${this.twitterToken}`,
      },
    })
  }

  getWalletByTwitter(twitterHandle: string): Observable<string[]> {
    return this.httpService
      .get(`${this.nextIdEndpointURL}/proof?platform=twitter&identity=${twitterHandle}&exact=true`, {
        headers: {
          Accept: 'application/json',
        },
      })
      .pipe(
        map((r) => <ProofResponse>r.data),
        map((d) => d.ids.flatMap((did) => did.proofs.filter((p) => p.platform == 'ethereum'))),
        map((ids) => ids.map((id) => id.identity)),
      )
  }

  getTwitterByAddr(addr: string): Observable<string[]> {
    return this.httpService
      .get(`${this.nextIdEndpointURL}/proof?platform=ethereum&identity=${addr}&exact=true`, {
        headers: {
          Accept: 'application/json',
        },
      })
      .pipe(
        map((r) => <ProofResponse>r.data),
        map((d) => d.ids.flatMap((did) => did.proofs.filter((p) => p.platform == 'twitter'))),
        map((ids) => ids.map((id) => id.identity)),
      )
  }
}
