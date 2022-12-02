import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, map, of } from "rxjs";
import { IRoles } from "../roles/roles.model";
import {
  IAddUser,
  IDelUser,
  IEditUser,
  IGetOneUser,
  IResUser,
} from "./users.component.i";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getListUser(
    page: number,
    limit: number,
    search: string,
    roles: number[],
    column?: string,
    options?: string,
  ) {
    let url = `http://localhost:8000/api/user?page=${page}&limit=${limit}&role=[${roles}]&search=${search}`;
    column && options ? (url += `&column=${column}&options=${options}`) : url;
    return this.http.get<IResUser>(url).pipe(map((res) => res));
  }

  addUser(
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    address: string,
    roles: IRoles[],
  ) {
    const lstRoles = roles.map((r) => r.id);
    const user = {
      firstname,
      lastname,
      email,
      phone,
      address,
      roles: lstRoles,
    };
    return this.http
      .post<IAddUser>("http://localhost:8000/api/user", user)
      .pipe(
        map((res) => {
          return res;
        }),
      );
  }

  editUser(
    id: number,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    address: string,
    roles: number[],
  ) {
    const user = { firstname, lastname, email, phone, address, roles };
    return this.http
      .put<IEditUser>(`http://localhost:8000/api/user/${id}`, user)
      .pipe();
  }

  getOneUser(id: number) {
    return this.http
      .get<IGetOneUser>(`http://localhost:8000/api/user/${id}`)
      .pipe(map((res) => res.data));
  }

  delUser(id: number) {
    return this.http
      .delete<IDelUser>(`http://localhost:8000/api/user/${id}`)
      .pipe(map((res) => res));
  }
}
