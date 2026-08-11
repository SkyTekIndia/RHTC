import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GalleryService {
    constructor(private http: HttpClient) { }

    getList(page): Promise<any> {
        const params = new HttpParams().set('page', page).set('limit', '50');
        return this.http.get<any>(environment.apiUrl + '/gallery/list', { params }).toPromise();
    }

    addGallery(data: any) {
        return this.http.post(environment.apiUrl + '/gallery', data);
    }

    delete(id: any) {
        return this.http.delete<any>(`${environment.apiUrl}/gallery/${id}`);
    }
}