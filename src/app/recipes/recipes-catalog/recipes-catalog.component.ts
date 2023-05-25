import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, tap, filter, Subscription } from 'rxjs';
import { Recipe } from 'src/app/models/recipe';
import { RecipesService } from '../recipes.service';
import { Router } from '@angular/router';
import { RecipeFilters } from 'src/app/models/recipe-filters';
import { AuthService } from 'src/app/services/auth.service';
import { UserInfoService } from 'src/app/services/user-info.service';

@Component({
  selector: 'app-recipes-catalog',
  templateUrl: './recipes-catalog.component.html',
  styleUrls: ['./recipes-catalog.component.scss'],
})
export class RecipesCatalogComponent implements OnInit, OnDestroy {
  recipes$ = new Observable<Recipe[]>();
  favoriteRecipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  isLogged = false;
  isFavPage = false;
  isAdmin = false;
  private subscriptions = new Subscription();

  constructor(
    private recipeService: RecipesService,
    private router: Router,
    private authService: AuthService,
    private userInfoService: UserInfoService
  ) {}

  ngOnInit(): void {
    this.isFavPage = this.router.url.endsWith('favorites');
    this.subscriptions.add(
      this.authService.isLogged$.subscribe(
        (isLogged) => (this.isLogged = isLogged)
      )
    );

    this.getRecipes();
    this.getFavoriteRecipes();

    this.isAdmin = this.userInfoService.isAdmin();
  }

  addToFav(id: string): void {
    this.subscriptions.add(
      this.recipeService
        .addRecipeToFav(id)
        .subscribe(() => this.getFavoriteRecipes())
    );
  }

  approveDeleteRecipe(data: { approveOrDelete: boolean; id: string }): void {
    const { approveOrDelete, id } = data;
    this.subscriptions.add(
      this.recipeService
        .approveRecipe(approveOrDelete, id)
        .subscribe(() => this.getRecipes())
    );
  }

  filterRecipes(filters: RecipeFilters, recipes: Recipe[]): void {
    const { title, categories, ingredients } = filters;
    let clonedRecipes = [...recipes];

    if (title) {
      clonedRecipes = clonedRecipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (categories?.length) {
      clonedRecipes = clonedRecipes.filter((recipe) =>
        recipe.categories.some((category) => category === categories)
      );
    }
    if (ingredients?.length) {
      clonedRecipes = clonedRecipes.filter((recipe) =>
        recipe.ingredients.some((ingredient) => ingredient === ingredients)
      );
    }
    this.filteredRecipes = clonedRecipes;
  }

  sortRecipes(sortAbc: boolean, recipes: Recipe[]): void {
    this.filteredRecipes.sort((first, second) => {
      const biggerLetter = first.title.localeCompare(second.title);
      if (sortAbc) {
        return biggerLetter;
      } else {
        return biggerLetter * -1;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getRecipes(): void {
    this.recipes$ = this.recipeService.getFilteredRecipes({}).pipe(
      tap((recipes) => {
        if (!this.isFavPage) {
          this.filteredRecipes = recipes;
        }
      })
    );
  }

  private getFavoriteRecipes(): void {
    this.subscriptions.add(
      this.recipeService
        .getFavoriteRecipes()
        .pipe(
          filter(() => this.isLogged),
          tap((recipes) => {
            this.favoriteRecipes = recipes;
            if (this.isFavPage) {
              this.filteredRecipes = recipes;
            }
          })
        )
        .subscribe()
    );
  }
}
