import { Component } from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
// import {Component} from '@angular/core';
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { Router } from "@angular/router";
import { LoginService } from "../../../pages/login/login.service";
interface AdminNode {
  name: string;
  url?: string;
  children?: AdminNode[];
}

@Component({
  selector: "tsid-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.sass"],
})
export class AdminComponent {
  constructor(private router: Router, public loginService: LoginService) {
    this.dataSource.data = this.TREE_DATA;
  }
  TREE_DATA: AdminNode[] = [
    {
      name: "Manage",
      children: [
        { name: "Categories", url: "/admin/categories" },
        { name: "Roles", url: "/admin/roles" },
        { name: "Users", url: "/admin/users" },
        { name: "Products", url: "/admin/products" },
        { name: "Orders", url: "/admin/orders" },
      ],
    },
  ];
  treeControl = new NestedTreeControl<AdminNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<AdminNode>();
  navigate(element: string) {
    this.router.navigate([element]);
  }

  hasChild = (_: number, node: AdminNode) =>
    !!node.children && node.children.length > 0;
}
