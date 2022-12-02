import { IListCategory } from "src/app/pages/categories/categories.component.i";
import {
  selectArrayCategories,
  selectListCategories,
  selectPaginatorCategories,
} from "./categories.selector";

describe("Categories", () => {
  const initialState: IListCategory = {
    status: "success",
    message: "get list success",
    data: [
      {
        id: 1,
        name: "cate",
        created_at: "2022-10-11T03:24:29.161Z",
        updated_at: "2022-10-11T03:24:29.161Z",
      },
    ],
    currentPage: 1,
    totalPage: 2,
    limit: 5,
    totalCount: 10,
    search: "",
  };

  it("should select the categories state", () => {
    const result = selectListCategories.projector(initialState);
    expect(result).toBeTruthy();
  });

  it("should select the categories data of categories state", () => {
    const result = selectArrayCategories.projector(initialState);
    expect(result.length).toEqual(1);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toEqual("cate");
  });

  it("should select the paginator data of categories state", () => {
    const result = selectPaginatorCategories.projector(initialState);
    expect(result.currentPage).toEqual(1);
    expect(result.totalPage).toEqual(2);
  });
});
