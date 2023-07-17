import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecipeSchema from 'App/Schemas/RecipeSchema'
import RecipeHelper from 'App/helpers/RecipeHelper'

export default class RecipesController {
  public async index({ auth }) {
    const { id: userId } = auth.user!
    const recipes = await RecipeHelper.findAllRecipesAndFormat({ pageNumber: 1, recipePerPage: 100 }, userId)
    return recipes
  }

  public async paginatedIndex({ request, auth }: HttpContextContract) {
    const { id: userId } = auth.user!
    const validatedPagination = await RecipeSchema.validatePagination(request)
    const recipes = await RecipeHelper.findAllRecipesAndFormat(validatedPagination, userId)
    return recipes
  }

  public async store({ request, auth, response }: HttpContextContract) {
    await auth.use('api').check()
    const { id: userId } = auth.user!
    const validatedRecipeData = await RecipeSchema.validateCreation(request)
    const file = request.file('image')!

    const newRecipe = await RecipeHelper.create(userId, validatedRecipeData, file)

    response.status(201)
    return newRecipe
  }

  public async show({ request, auth }: HttpContextContract) {
    const { id: userId } = auth.user!
    const recipeId = +request.param('id')

    const recipe = await RecipeHelper.findRecipeById(recipeId, userId)

    return recipe
  }

  public async showUsersOnly({ request, auth }: HttpContextContract) {
    const { id: userId } = auth.user!

    const validatedPagination = await RecipeSchema.validatePagination(request)
    const allRecipes = await RecipeHelper.findAllUsersRecipesAndFormat(userId, validatedPagination)

    return allRecipes
  }

  public async showUsersFavoriteRecipes({ request, auth }: HttpContextContract) {
    const { id: userId } = auth.user!

    const validatedPagination = await RecipeSchema.validatePagination(request)
    const allRecipes = await RecipeHelper.findAllUsersFavoriteRecipesAndFormat(userId, validatedPagination)

    return allRecipes
  }

  public async update({ request, auth }: HttpContextContract) {
    const { id: userId } = auth.user!
    const recipeId = +request.param('id')
    const validatedData = await RecipeSchema.validateCreation(request)

    const newRecipe = await RecipeHelper.update(recipeId, validatedData, userId)

    return newRecipe
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const { id: userId } = auth.user!
    const recipeId = +request.param('id')
    await RecipeHelper.delete(recipeId, userId)
    response.status(204)
    return
  }
}
