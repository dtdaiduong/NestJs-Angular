import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
// import { Router } from '@angular/router';
// import { DialogComponent } from "../dialog/dialog.component"
// import { catchError, map, of, switchMap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
// import { PageEvent } from "@angular/material/paginator";
import { StateObservable, Store } from "@ngrx/store";
import {
  clearSort,
  deltetRoles,
  getListRoles,
  sortListRoles
} from "../../../store/roles/roles.action";
import {
  selectc,
  selectpaginator,
  selectResAPIRoles,
  selectRoleslise
} from "../../../store/roles/roles.selector";
import { DialogComponent } from "../../common/dialog/dialog.component";

import { Subscription } from "rxjs";
import {
  clearStateMessageRoles,
  createRoles,
  updateRoles
} from "../../../store/roles/roles.action";
export interface roles {
  key?: number;
  Action?: string;
  Created: string;
  id: number;
  name: string;
  Updated: string;
}

@Component({
  selector: "tsid-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.sass"],
})
export class RolesComponent implements OnInit, OnDestroy {
  constructor(
    // public loadingService: LoadingService,
    private store: Store,
    // private http: HttpClient,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar, // private formBuilder: FormBuilder,
  ) {}
  // loadingService = new LoadingService();
  ngOnDestroy(): void {
    this.tada.unsubscribe();
    this.message.unsubscribe();
  }
  openCreate() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "250px",
      data: { lable: ["Create"], data: { name: "" } },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.store.dispatch(createRoles({ name: result.data.name }));
      }
    });
  }
  ListKeySort = [
    { col: "name", display: "Name" },
    { col: "created_at", display: "Created" },
  ];
  col = "";
  criteria = "";

  sortedData: unknown[] = [];
  tada!: Subscription;
  message!: Subscription;
  hide = false;
  render = 0;
  actions: { type: string; name: string }[] = [
    { type: "text", name: "edit" },
    { type: "text", name: "delete" },
  ];
  displayedColumns: { type: string; name: string }[] = [
    { type: "text", name: "name" },
    { type: "text", name: "Created" },
    { type: "text", name: "Updated" },
    // { type: 'radio', name: 'Len' },

    { type: "action", name: "edit" },
    { type: "action", name: "delete" },
  ];

  paginator = this.store.select(selectpaginator) as StateObservable;
  dataSource = this.store.select(selectRoleslise) as StateObservable;
  resAPI$ = this.store.select(selectResAPIRoles);
  a = this.store.select(selectc) as StateObservable;
  onSort(sort: { col: string; criteria: string }) {
    // console.log(sort);
    switch (sort.criteria) {
      case "desc":
      case "asc":
        this.col = sort.col;
        this.criteria = sort.criteria;
        // console.log(this.col);
        this.store.dispatch(
          getListRoles({
            currentPage: 1,
            limit: this.pageSize,
            search: this.searchInput,
            col: sort.col,
            criteria: sort.criteria,
          }),
        );

        break;
      // case "desc":
      //   this.col = sort.col;
      //   this.criteria = sort.criteria;
      //   // console.log("a");
      //   console.log(this.col);

      //   this.store.dispatch(
      //     getListRoles({
      //       currentPage: 1,
      //       limit: this.pageSize,
      //       search: this.searchInput,
      //       col: sort.col,
      //       criteria: sort.criteria,
      //     }),
      //   );

      //   break;
      case "clear":
        this.col = "";
        this.criteria = "";
        this.store.dispatch(
          getListRoles({
            currentPage: 1,
            limit: this.pageSize,
            search: this.searchInput,
            col: "",
            criteria: "",
          }),
        );
        break;
    }
  }
  ngOnInit(): void {
    // console.log(this.formBuilder);
    this.tada = this.paginator.subscribe((data) => {
      this.pageSize = data.limit;
      this.searchInput = data.search;
    });
    this.store.dispatch(getListRoles());
    this.message = this.resAPI$.subscribe((response) => {
      if (response.error || response.status == "success") {
        this._snackBar.open(response.message, "Close", { duration: 2000 });
        this.store.dispatch(clearStateMessageRoles());
      }
      // if (response.status == "success") {
      //   this._snackBar.open(response.message, "Close", { duration: 1000 });
      //   this.store.dispatch(clearStateMessageRoles());
      // }
    });
    // this.reRender()
    this.dataSource.subscribe((data) => {
      this.sortedData = data;
    });
  }
  searchInput!: string;
  pageIndex!: number;
  pageSize!: number;
  handlePaginator(value: { pageIndex: number; pageSize: number }) {
    this.pageIndex = value.pageIndex;
    this.pageSize = value.pageSize;
    // console.log({
    //   currentPage: value.pageIndex,
    //   limit: value.pageSize,
    //   search: this.searchInput,
    //   col: this.col,
    //   criteria: this.criteria,
    // });
    this.store.dispatch(
      getListRoles({
        currentPage: value.pageIndex,
        limit: value.pageSize,
        search: this.searchInput,
        col: this.col,
        criteria: this.criteria,
      }),
    );
  }

  handleSearch(data: {
    type: string;
    value: { searchString: string; searchOption: string[] };
  }) {
    switch (data.type) {
      case "Search":
        if (
          data.value.searchString !== "" &&
          data.value.searchString !== undefined &&
          data.value.searchString !== this.searchInput
        ) {
          this.searchInput = data.value.searchString;
          this.store.dispatch(
            getListRoles({
              currentPage: 1,
              limit: this.pageSize,
              search: this.searchInput,
              col: "",
              criteria: "",
            }),
          );
        }
        break;
      case "clearSearch":
        if (this.searchInput !== "") {
          this.searchInput = "";
          this.store.dispatch(
            getListRoles({
              currentPage: 1,
              limit: this.pageSize,
              search: "",
              col: "",
              criteria: "",
            }),
          );
        }
        break;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleActions({ type, value }: { type: string; value: any }) {
    switch (type) {
      case "delete":
        // eslint-disable-next-line no-case-declarations
        const dialogRef = this.dialog.open(DialogComponent, {
          width: "250px",
          data: { lable: ["Delete"], data: {} },
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result !== undefined) {
            this.store.dispatch(deltetRoles(value.id));
          }
        });

        break;
      case "edit":
        // eslint-disable-next-line no-case-declarations
        const dialogRefa = this.dialog.open(DialogComponent, {
          width: "250px",
          data: { lable: ["Update"], data: { name: value.name } },
        });
        dialogRefa.afterClosed().subscribe((result) => {
          if (result !== undefined) {
            this.store.dispatch(
              updateRoles({ data: { id: value.id, name: result.data.name } }),
            );
          }
        });

        break;
      default:
        break;
    }
  }
  handleSortClient(sort: { active: string; direction: string }) {
    // console.log(sort.active, sort.direction);
    const data = this.sortedData.slice() as roles[];
    if (!sort.active || sort.direction === "") {
      // console.log(data);
      this.store.dispatch(clearSort());
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "name":
          return this.compare(a.name, b.name, isAsc);
        case "Created":
          return this.compare(a.Created, b.Created, isAsc);
        case "Updated":
          return this.compare(a.Updated, b.Updated, isAsc);
        default:
          return 0;
      }
    });
    this.store.dispatch(sortListRoles({ roles: this.sortedData as roles[] }));
  }
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
