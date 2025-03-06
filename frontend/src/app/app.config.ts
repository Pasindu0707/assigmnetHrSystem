import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule, HttpClientModule),
    provideAnimations(),  // ✅ Required for Toastr and Angular animations
    provideToastr()        // ✅ Adds Toastr functionality
  ]
};

export const environment = {
  BASE_API_URL: 'http://localhost:3500'
};
