import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { saveAs } from 'file-saver';
import { Parser, transforms } from 'json2csv';


@Injectable({
  providedIn: 'root'
})
export class FileHelperService {

  constructor(private http: HttpClient) { }

  fileUpload(formData: any) {
    return this.http.post<any>(environment.apiUrl + '/files/upload', formData)
  }

  getFile(filename: string) {
    var body = { filename: filename };
    return this.http.post(environment.apiUrl + '/files/get', body, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    }).toPromise();
  }

  fileUrl(filename: string) {
    var body = { filename: filename };
    return this.http.post<any>(environment.apiUrl + '/files/get-url', body)
  }

  downloadFile(data: any) {
    const json2csvParser = new Parser(data);
    const csv = json2csvParser.parse(data);
    var blob = new Blob([csv], { type: 'text/csv' })
    saveAs(blob, "students.csv");
  }
}
