import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RecipesCatalogComponent } from './recipes/recipes-catalog/recipes-catalog.component';
import { AuthGuard } from './services/guards/auth.guard';
import { AddEditRecipeComponent } from './recipes/add-edit-recipe/add-edit-recipe.component';
import { AdminGuard } from './services/guards/admin.guard';

const routes: Routes = [
  {path: "home", component: RecipesCatalogComponent},
  {path: "add-recipe", component: AddEditRecipeComponent, canActivate: [AuthGuard]},
  {path: "favorites", component: RecipesCatalogComponent, canActivate: [AuthGuard, AdminGuard]},
  {path: "login", component: LoginComponent },

  {path: "**", redirectTo: "home", pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
