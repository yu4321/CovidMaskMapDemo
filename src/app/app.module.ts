import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpperToolbarComponent } from './upper-toolbar/upper-toolbar.component';
import { LowerToolbarComponent } from './lower-toolbar/lower-toolbar.component';
import { MapComponent } from './map/map.component';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    UpperToolbarComponent,
    LowerToolbarComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
