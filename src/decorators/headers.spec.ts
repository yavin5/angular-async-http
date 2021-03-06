
import {assert} from 'chai';
import { Observable } from 'rxjs';
import {Request, Response, ResponseOptions, RequestMethod, Http} from '@angular/http';
import { Client } from './client';
import { RestClient } from '../rest-client';
import { Get } from './request-methods';
import { Headers } from './headers';

describe('@Headers', () => {

  it('verify decorator attributes are set', () => {
    // Arrange
    let headers:{
      [name: string]: any;
    };
    let requestMock = new HttpMock((req: Request) => {
      headers = req.headers.toJSON();
      return Observable.of(new Response(new ResponseOptions({status: 200})));
    });
    let testClient = new TestClient(requestMock);

    // Act
    testClient.getItems();

    // Assert
    assert.deepEqual(headers, {
      accept: ['application/json'],
      lang: ['en','nl']
    });

  });
});

class HttpMock extends Http {

  public callCount:number = 0;
  public lastRequest:Request;

  constructor(private requestFunction: (req: Request) => Observable<Response>) {
    super(null, null);
  }

  public request(req: Request): Observable<Response> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }
}

class TestClient extends RestClient {

  @Get('/test')
  @Headers({
    'accept': 'application/json',
    'lang': ['en','nl']
  })
  public getItems(): Observable<Response> {
    return null;
  }

}
