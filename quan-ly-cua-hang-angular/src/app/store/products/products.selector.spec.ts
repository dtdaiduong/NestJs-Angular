import { IListProduct } from "src/app/pages/products/products.component.i";
import {
  selectArrayProducts,
  selectListProducts,
  selectOrderLine,
  selectPaginatorProducts,
} from "./products.selector";

describe("Products", () => {
  const initialState: IListProduct = {
    status: "success",
    message: "Get list products success",
    data: [
      {
        id: 1,
        name: "Áo khoác",
        description: "Áo khoác thời trang nam",
        price: 70000,
        image: "http://localhost:8000/api/uploads/1665050108007-aokhoac.png",
        category: [
          {
            id: 1,
            name: "Áo",
            created_at: "2022-10-11T03:24:29.161Z",
            updated_at: "2022-10-11T03:24:29.161Z",
          },
        ],
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
    const result = selectListProducts.projector(initialState);
    expect(result).toBeTruthy();
  });

  it("should select the categories data of categories state", () => {
    const result = selectArrayProducts.projector(initialState);
    expect(result.length).toEqual(1);
    expect(result[0].id).toBe(initialState.data[0].id);
    expect(result[0].name).toEqual(initialState.data[0].name);
    expect(result[0].description).toEqual(initialState.data[0].description);
    expect(result[0].price).toEqual(initialState.data[0].price);
    expect(result[0].image).toEqual(initialState.data[0].image);
  });

  it("should select the paginator data of categories state", () => {
    const result = selectPaginatorProducts.projector(initialState);
    expect(result.currentPage).toEqual(initialState.currentPage);
    expect(result.totalPage).toEqual(initialState.totalPage);
  });

  it("should selectOrderLine", () => {
    const result = selectOrderLine.projector(initialState);
    expect(result).toBeTruthy();
  });
});
