import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Recipe from 'App/Models/Recipe'
import User from 'App/Models/User'
import { IformatedRecipe, IrecipeSchema } from 'App/intercafes/Recipe'
import CategoryHelper from './CategoryHelper'
import IngredientsHelper from './IngredientsHelper'
import UploadHelper from './UploadHelper'
import UserHelper from './UserHelper'
import InteractionsHelper from './InteractionsHelper'

export default abstract class RecipeHelper {
  public static async create (userId: User['id'],
    recipeData: IrecipeSchema, file: MultipartFileContract) : Promise<IformatedRecipe>{
    const {image, categoryName, ingredients, ...validatedRecipeData} = recipeData

    const category = await CategoryHelper.FindOrCreate(categoryName)

    const imageUrl = await UploadHelper.upload(file, 'recipes')

    const newRecipe = await Recipe.create({...validatedRecipeData, userId, imageUrl, categoryId: category.id})
    await IngredientsHelper.createIngredients(ingredients, newRecipe.id)

    const formatedRecipe = this.formatOne(newRecipe)

    return formatedRecipe
  }

  public static async findAllRecepesAndFormat (): Promise<Array<IformatedRecipe>> {
    const recipes = await Recipe.all()
    const allRecipeis = await this.formatMany(recipes)
    return allRecipeis
  }

  public static async findAllUsersRecipesAndFormat (userId: User['id']) : Promise<Array<IformatedRecipe>> {
    const recipes = await Recipe.query().where('user_id', '=', userId)
    const formatedRecipes = await this.formatMany(recipes)
    return formatedRecipes
  }

  public static async findRecipeById (id: Recipe['id'], userId: User['id']): Promise<IformatedRecipe | null> {
    const recipe = await Recipe.query().where('user_id', '=', userId).where('id', '=', id)
    if(!recipe[0]) {
      return null
    }
    const formatedRecipe = this.formatOne(recipe[0])
    return formatedRecipe
  }

  public static async getRecipeTitle (id: Recipe['id']) : Promise<Recipe['title']> {
    const recipe = await Recipe.findByOrFail('id', id)
    return recipe.title
  }

  public static async update (recipeId: Recipe['id'], newData: IrecipeSchema, userId: User['id']):Promise<void | null> {
    const recipeArray = await Recipe.query().where('user_id', '=', userId).where('id', '=', recipeId)
    const recipe = recipeArray[0]
    if(!recipe) {
      return null
    }

    await CategoryHelper.FindOrCreate(newData.categoryName)

    const newImageUrl = await UploadHelper.upload(newData.image, 'recipes')
    await IngredientsHelper.update(newData.ingredients, recipe)

    recipe.title = newData.title
    recipe.description = newData.description
    recipe.imageUrl = newImageUrl

    recipe.save()
  }
  public static async delete (recipe_id: Recipe['id'], user_id: User['id']): Promise<void> {
    const recipe = (await Recipe.query().where('user_id', '=', user_id).where('id', '=', recipe_id))
    await recipe[0].delete()
  }

  private static async formatOne (recipe: Recipe): Promise<IformatedRecipe> {
    const {id, title, description, imageUrl, createdAt, updatedAt, categoryId, userId} = recipe
    const ingredients = (await IngredientsHelper.getFormatedRecipeIngredients(recipe))!
    const category = (await CategoryHelper.findName(categoryId))!
    const userName = (await UserHelper.findName(userId))!

    const likes = (await InteractionsHelper.count('RecipeLike', id))
    const favorites = (await InteractionsHelper.count('RecipeFavorite', id))
    const comments = ['todo']

    const formatedRecipe = {id, title, description, category, imageUrl, userName, ingredients,
      metrics: {likes, favorites, comments}, createdAt, updatedAt}
    return formatedRecipe
  }

  private static async formatMany (recipeArray: Array<Recipe>): Promise<Array<IformatedRecipe>> {
    const allRecipeis: Array<IformatedRecipe> = []
    for (const recipe of recipeArray) {
      const formatedRecipe = await this.formatOne(recipe)
      allRecipeis.push(formatedRecipe)
    }
    return allRecipeis
  }
}
