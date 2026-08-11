import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
    constructor(private http: HttpClient) { }

    getList(page): Promise<any> {
        const params = new HttpParams().set('page', page).set('limit', '25');
        return this.http.get<any>(environment.apiUrl + '/student/list', { params }).toPromise();
    }

    getAll(): Promise<any> {
        return this.http.get(`${environment.apiUrl}/student/getAll`).toPromise();
    }

    generateRollNumber(): Promise<any> {
        return this.http.get(`${environment.apiUrl}/student/generate-rollno`).toPromise();
    }

    getById(id: string): Promise<any> {
        return this.http.get(`${environment.apiUrl}/student/application/${id}`).toPromise();
    }

    rejectById(data: any): Promise<any> {
        return this.http.post(`${environment.apiUrl}/student/reject`, data).toPromise();
    }

    getAdmitCard(data: any): Promise<any> {
        return this.http.post(`${environment.apiUrl}/student/getAdmitCard`, data, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
          }).toPromise();
    }

    applicationForm(data: any): Promise<any> {
        return this.http.post(`${environment.apiUrl}/student/getApplicationForm`, data, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
          }).toPromise();
    }
}