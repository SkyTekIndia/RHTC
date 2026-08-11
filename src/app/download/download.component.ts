import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  isAdmitDownloadAllowed: boolean;
  constructor() { }

  ngOnInit() {
    const currentTime = new Date().getTime();

    if(currentTime > 1660415399000 && currentTime < 1661020199000) {
      this.isAdmitDownloadAllowed = true;
    }
  }

}
