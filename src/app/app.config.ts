import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FIREBASE_OPTIONS } from 'ng-firebase-kit';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyDI3tkTie7PJSzRdYQenE6PTEV9V9S4HZA",
  authDomain: "pythonserver-eb027.firebaseapp.com",
  databaseURL: "https://pythonserver-eb027-default-rtdb.firebaseio.com",
  projectId: "pythonserver-eb027",
  storageBucket: "pythonserver-eb027.appspot.com",
  messagingSenderId: "316803893572",
  appId: "1:316803893572:web:d79176e11e35a1216cef11"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    {
      provide: FIREBASE_OPTIONS,
      useValue: {
        ...firebaseConfig
      }
    }
  ]
};
