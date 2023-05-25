import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesFiltersComponent } from './recipes-filters.component';

describe('RecipesFiltersComponent', () => {
  let component: RecipesFiltersComponent;
  let fixture: ComponentFixture<RecipesFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipesFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
