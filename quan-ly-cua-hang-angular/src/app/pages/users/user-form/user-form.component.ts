import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, of, startWith, Subscription } from "rxjs";
import { roles } from "../../../components/pages/roles/roles.component";
import { getListRoles } from "../../../store/roles/roles.action";
import { selectRoles } from "../../../store/roles/roles.selector";
import {
  AddUser,
  GetUser,
  UpdateUser,
} from "../../../store/users/users.action";
import { getOneUser } from "../../../store/users/users.selector";

@Component({
  selector: "tsid-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.sass"],
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  actionBtn = "Add";
  rolesList: roles[] = [];
  rolesChoosed: roles[] = [];
  id!: number;
  userSub!: Subscription;
  user$ = this.store.select(getOneUser);
  roles$ = this.store.select(selectRoles);
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private store: Store,
  ) {}

  ngOnInit(): void {
    const routeParams = Number(this.route.snapshot.paramMap.get("id"));
    this.store.dispatch(
      getListRoles({
        currentPage: 1,
        limit: 50,
        search: "",
        col: "",
        criteria: "",
      }),
    );
    this.userForm = this.formBuilder.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      phone: [""],
      address: [""],
      email: ["", Validators.required],
    });
    if (routeParams !== 0) {
      this.id = routeParams;
      this.store.dispatch(GetUser({ id: this.id }));
      this.userSub = this.user$.subscribe((data) => {
        if (data) {
          this.userForm.controls["firstname"].setValue(data.firstname);
          this.userForm.controls["lastname"].setValue(data.lastname);
          this.userForm.controls["phone"].setValue(data.phone);
          this.userForm.controls["address"].setValue(data.address);
          this.userForm.controls["email"].setValue(data.email);
          data.roles.forEach((r) => {
            this.fruits.push(r.name);
          });
          this.actionBtn = "Save";
        }
      });
    }

    this.roles$.subscribe((r) => {
      this.allFruits = r.roles.map((e) => e.name);
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) =>
          fruit ? this._filter(fruit) : this.allFruits.slice(),
        ),
      );
      this.rolesList = r.roles;
    });
  }

  addUser() {
    if (this.actionBtn === "Save") {
      // edit
      this.rolesChoosed = [];
      this.rolesList.forEach((roles) => {
        if (this.fruits.indexOf(roles.name) !== -1) {
          this.rolesChoosed.push(roles);
        }
      });
      this.store.dispatch(
        UpdateUser({
          id: this.id,
          firstname: this.userForm.value.firstname,
          lastname: this.userForm.value.lastname,
          email: this.userForm.value.email,
          phone: this.userForm.value.phone,
          address: this.userForm.value.address,
          roles: this.rolesChoosed,
        }),
      );
    } else {
      // add
      this.rolesChoosed = [];
      this.rolesList.forEach((roles) => {
        if (this.fruits.indexOf(roles.name) !== -1) {
          this.rolesChoosed.push(roles);
        }
      });
      this.store.dispatch(
        AddUser({
          ...this.userForm.value,
          roles: this.rolesChoosed,
        }),
      );
    }
  }

  /////////////////////////////////// chips
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl("");
  filteredFruits!: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [];

  @ViewChild("fruitInput") fruitInput!: ElementRef<HTMLInputElement>;

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = "";
    this.fruitCtrl.setValue(null);
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter((fruit) =>
      fruit.toLowerCase().includes(filterValue),
    );
  }
}
