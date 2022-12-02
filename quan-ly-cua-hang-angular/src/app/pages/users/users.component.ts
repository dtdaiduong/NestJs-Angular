import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { StateObservable, Store } from "@ngrx/store";
import { map } from "rxjs";
import { LoadingService } from "../../../app/interceptor/loading/loading.service";
import { DialogComponent } from "../../components/common/dialog/dialog.component";
import { getListRoles } from "../../store/roles/roles.action";
import { selectRoles } from "../../store/roles/roles.selector";
import { Clear, DeleteUser, GetAllUsers } from "../../store/users/users.action";
import { getAllUsers, getPaginator } from "../../store/users/users.selector";
import { ISort } from "../products/products.component.i";
import { IRoles } from "../roles/roles.model";
import { IUser } from "./users.component.i";

export interface objCommon {
  type: string;
  name: string;
}

@Component({
  selector: "tsid-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.sass"],
})
export class UsersComponent implements OnInit, OnDestroy {
  constructor(
    public store: Store,
    public dialog: MatDialog,
    private router: Router,
    public loadingService: LoadingService,
  ) {}
  ngOnDestroy(): void {
    this.store.dispatch(Clear());
    if (this.listRoles$) {
      this.listRoles$.unsubscribe();
    }
    if (this.dialogRef$) {
      this.dialogRef$.unsubscribe();
    }
  }
  sort: ISort = {
    col: "",
    criteria: "",
  };
  hide = false;
  actions: objCommon[] = [
    { type: "text", name: "edit" },
    { type: "text", name: "delete" },
  ];
  roles = true;
  displayedColumns: objCommon[] = [
    { type: "text", name: "firstname" },
    { type: "text", name: "lastname" },
    { type: "text", name: "email" },
    { type: "text", name: "phone" },
    { type: "text", name: "address" },
    { type: "array", name: "roles" },
    { type: "action", name: "edit" },
    { type: "action", name: "delete" },
  ];
  ListKeySort: { col: string; display: string }[] = [
    {
      col: "firstname",
      display: "First Name",
    },
    {
      col: "lastname",
      display: "Last Name",
    },
    {
      col: "email",
      display: "Email",
    },
    {
      col: "phone",
      display: "Phone",
    },
    {
      col: "address",
      display: "Address",
    },
  ];

  paginator = this.store.select(getPaginator) as StateObservable;
  data = this.store.select(getAllUsers) as StateObservable;
  dataSource = this.data.pipe(
    map((lst) => {
      return lst.map((u: IUser) => {
        const roles = u.roles.map((r: IRoles) => r.name);
        return { ...u, roles };
      });
    }),
  );
  allFruits: string[] = [];
  rolesList: IRoles[] = [];
  lstRoles = this.store.select(selectRoles);
  listRoles$: any;
  dialogRef$: any;
  ngOnInit(): void {
    this.store.dispatch(
      GetAllUsers({
        page: 1,
        limit: 5,
        search: this.stringSearch,
        roles: this.rolesSearch,
      }),
    );
    this.store.dispatch(
      getListRoles({
        currentPage: 1,
        limit: 50,
        search: "",
        col: "",
        criteria: "",
      }),
    );
    this.listRoles$ = this.lstRoles.subscribe((r) => {
      this.allFruits = r.roles.map((e) => e.name);
      this.rolesList = r.roles;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle({ type, value }: { type: string; value: any }) {
    switch (type) {
      case "delete":
        // eslint-disable-next-line no-case-declarations
        const dialogRef = this.dialog.open(DialogComponent, {
          width: "250px",
          data: {
            lable: [
              "Delete",
              "are you sure delete " + value.firstname + " " + value.lastname,
            ],
            data: {},
          },
        });
        this.dialogRef$ = dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.store.dispatch(DeleteUser({ id: value.id }));
          }
        });
        break;
      case "edit":
        this.router.navigate(["admin/users/" + value.id]);
        break;
      default:
        break;
    }
  }

