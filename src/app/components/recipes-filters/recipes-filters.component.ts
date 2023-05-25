import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { RecipeFilters } from 'src/app/models/recipe-filters';
import { FormBuilder } from '@angular/forms';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipes-filters',
  templateUrl: './recipes-filters.component.html',
  styleUrls: ['./recipes-filters.component.scss']
})
export class RecipesFiltersComponent implements OnInit, OnDestroy {
  @Input() recipes: Recipe[] = [];
  @Output() filter = new EventEmitter<RecipeFilters>();
  @Output() sortAbc = new EventEmitter<boolean>();

  filtersForm = this.fb.group({
    title: '',
    categories: '',
    ingredients: ''
  });
  ingredientsOptions: string[] = [];
  categoriesOptions: string[] = [];
  isSortAbc = false;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.saveFiltersInLocalStorage();
    this.checkLocalStorage();
    this.initIngredientsOptions();
    this.initCategoriesOptions();
  }

  submitForm(): void{
    this.filter.emit(this.filtersForm.getRawValue());
    this.saveFiltersInLocalStorage();
  }

  sort(): void{
    this.isSortAbc = !this.isSortAbc;
    this.sortAbc.emit(this.isSortAbc);
  }

  resetFilters(): void{
    this.filtersForm.reset();
    this.submitForm();
  }

  ngOnDestroy(): void {
    this.saveFiltersInLocalStorage();
  }

  private initIngredientsOptions(): void{
    const allIngredients = new Set<string>();

    this.recipes.forEach(({ingredients}) =>
      ingredients.forEach(ingredient => allIngredients.add(ingredient))
    );

    this.ingredientsOptions = Array.from(allIngredients);
  }

  private initCategoriesOptions(): void{
    const allCategories = new Set<string>();

    this.recipes.forEach(({categories}) =>
    categories.forEach(category => allCategories.add(category))
    );

    this.categoriesOptions = Array.from(allCategories);
  }

  private checkLocalStorage(): void{
    const localStorageValue = localStorage.getItem('filters') || '';
    const savedFilters = JSON.parse(localStorageValue || '') || {} as RecipeFilters;
    this.filter.emit(savedFilters);
  }

  private saveFiltersInLocalStorage(): void{
    const filters = this.filtersForm.getRawValue();
    if(filters){
      localStorage.setItem('filters', JSON.stringify(filters));
    }
  }

}
