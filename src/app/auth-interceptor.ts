import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http'

export class AuthInterceptorService implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler){
        console.log('Request is on its way');
        console.log(req.url);
        //request is immutable, we need to clone
        const modifiedRequest = req.clone({
            //url: 'some-new-url'
            headers: req.headers.append('Auth', 'xyz')
        })
        //To allow to continue the request 
        return next.handle(modifiedRequest);
    }
}
