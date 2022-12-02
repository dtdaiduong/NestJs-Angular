import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { CategoriesService } from "../../pages/categories/categories.service";

import { LoadingInterceptor } from "./loading.interceptor";

describe("LoadingInterceptor", () => {
  let httpmock: HttpTestingController;
  let service: CategoriesService;
  let interceptor: LoadingInterceptor;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoadingInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoadingInterceptor,
          multi: true,
        },
      ],
    });
    httpmock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CategoriesService);
  });

  it("should be created", () => {
    interceptor = TestBed.inject(LoadingInterceptor);
    expect(interceptor).toBeTruthy();
  });

  describe("intercept", () => {
    it("should be call when handle any http request", () => {
      // Arrange
      service.getOneCategory(1).subscribe((data) => {
        expect(data).toBeTruthy();
      });
      const httpreq = httpmock.expectOne(
        "http://localhost:8000/api/categories/1",
      );
      httpreq.flush("example value");

      httpmock.verify();
    });
  });
});
