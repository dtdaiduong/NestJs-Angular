import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { IResRoles } from "./roles.model";

@Injectable({
  providedIn: "root",
})
export class RolesService {
  constructor(private http: HttpClient) {}

  getListRoles() {
    return this.http.get<IResRoles>("http://localhost:8000/api/roles").pipe(
      map((res) => {
        return res;
      }),
    );
  }
}
