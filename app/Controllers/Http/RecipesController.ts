import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecipeSchema from 'App/Schemas/RecipeSchema'
import RecipeHelper from 'App/helpers/RecipeHelper'

export default class RecipesController {
  public async index () {
    const recipes = await RecipeHelper.findAllRecepesAndFormat({pageNumber: 1, recipePerPage: 100})
    return recipes
  }

  public async paginatedIndex ({request} : HttpContextContract) {
    const validatedPagination = await RecipeSchema.validatePagination(request)
    const recipes = await RecipeHelper.findAllRecepesAndFormat(validatedPagination)
    return recipes
  }

  public async store ({request, auth, response} : HttpContextContract) {
    const {id: userId} = auth.user!
    const validatedRecipeData = await RecipeSchema.validateCreation(request)
    const file = request.file('image')!

    const newRecipe = await RecipeHelper.create(userId, validatedRecipeData, file)

    response.status(201)
    return {data: newRecipe}
  }

  public async show ({request, auth}: HttpContextContract) {
    const {id: userId} = auth.user!
    const recipeId = +request.param('id')

    const recipe = await RecipeHelper.findRecipeById(recipeId, userId)

    return { data: recipe}
  }

  public async showUsersOnly ({auth}: HttpContextContract){
    const {id: userId} = auth.user!

    const allRecipes = await RecipeHelper.findAllUsersRecipesAndFormat(userId)

    return { data: allRecipes}
  }

  public async showUsersFavoriteRecipes ({auth}: HttpContextContract){
    const {id: userId} = auth.user!

    const favoriteRecipes = await RecipeHelper.findAllUsersFavoriteRecipesAndFormat(userId)

    return { data: favoriteRecipes}
  }

  public async update ({request, auth, response}:HttpContextContract) {
    const {id: userId} = auth.user!
    const recipeId = +request.param('id')
    const validatedData = await RecipeSchema.validateCreation(request)

    await RecipeHelper.update(recipeId, validatedData, userId)
    response.status(204)

    return
  }

  public async destroy ({request, auth, response}:HttpContextContract) {
    const {id: userId} = auth.user!
    const recipeId = +request.param('id')
    await RecipeHelper.delete(recipeId, userId)
    response.status(204)
    return
  }
}
