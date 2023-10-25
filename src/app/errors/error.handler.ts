import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class MyErrorHandler implements ErrorHandler {
    constructor(
        private router: Router,
        private ngZone: NgZone,
    ) {}
    handleError(error: any): void {
        this.ngZone.run(() => {
            this.router.navigate([`/error/${error.message}`]);
        })
    }
}