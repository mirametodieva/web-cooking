export interface Recipe {
  '_id': string,
  title: string,
  image: string,
  categories: string[];
  ingredients: string[],
  approved: boolean
}
