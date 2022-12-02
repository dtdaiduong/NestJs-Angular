import * as request from "supertest";
import { Test } from "@nestjs/testing";

import { INestApplication } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as fs from "fs";
describe("App", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    fs.writeFile(
      "uploads/test.txt",
      "Unit Test App Controller - " + Date.now().toString(),
      function (err) {
        if (err) throw err;
      },
    );
  });

  it(`/uploads/text.txt`, () => {
    return request(app.getHttpServer()).get("/uploads/test.txt").expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
