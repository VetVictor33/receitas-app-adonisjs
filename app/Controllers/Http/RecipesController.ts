import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RecipeSchema from 'App/Schemas/RecipeSchema'
import RecipeHelper from 'App/helpers/RecipeHelper'

export default class RecipesController {
  ////TODO!!!! throw error when user try to mess with recipe that is not their
  public async index () {
    const recipes = await RecipeHelper.findAllAndFormat()
    return recipes
  }

  public async store ({request, auth, response} : HttpContextContract) {
    const {id: userId} = auth?.user!
    const validatedRecipeData = await RecipeSchema.validate(request)
    const file = request.file('image')!

    const newRecipe = await RecipeHelper.create(userId, validatedRecipeData, file)

    response.status(201)
    return {data: newRecipe}
  }

  public async show ({request}: HttpContextContract) {
    const recipeId = request.param('id')

    const recipe = await RecipeHelper.findRecepiById(+recipeId)

    return { data: recipe}
  }

  public async update ({request, response}:HttpContextContract) {
    const recipeId = +request.param('id')
    const validatedData = await RecipeSchema.validate(request)

    await RecipeHelper.update(recipeId, validatedData)
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
