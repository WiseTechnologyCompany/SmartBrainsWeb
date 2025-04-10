import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from "./pages/loading/loading.component";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, LoadingComponent],
   providers: [
      {
        provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
        useValue: { appearance: 'outline', hideRequiredMarker: true },
      },
    ],
})
export class AppComponent {
  title = 'SmartBrainsWeb';
}
