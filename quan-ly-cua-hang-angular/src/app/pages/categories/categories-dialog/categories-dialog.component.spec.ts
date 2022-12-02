import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockStore } from "@ngrx/store/testing";
import { deleteCategory } from "../../../store/categories/categories.action";
import { MaterialModule } from "../../../material/material.module";
import { CategoriesDialogComponent } from "./categories-dialog.component";

describe("ConfirmDialogComponent", () => {
  let component: CategoriesDialogComponent;
  let fixture: ComponentFixture<CategoriesDialogComponent>;

  const dialogMock = {
    close: () => {
      //
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, NoopAnimationsModule],
      declarations: [CategoriesDialogComponent],
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
            created_at: "",
            updated_at: "",
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("cancel", () => {
    it("should call method close of dialogRef", () => {
      // Arrange
      const close = jest.spyOn(component.dialogRef, "close");
      // Act
      component.cancel();
      // Assert
      expect(close).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should dispatch deleteCategory action", () => {
      // Arrange
      const dispatch = jest.spyOn(component.store, "dispatch");
      const action = deleteCategory({ id: 0 });
      // Act
      component.delete();
      // Assert
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(action);
    });

    it("should call method close of dialogRef", () => {
      // Arrange
      const close = jest.spyOn(component.dialogRef, "close");
      // Act
      component.delete();
      // Assert
      expect(close).toHaveBeenCalled();
    });
  });
});
