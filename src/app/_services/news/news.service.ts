import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsService {
    constructor(private http: HttpClient) { }

    getList(page): Promise<any> {
        const params = new HttpParams().set('page', page).set('limit', '25');
        return this.http.get<any>(environment.apiUrl + '/news/list', { params }).toPromise();
    }

    addNews(data: any) {
        return this.http.post(environment.apiUrl + '/news', data);
    }

    deleteNews(id: any) {
        return this.http.delete<any>(`${environment.apiUrl}/news/${id}`);
    }
}