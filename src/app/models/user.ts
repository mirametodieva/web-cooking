export interface User {
  '_id': string,
  email: string,
  password: string,
  repeatedPassword?: string,
  isAdmin: string,
  avatar: string,
  favoriteRecipes: string[],
  cookedRecipes: string[],
}
