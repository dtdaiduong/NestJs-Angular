import { Test, TestingModule } from "@nestjs/testing";
import { lastValueFrom, of } from "rxjs";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
class mockProductService {
  findAll = jest.fn();
  findOne = jest.fn();
  create = jest.fn();
  update = jest.fn();
  delete = jest.fn();
}
describe("ProductController", () => {
  let controller: ProductController;
  let service: ProductService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useClass: mockProductService }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
  describe("findAll", () => {
    it("should find all product when fundAll func is run", () => {
      const expected = {
        status: "string",
        message: "string",
        data: [],
        currentPage: 5,
        limit: 5,
        totalCount: 5,
      };
      const sort = { column: "firstname", options: "asc" };
      jest.spyOn(service, "findAll").mockReturnValue(of(expected));
      return lastValueFrom(
        controller.findAll("", "", { page: 1, limit: 4 }, sort),
      ).then((data) => {
        expect(data).toEqual(expected);
      });
    });
  });
  describe("findOne", () => {
    it("should find one product when findOne func is run", () => {
      const expected = {
        status: "string",
        message: "string",
        data: {
          id: 1,
          name: "string",
          description: "string",
          price: 1,
          image: "string",
          category: [],
        },
      };
      jest.spyOn(service, "findOne").mockReturnValue(of(expected));
      return lastValueFrom(controller.findOne(5)).then((data) => {
        expect(data).toEqual(expected);
      });
    });
  });
  describe("create", () => {
    it("should create product when findOne func is run", () => {
      const expected = {
        status: "string",
        message: "string",
        data: {
          id: 1,
          name: "string",
          description: "string",
          price: 1,
          image: "string",
          category: [],
        },
      };
      jest.spyOn(service, "create").mockReturnValue(of(expected));
      return lastValueFrom(
        controller.create(
          {
            name: "string",
            description: "string",
            price: 5,
            category: "string",
          },
          "asd",
        ),
      ).then((data) => {
        expect(data).toEqual(expected);
      });
    });
  });
  describe("update", () => {
    it("should update product when file is exist", () => {
      const file = {
        path: "ss",
      };
      const expected = {
        status: "success",
        message: "da zo",
      };
      jest.spyOn(service, "update").mockReturnValue(of(expected));
      return lastValueFrom(
        controller.update(
          1,
          {
            name: "string",
            description: "string",
            price: 5,
            category: "string",
          },
          file,
        ),
      ).then((data) => {
        expect(data).toEqual(expected);
      });
    });
    it("should update product when file is not exist", () => {
      const expected = {
        status: "success",
        message: "da zo",
      };
      jest.spyOn(service, "update").mockReturnValue(of(expected));
      return lastValueFrom(
        controller.update(
          1,
          {
            name: "string",
            description: "string",
            price: 5,
            category: "string",
          },
          null,
        ),
      ).then((data) => {
        expect(data).toEqual(expected);
      });
    });
  });
  describe("delete", () => {
    it("should delete product when findOne func is run", () => {
      const expected = {
        status: "success",
        message: "string",
      };
      jest.spyOn(service, "delete").mockReturnValue(of(expected));
      return lastValueFrom(controller.delete(1)).then((data) => {
        expect(data).toEqual(expected);
      });
    });
  });
});
