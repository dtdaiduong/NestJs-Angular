import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { provideMockStore } from "@ngrx/store/testing";
import { deleteProduct } from "../../../store/products/products.action";

import { ConfirmDialogComponent } from "./confirm-dialog.component";

describe("ConfirmDialogComponent", () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const dialogMock = {
    close: () => {
      //
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [],
      providers: [
        provideMockStore({}),
        {
          provide: MatDialogRef,
          useValue: dialogMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            id: 0,
            name: "",
            description: "",
            price: 0,
            image: "",
            created_at: "",
            updated_at: "",
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("[1] Initial component", () => {
    it("[1.1] should create", () => {
      expect(component).toBeTruthy();
    });
  });

  describe("[2] Cancel dialog", () => {
    it("[2.1] should call fn close", () => {
      // Arrange
      const close = jest.spyOn(component.dialogRef, "close");
      // Act
      component.cancel();
      // Assert
      expect(close).toHaveBeenCalled();
    });
  });

  describe("[3] Delete data", () => {
    it("[3.1] should dispatch deleteProduct action", () => {
      // Arrange
      const dispatch = jest.spyOn(component.getStore(), "dispatch");
      const action = deleteProduct({ id: 0 });
      // Act
      component.delete();
      // Assert
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(action);
    });

    it("[3.2] should call fn close of dialogRef", () => {
      // Arrange
      const close = jest.spyOn(component.dialogRef, "close");
      // Act
      component.delete();
      // Assert
      expect(close).toHaveBeenCalled();
    });
  });
});
