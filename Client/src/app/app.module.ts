import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatButtonModule,  MatToolbarModule } from '@angular/material';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { GalleryModule } from './gallery/core';
import { LightboxModule } from './gallery/lightbox';
import { routing } from './app.routing';
import { AlertComponent } from './_directives/index';
import { AuthGuard } from './_guards/index';
import { JwtInterceptor } from './_helpers/index';
import { AlertService, AuthenticationService, UserService } from './_services/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
     HomeComponent,
    LoginComponent,
    RegisterComponent

  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    GalleryModule.forRoot(),
    LightboxModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing
  ],
  providers: [AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },

    ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
