import { Component, OnInit } from "@angular/core";
import { map } from "rxjs";
import { LoginService } from "../login/login.service";
import { IUser } from "../users/users.component.i";
@Component({
  selector: "tsid-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.sass"],
})
export class ProfileComponent implements OnInit {
  profile: IUser = {
    id: 0,
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    roles: [],
    created_at: "",
    updated_at: "",
  };
  constructor(public loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.auth().subscribe((res) => {
      if (res.data) this.profile = res.data;
    });
  }
}
