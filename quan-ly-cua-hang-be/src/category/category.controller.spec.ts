import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { PostgresConfig } from "../services/postgres-config/postgres-config.service";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import {
  findAll,
  ResponseData,
  ResponseStatusMess
} from "../shared/types/response";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CreateCategory, UpdateCategory } from "./dto";
import { Category } from "./interface";

describe("CategoryController", () => {
  let controller: CategoryController;
  let service: CategoryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [CategoryService, SqlConnectService, PostgresConfig],
    }).compile();
    service = module.get<CategoryService>(CategoryService);
    controller = module.get<CategoryController>(CategoryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("GET /categories", () => {
    it("should get list categories follow request queries", () => {
      // Arrange
      const query = {
        search: "",
        paginator: {
          page: 1,
          limit: 5,
        },
        sort: {
          key: "name",
          sort: "asc",
        },
      };
      const expected: findAll<Category> = {
        status: "success",
        message: "Get list category successfully",
        data: [
          {
            id: 1,
            name: "cate 1",
            created_at: new Date("2022-10-11T03:24:29.161Z"),
            updated_at: new Date("2022-10-11T03:24:29.161Z"),
          },
        ],
        currentPage: 1,
        totalPage: 4,
        limit: 5,
        totalCount: 20,
      };
      jest.spyOn(service, "findAll").mockReturnValue(of(expected));

      // Act
      const obs = controller.findAll(query.search, query.paginator, query.sort);

      // Assert
      obs.subscribe((data) => {
        expect(data).toEqual(expected);
      });
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(
        query.paginator.page,
        query.paginator.limit,
        query.search,
        query.sort.key,
        query.sort.sort,
      );
    });
  });

  describe("GET /categories/:id", () => {
    it("should get one category follow id param", () => {
      // Arrange
      const param = {
        id: 1,
      };
      const expected: ResponseData<Category> = {
        status: "success",
        message: "Get category successfully",
        data: {
          id: 1,
          name: "cate 1",
          created_at: new Date("2022-10-11T03:24:29.161Z"),
          updated_at: new Date("2022-10-11T03:24:29.161Z"),
        },
      };

      jest.spyOn(service, "findOne").mockReturnValue(of(expected));
      // Act
      const obs = controller.findOne(param.id);

      // Assert
      expect(service.findOne).toHaveBeenCalledTimes(1);
      obs.subscribe((data) => {
        expect(data).toEqual(expected);
      });
      expect(service.findOne).toHaveBeenCalledWith(param.id);
    });
  });

  describe("POST /categories", () => {
    it("should create category data follow request body", () => {
      // Arrange
      const body: CreateCategory = {
        name: "cate 2",
      };
      const expected: ResponseData<Category> = {
        status: "success",
        message: "create category successfully",
        data: {
          id: 2,
          name: "cate 2",
          created_at: new Date("2022-10-11T03:24:29.161Z"),
          updated_at: new Date("2022-10-11T03:24:29.161Z"),
        },
      };
      jest.spyOn(service, "create").mockReturnValue(of(expected));

      // Act
      const obs = controller.create(body);

      // Assert
      expect(service.create).toHaveBeenCalledTimes(1);
      obs.subscribe((data) => {
        expect(data).toEqual(expected);
      });
      expect(service.create).toHaveBeenCalledWith(body.name);
    });
  });

  describe("PUT /categories/:id", () => {
    it("should update category data follow id param and body", () => {
      // Arrange
      const param = {
        id: 2,
      };
      const body: UpdateCategory = {
        name: "cate 2 new",
      };
      const expected: ResponseData<Category> = {
        status: "success",
        message: "create category successfully",
        data: {
          id: 2,
          name: "cate 2 new",
          created_at: new Date("2022-10-11T03:24:29.161Z"),
          updated_at: new Date("2022-11-11T03:24:29.161Z"),
        },
      };
      jest.spyOn(service, "update").mockReturnValue(of(expected));

      // Act
      const obs = controller.update(param.id, body);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      obs.subscribe((data) => {
        expect(data).toEqual(expected);
      });
      expect(service.update).toHaveBeenCalledWith(body.name, param.id);
    });
  });

  describe("DELETE /categorie/:id", () => {
    it("should delete category data follow id param", () => {
      // Arrange
      const param = {
        id: 2,
      };
      const expected: ResponseStatusMess = {
        status: "success",
        message: "Deleted category successfully",
      };
      jest.spyOn(service, "delete").mockReturnValue(of(expected));

      // Act
      const obs = controller.delete(param.id);

      // Assert
      expect(service.delete).toHaveBeenCalledTimes(1);
      obs.subscribe((data) => {
        expect(data).toEqual(expected);
      });
      expect(service.delete).toHaveBeenCalledWith(param.id);
    });
  });
});
