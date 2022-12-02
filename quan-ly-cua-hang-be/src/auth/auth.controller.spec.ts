import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";
import { PostgresConfig } from "../services/postgres-config/postgres-config.service";
import { SqlConnectService } from "../services/sql-connect/sql-connect.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "./interface";

describe("AuthController", () => {
  let controller: AuthController;
  let service: AuthService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, SqlConnectService, PostgresConfig, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("POST auth/login", () => {
    it("should call service login with parameter 'user' taken from LocalAuthGuard", async () => {
      // Arrange
      const user: User = {
        id: 1,
        email: "user@email.com",
        password:
          "$2a$12$N2bmaifFFsT0khP6CqrAweiW7oiWYuMfxjqsFoLsksG1A4xdN.42O",
        profile_id: 1,
      };
      const localAuthGuardRes = {
        user: user,
      };
      const expected = {
        status: "success",
        message: "Login successful",
        access_token: "example.token",
      };
      jest.spyOn(service, "login").mockResolvedValue(expected);

      // Act
      const res = await controller.login(localAuthGuardRes);

      // Assert
      expect(service.login).toHaveBeenCalledTimes(1);
      expect(service.login).toHaveBeenCalledWith(user);
      expect(res).toEqual(expected);
    });
  });

  describe("POST auth/register", () => {
    it("should call service register with RegisterDTO parameter", () => {
      // Arrange
      const dto = {
        firstname: "3Si",
        lastname: "User",
        email: "3siuser@email.com",
        password: "1234567",
        phone: "03655555",
        address: "Huế",
      };
      const response = {
        status: "success",
        message: "register successfully",
      };
      jest.spyOn(service, "register").mockReturnValueOnce(of(response));

      // Act
      const obs = controller.register(dto);
      // Assert
      expect(service.register).toHaveBeenCalledTimes(1);
      obs.subscribe((data) => {
        expect(data).toEqual(response);
      });
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });
});
