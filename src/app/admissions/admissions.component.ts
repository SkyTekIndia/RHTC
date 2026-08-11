import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admissions",
  templateUrl: "./admissions.component.html",
  styleUrls: ["./admissions.component.css"],
})
export class AdmissionsComponent implements OnInit {

  isRegistrationAllowed: Boolean = false;
  currentYear = new Date().getFullYear();

  constructor() {}
  ngOnInit() {
    const currentTime = Date.now();
    if (currentTime > 1657218599000 && currentTime < 1660156199000) {
      this.isRegistrationAllowed =  false;
    } else {
      this.isRegistrationAllowed = true;
    }
  }

  onRegTab(event) {
    event.preventDefault();
    const { activeId } = event;
    if( activeId === 'ngb-tab-0') {
      window.open(
        "https://rhtcreg.com/home/apply", "_blank");
    }
  }
}