  handleSort(e: { col: string; criteria: string }) {
    if (e.criteria == "clear") {
      this.sort = {
        col: "",
        criteria: "",
      };
      this.store.dispatch(
        GetAllUsers({
          page: 1,
          limit: 5,
          search: this.stringSearch,
          roles: this.rolesSearch,
        }),
      );
    } else {
      this.sort = e;
      this.store.dispatch(
        GetAllUsers({
          page: 1,
          limit: 5,
          search: this.stringSearch,
          roles: this.rolesSearch,
          column: e.col,
          options: e.criteria,
        }),
      );
    }
  }

  sortClient(e: { active: string; direction: string }) {
    if (e.direction == "") {
      this.sort = {
        col: "",
        criteria: "",
      };
      this.store.dispatch(
        GetAllUsers({
          page: 1,
          limit: 5,
          search: this.stringSearch,
          roles: this.rolesSearch,
        }),
      );
    } else {
      this.sort = { col: e.active, criteria: e.direction };
      this.store.dispatch(
        GetAllUsers({
          page: 1,
          limit: 5,
          search: this.stringSearch,
          roles: this.rolesSearch,
          column: e.active,
          options: e.direction,
        }),
      );
    }
  }

  handlepaginator(e: { pageIndex: number; pageSize: unknown }) {
    this.store.dispatch(
      GetAllUsers({
        page: e.pageIndex,
        limit: e.pageSize as number,
        search: this.stringSearch,
        roles: this.rolesSearch,
        column: this.sort.col,
        options: this.sort.criteria,
      }),
    );
  }

  stringSearch = "";
  rolesSearch: number[] = [];

  handleSearch(e: {
    type: string;
    value: { searchString: string | undefined; searchOption: string[] };
  }) {
    if (e.type === "Search") {
      if (
        // search name
        e.value.searchString != "" &&
        e.value.searchString != undefined &&
        e.value.searchOption.length == 0
      ) {
        this.rolesSearch = [];
        this.stringSearch = e.value.searchString;
        this.store.dispatch(
          GetAllUsers({
            page: 1,
            limit: 5,
            search: this.stringSearch,
            roles: [],
            column: this.sort.col,
            options: this.sort.criteria,
          }),
        );
      } else if (
        // search roles
        (e.value.searchString == undefined || e.value.searchString == "") &&
        e.value.searchOption.length !== 0
      ) {
        const rolesId: number[] = [];
        this.rolesList.forEach((element) => {
          e.value.searchOption.forEach((r) => {
            if (element.name === r) {
              rolesId.push(element.id);
            }
          });
        });
        this.rolesSearch = rolesId;
        this.stringSearch = "";
        this.store.dispatch(
          GetAllUsers({
            page: 1,
            limit: 5,
            search: this.stringSearch,
            roles: rolesId,
            column: this.sort.col,
            options: this.sort.criteria,
          }),
        );
      } else if (
        //search roles and name
        e.value.searchString != "" &&
        e.value.searchString != undefined &&
        e.value.searchOption.length !== 0
      ) {
        const rolesId: number[] = [];
        this.rolesList.forEach((element) => {
          e.value.searchOption.forEach((r) => {
            if (element.name === r) {
              rolesId.push(element.id);
            }
          });
        });
        this.rolesSearch = rolesId;
        this.stringSearch = e.value.searchString;
        this.store.dispatch(
          GetAllUsers({
            page: 1,
            limit: 5,
            search: this.stringSearch,
            roles: rolesId,
            column: this.sort.col,
            options: this.sort.criteria,
          }),
        );
      }
    } else if (e.type === "clearSearch") {
      if (this.stringSearch !== "") {
        this.sort = {
          col: "",
          criteria: "",
        };
        this.rolesSearch = [];
        this.stringSearch = "";
        this.store.dispatch(
          GetAllUsers({
            page: 1,
            limit: 5,
            search: "",
            roles: [],
          }),
        );
      }
    }
  }

  openCreate() {
    this.router.navigate(["admin/users/create"]);
  }
}
