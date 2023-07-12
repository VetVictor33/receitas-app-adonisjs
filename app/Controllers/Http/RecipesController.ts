import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Recipe from 'App/Models/Recipe'
import RecipeSchema from 'App/Schemas/RecipeSchema'
import CategoryHelper from 'App/helpers/CategoryHelper'
import IngredientsHelper from 'App/helpers/IngredientsHelper'
import UploadHelper from 'App/helpers/UploadHelper'

export default class RecipesController {
  public async index () {
    const recipes = await Recipe.all()
    return recipes
  }

  public async store ({request, auth, response} : HttpContextContract) {
    const {id: userId} = auth?.user!

    const {image, categoryName, ingredients, ...validatedRecipeData} = await RecipeSchema.validate(request)

    const category = await CategoryHelper.FindOrCreate(categoryName)

    const imageUrl = await UploadHelper.upload(request, 'image', 'recipes')

    const newRecipe = await Recipe.create({...validatedRecipeData, userId, imageUrl, categoryId: category.id})
    const newIngredients = await IngredientsHelper.createIngredients(ingredients, newRecipe.id)
    response.status(201)
    return {data: {recipe: newRecipe, ingredients: newIngredients}}
  }
}
