import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginService } from "app/login/login.service";
import { AccountService } from "app/core/auth/account.service";
import * as $ from "jquery";

@Component({
  selector: "jhi-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild("username", { static: false })
  username?: ElementRef;

  authenticationError = false;

  loginForm = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
    rememberMe: [false],
  });

  constructor(
    private accountService: AccountService,
    private loginService: LoginService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // if already authenticated then navigate to home page
    this.accountService.identity().subscribe(() => {
      if (this.accountService.isAuthenticated()) {
        this.router.navigate([""]);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.username) {
      this.username.nativeElement.focus();
      // + jquery check input
      this.change();
    }
  }

  login(): void {
    console.log(this.loginForm);
    this.loginService
      .login({
        username: this.loginForm.get("username")!.value,
        password: this.loginForm.get("password")!.value,
        rememberMe: this.loginForm.get("rememberMe")!.value,
      })
      .subscribe(
        () => {
          this.authenticationError = false;
          if (!this.router.getCurrentNavigation()) {
            // There were no routing during login (eg from navigationToStoredUrl)
            this.router.navigate([""]);
          }
        },
        () => (this.authenticationError = true)
      );
  }

  change(): void {
    $(".input100").each(function () {
      $(this).on("blur", function () {
        if ($(this).val().toString().trim() != "") {
          $(this).addClass("has-val");
        } else {
          $(this).removeClass("has-val");
        }
      });
    });
  }
}
