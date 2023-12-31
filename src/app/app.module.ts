import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor';
import { LoggingInterceptorService } from './logging-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [
    {provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      //Aquest paràmetre multi permet afegir més interceptors sense sobreescriure el que ja es fa servir
      multi: true},
    {provide: HTTP_INTERCEPTORS, 
      useClass: LoggingInterceptorService, 
      multi: true
    },
    ],
  bootstrap: [AppComponent]
})
export class AppModule {}
