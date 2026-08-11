import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'; 
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayService {

  constructor(private http : HttpClient ) { }

  pay(data: any) {
    return this.http.post(environment.apiUrl + '/pay', data);
  }
}
