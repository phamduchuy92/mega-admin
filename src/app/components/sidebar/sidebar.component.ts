import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AccountService } from "app/core/auth/account.service";
import { LoginService } from "app/login/login.service";

declare const $: any;
declare interface RouteInfo {
  path?: string;
  title: string;
  icon: string;
  class: string;

  children?: any[];
}
export const ROUTES: RouteInfo[] = [
  { path: "/dashboard", title: "Dashboard", icon: "dashboard", class: "" },
  { path: "/user-profile", title: "User Profile", icon: "person", class: "" },
  { path: "/maps", title: "Maps", icon: "location_on", class: "" },
  {
    title: "Thương Mại Điện Tử",
    icon: "shopping_cart",
    class: "",
    children: [
      {
        path: "/ecommerce/products",
        title: "Sản Phẩm",
        icon: "inventory_2",
        class: "",
      },
      {
        path: "/ecommerce/orders",
        title: "Đơn Hàng",
        icon: "checklist_rtl",
        class: "",
      },
    ],
  },
  {
    title: "Quản lý",
    icon: "settings",
    class: "",
    children: [
      {
        path: "/user-management",
        title: "Quản Lý Tài Khoản",
        icon: "person",
        class: "",
      },
    ],
  },
  
  
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  isAuthenticated(): boolean {
    return this.accountService.isAuthenticated();
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(["/login"]);
  }

  getImageUrl(): string {
    return this.isAuthenticated() ? this.accountService.getImageUrl() : "";
  }
}
