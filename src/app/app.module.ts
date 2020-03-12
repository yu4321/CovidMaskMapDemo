import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UpperToolbarComponent } from './upper-toolbar/upper-toolbar.component';
import { LowerToolbarComponent } from './lower-toolbar/lower-toolbar.component';
import { MapComponent } from './map/map.component';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatSliderModule} from '@angular/material/slider'
import { AppScrollableDirective } from './app-scrollable.directive';
import { AppOffsetTopDirective } from './app-offset-top.directive';

@NgModule({
  declarations: [
    AppComponent,
    UpperToolbarComponent,
    LowerToolbarComponent,
    MapComponent,
    AppScrollableDirective,
    AppOffsetTopDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
