import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map'; 
import { User } from '../../_models';
import { environment } from '../../../environments/environment';
 
@Injectable({ providedIn: 'root' })
export class UserService { 
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(environment.apiUrl+'/users/getAllUsers');
    }

    getById(id: string) {
        return this.http.get(environment.apiUrl+'/users/'+id);
    }

    register(user: User) {
        return this.http.post(environment.apiUrl+'/users/register', user);
    }

    update(user: User) {
        return this.http.put(environment.apiUrl + '/users/update', user);
    }

    acceptServices(data: any){
        return this.http.put(environment.apiUrl + '/users/acceptservices', data);
    }

    delete(_id: number) {
        return this.http.delete(environment.apiUrl + '/users/' + _id);
    }
}