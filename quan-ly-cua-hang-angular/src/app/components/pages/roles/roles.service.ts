import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ResponseAPI } from "../../../../app/pages/categories/categories.component.i";
import { Exchange } from "./roles.i";
@Injectable({
  providedIn: "root",
})
export class RolesService {
  constructor(private http: HttpClient) {}

  getListRoles(
    currentPage: number,
    limit: number,
    search: string,
    col = "",
    criteria = "",
  ) {
    let url = `http://localhost:8000/api/roles?page=${currentPage}&limit=${limit}&search=${search}`;
    col && criteria ? (url += `&key=${col}&sort=${criteria}`) : url;
    return this.http
      .get<Exchange>(url)
      .pipe
      // map((res) => {
      //   const data = res as unknown as {
      //     status: string;
      //     message: string;
      //     data: {
      //       created_at: string;
      //       id: number;
      //       name: string;
      //       updated_at: string;
      //     }[];
      //     currentPage: number;
      //     totalPage: number;
      //     limit: number;
      //     totalCount: number;
      //   };
      //   const list = data.data.map(
      //     (e: {
      //       created_at: string;
      //       id: number;
      //       name: string;
      //       updated_at: string;
      //     }) => {
      //       return {
      //         key: e.id,
      //         id: e.id,
      //         name: e.name,
      //         Created: new Date(Date.parse(e.created_at)).toLocaleString(),
      //         Updated: new Date(Date.parse(e.updated_at)).toLocaleString(),
      //         Action: "Action",
      //       };
      //     },
      //   );

      //   return {
      //     data: {
      //       roles: list,
      //       limit: data.limit,
      //       currentPage: data.currentPage,
      //       totalPage: data.totalPage,
      //       totalCount: data.totalCount,
      //     },
      //     message: {
      //       status: data.status,
      //       statusCode: 1,
      //       message: data.message,
      //       error: "string",
      //     },
      //   };
      // }),
      ();
    // return asa.pipe();
  }

  deleteRoles(id: number) {
    return this.http.delete<ResponseAPI>(
      `http://localhost:8000/api/roles/${id}`,
    );
  }
  createRoles(name: string) {
    return this.http.post<ResponseAPI>("http://localhost:8000/api/roles", {
      name,
    });
  }
  updateRoles(id: number, name: string) {
    return this.http.put<ResponseAPI>(`http://localhost:8000/api/roles/${id}`, {
      name,
    });
  }
  Exchange(res: Exchange) {
    const data = res as unknown as Exchange;
    const list = data.data.map(
      (e: {
        created_at: string;
        id: number;
        name: string;
        updated_at: string;
      }) => {
        return {
          key: e.id,
          id: e.id,
          name: e.name,
          Created: new Date(Date.parse(e.created_at)).toLocaleString(),
          Updated: new Date(Date.parse(e.updated_at)).toLocaleString(),
          Action: "Action",
        };
      },
    );

    return {
      data: {
        roles: list,
        limit: data.limit,
        currentPage: data.currentPage,
        totalPage: data.totalPage,
        totalCount: data.totalCount,
      },
      message: {
        status: data.status,
        statusCode: 1,
        message: data.message,
        error: "string",
      },
    };
  }
}
