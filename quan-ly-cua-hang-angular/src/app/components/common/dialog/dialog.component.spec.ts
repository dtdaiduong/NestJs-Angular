import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

import { DialogComponent } from "./dialog.component";
export class MatDialogRefMock {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close = jest.fn().mockReturnValue(true);
  open = jest.fn().mockReturnValue(true);
}
describe("DialogComponent", () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let mockDialogRef;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [DialogComponent],
      imports: [
        CommonModule,
        MatFormFieldModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            lable: ["OK", "Cancel"],
            data: {},
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // jest.spyOn(dialog, "open").mockReturnValue();
    // jest.spyOn(dialog, "close").mockReturnValue(true);
  });

  it("should call onNoClick ", () => {

jest.spyOn(component,"onNoClick");
    component.onNoClick();
    expect(component.onNoClick).toHaveBeenCalled();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
