import { Component, Input } from "@angular/core";
import { FormControl } from "@angular/forms";
@Component({
  selector: "tsid-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
})
export class InputComponent {
  @Input() placeholder!: string;
  @Input() size!: string;
  @Input() lable!: string;
  @Input() type!: string;
  @Input() value!: string;
  @Input() readonly!: boolean;
  @Input() inputControl: FormControl = new FormControl();
  @Input() errorList!: { name: string; message: string }[];
}
