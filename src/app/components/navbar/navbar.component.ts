import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";
import { LoginService } from "app/login/login.service";
import { Account } from "app/core/auth/account.model";
import { AccountService } from "app/core/auth/account.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  isReady = false;
  currentAccount: Account | null = null;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private accountService: AccountService,
    private loginService: LoginService
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    this.isReady = false;
    this.accountService
      .identity()
      .subscribe((account) => {
        this.currentAccount = account;
        this.isReady = true;
      });
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(["/login"]);
  }
}
