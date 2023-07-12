import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Recipe from 'App/Models/Recipe'
import User from 'App/Models/User'
import { IformatedRecipe, IrecipeSchema } from 'App/intercafes/Recipe'
import CategoryHelper from './CategoryHelper'
import IngredientsHelper from './IngredientsHelper'
import UploadHelper from './UploadHelper'
import UserHelper from './UserHelper'

export default abstract class RecipeHelper {
  public static async create (userId: User['id'],
    recipeData: IrecipeSchema, file: MultipartFileContract) : Promise<IformatedRecipe>{
    const {image, categoryName, ingredients, ...validatedRecipeData} = recipeData

    const category = await CategoryHelper.FindOrCreate(categoryName)

    const imageUrl = await UploadHelper.upload(file, 'recipes')

    const newRecipe = await Recipe.create({...validatedRecipeData, userId, imageUrl, categoryId: category.id})
    await IngredientsHelper.createIngredients(ingredients, newRecipe.id)

    const formatedRecipe = this.formateRecipe(newRecipe)

    return formatedRecipe
  }

  public static async findAllAndFormat (): Promise<Array<IformatedRecipe>> {
    const recipes = await Recipe.all()

    const allRecipeis: Array<IformatedRecipe> = []
    for (const recipe of recipes) {
      const {id, title, description, imageUrl, createdAt, categoryId, userId, updatedAt} = recipe
      const ingredients = (await IngredientsHelper.getFormatedRecipeIngredients(recipe))!
      const category = (await CategoryHelper.findName(categoryId))!
      const userName = (await UserHelper.findName(userId))!

      const formatedRecipe = {id, title, description, category, imageUrl, userName, ingredients, createdAt, updatedAt}
      allRecipeis.push(formatedRecipe)
    }
    return allRecipeis
  }

  public static async findRecepiById (id: Recipe['id']): Promise<IformatedRecipe> {
    const recipe = await Recipe.findByOrFail('id', id)
    const formatedRecipe = this.formateRecipe(recipe)
    return formatedRecipe
  }

  public static async getRecipeTitle (id: Recipe['id']) : Promise<Recipe['title']> {
    const recipe = await Recipe.findByOrFail('id', id)
    return recipe.title
  }

  public static async update (recipe_id: Recipe['id'], newData: IrecipeSchema):Promise<void> {
    const recipe = await Recipe.findByOrFail('id', recipe_id)
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

  private static async formateRecipe (recipe: Recipe): Promise<IformatedRecipe> {
    const {id, title, description, imageUrl, createdAt, updatedAt, categoryId, userId} = recipe
    const ingredients = (await IngredientsHelper.getFormatedRecipeIngredients(recipe))!
    const category = (await CategoryHelper.findName(categoryId))!
    const userName = (await UserHelper.findName(userId))!

    const formatedRecipe = {id, title, description, category, imageUrl, userName, ingredients, createdAt, updatedAt}
    return formatedRecipe
  }
}
