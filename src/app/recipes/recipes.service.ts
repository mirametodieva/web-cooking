import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { Recipe } from '../models/recipe';
import { apiUrls } from '../utils/api-urls';
import { RecipeFilters } from '../models/recipe-filters';
import { User } from '../models/user';
import { UserInfoService } from '../services/user-info.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  categories: string[] = [
    'drinks',
    'lunch',
    'dinner',
    'brunch',
    'brunch',
    'breakfast',
    'snack',
  ];

  constructor(
    private http: HttpClient,
    private userInfoService: UserInfoService,
    private authService: AuthService
  ) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(apiUrls.RECIPES);
  }

  getFilteredRecipes(filters: RecipeFilters): Observable<Recipe[]> {
    const formattedFilters = JSON.parse(JSON.stringify(filters));
    const params = new HttpParams({
      fromObject: formattedFilters,
    });

    return this.http.get<Recipe[]>(apiUrls.RECIPES, {
      params,
    });
  }

  addRecipeToFav(recipeId: string): Observable<User> {
    return this.authService.getCurrentUser().pipe(
      switchMap((user) => {
        if (!Object.keys(user).length) {
          return of(user);
        }
        const { favoriteRecipes } = user;
        const recipeIndex = favoriteRecipes.findIndex(
          (recipe) => recipe === recipeId
        );
        let updatedFavoriteRecipes: string[] = [];

        if (recipeIndex === -1) {
          updatedFavoriteRecipes = [...favoriteRecipes, recipeId];
        } else {
          updatedFavoriteRecipes = favoriteRecipes.filter(
            (recipe) => recipe !== recipeId
          );
        }
        const updatedUser = {
          ...user,
          favoriteRecipes: updatedFavoriteRecipes,
        };
        return this.userInfoService.put(updatedUser);
      }),
      tap(({ favoriteRecipes }) => {
        localStorage.setItem(
          'favoriteRecipes',
          JSON.stringify(favoriteRecipes)
        );
      })
    );
  }

  getCategories(): string[] {
    return this.categories || [];
  }

  post(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(apiUrls.RECIPES, {
      ...recipe,
    });
  }

  getFavoriteRecipes(): Observable<Recipe[]> {
    const favoriteRecipes = this.getFavoriteRecipesFromLocalStorage();
    return this.getRecipes().pipe(
      map((recipes) => {
        return recipes.filter((recipe) => {
          return favoriteRecipes.some(
            (favRecipe) => favRecipe === recipe['_id']
          );
        });
      })
    );
  }

  isRecipeFavorite(recipeId: string): boolean {
    const favoriteRecipes = this.getFavoriteRecipesFromLocalStorage();
    if (!favoriteRecipes || !favoriteRecipes.length) {
      return false;
    }
    return favoriteRecipes.some((recipe) => recipe === recipeId);
  }

  approveRecipe(approved: boolean, id: string): Observable<Recipe> {
    return this.http.put<Recipe>(apiUrls.RECIPES + '/' + id, {
      approved,
    });
  }

  private getFavoriteRecipesFromLocalStorage(): string[] {
    try {
      return JSON.parse(localStorage.getItem('favoriteRecipes') || '');
    } catch {
      return [];
    }
  }
}
