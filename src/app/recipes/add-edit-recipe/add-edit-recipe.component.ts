import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RecipesService } from '../recipes.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-recipe',
  templateUrl: './add-edit-recipe.component.html',
  styleUrls: ['./add-edit-recipe.component.scss'],
})
export class AddEditRecipeComponent implements OnInit, OnDestroy {
  recipeForm = this.fb.group({
    title: ['', Validators.required],
    image: ['', Validators.required],
    categories: ['', Validators.required],
    ingredients: ['', Validators.required],
  });
  categories: string[] = [];
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private recipesService: RecipesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categories = this.recipesService.getCategories();
  }

  addRecipe(): void {
    this.recipeForm.markAllAsTouched();

    if (this.recipeForm.invalid) {
      return;
    }
    const recipe = this.recipeForm.getRawValue();
    const clonedIngredients = recipe.ingredients
      .split(',')
      .map((ingredient: string) => ingredient.trim());

    const formattedRecipe = {
      ...recipe,
      ingredients: clonedIngredients,
      approved: false,
    };
    this.subscription = this.recipesService.post(formattedRecipe).subscribe(() => this.router.navigate(['home']));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
