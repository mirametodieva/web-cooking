import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RecipesCatalogComponent } from './recipes/recipes-catalog/recipes-catalog.component';
import { RecipeComponent } from './recipes/recipe/recipe.component';
import { AddEditRecipeComponent } from './recipes/add-edit-recipe/add-edit-recipe.component';
import { HeaderComponent } from './components/header/header.component';
import { RecipesFiltersComponent } from './components/recipes-filters/recipes-filters.component';
import { MaterialModule } from './services/material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorInterceptor } from './services/error.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecipesCatalogComponent,
    RecipeComponent,
    AddEditRecipeComponent,
    HeaderComponent,
    RecipesFiltersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
