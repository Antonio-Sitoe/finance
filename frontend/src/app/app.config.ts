import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { appIconsConfig } from "./app.icons.config";
import { provideHttpClient } from "@angular/common/http";
import { registerLocaleData } from "@angular/common";
import localePt from "@angular/common/locales/pt";

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    ...appIconsConfig,
  ],
};
