import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { finalize, Observable, of } from "rxjs";
import { LoadingService } from "./loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(public loadingService: LoadingService) {}

  totalReq = 0;

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    this.totalReq++;
    this.loadingService.isLoading$ = of(true);

    return next.handle(request).pipe(
      finalize(() => {
        this.totalReq--;
        if (this.totalReq === 0) {
          this.loadingService.isLoading$ = of(false);
        }
      }),
    );
  }
}
