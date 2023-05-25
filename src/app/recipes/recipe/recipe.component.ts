import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
  @Input() recipe = {} as Recipe;
  @Input() favRecipes: Recipe[] = [];
  @Input() isLogged = false;
  @Input() isAdmin = false;

  @Output() addToFav = new EventEmitter();
  @Output() approveDeleteRecipe = new EventEmitter();

  isFav = false;

  constructor() { }

  ngOnInit(): void {
    this.isFav = this.favRecipes.some((recipe) => recipe['_id'] === this.recipe['_id']);
  }

  addToFavorites(): void{
    this.isFav = !this.isFav;
    this.addToFav.emit(this.recipe['_id']);
  }

  approveOrDeleteRecipe(approveOrDelete: boolean): void{
    this.approveDeleteRecipe.emit({approveOrDelete, id: this.recipe['_id']});
  }

}
