import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Recipe from 'App/Models/Recipe'
import User from 'App/Models/User'
import { IformatedRecipe, IrecipeSchema } from 'App/interfaces/Recipe'
import CategoryHelper from './CategoryHelper'
import IngredientsHelper from './IngredientsHelper'
import UploadHelper from './UploadHelper'
import UserHelper from './UserHelper'
import InteractionsHelper from './InteractionsHelper'
import CommentsHelper from './CommentsHelper'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

export default abstract class RecipeHelper {
  public static async create(userId: User['id'],
    recipeData: IrecipeSchema, file: MultipartFileContract) {
    const { image, categoryName, ingredients, ...validatedRecipeData } = recipeData

    const category = await CategoryHelper.FindOrCreate(categoryName)

    const imageUrl = await UploadHelper.upload(file, 'recipes')

    const newRecipe = await Recipe.create({ ...validatedRecipeData, userId, imageUrl, categoryId: category.id })
    await IngredientsHelper.createIngredients(ingredients, newRecipe.id)

    const formatedRecipe = this.formatOne(newRecipe, userId)

    return formatedRecipe
  }

  public static async findAllRecipesAndFormat({ pageNumber, recipePerPage }:
    { pageNumber: number, recipePerPage: number }, userId: User['id'] | undefined) {
    const recipes = (await Recipe.query().orderBy('created_at', 'desc').paginate(pageNumber, recipePerPage))

    const totalPages = this.getTotalPages(recipes, recipePerPage)

    const allRecipes = await this.formatMany(recipes, userId)
    return { allRecipes, totalPages }
  }

  public static async findAllUsersRecipesAndFormat(userId: User['id'], { pageNumber, recipePerPage }:
    { pageNumber: number, recipePerPage: number }) {
    const recipes = (await Recipe.query().where('user_id', '=', userId)
      .orderBy('created_at', 'desc').paginate(pageNumber, recipePerPage))

    const totalPages = this.getTotalPages(recipes, recipePerPage)

    const allRecipes = await this.formatMany(recipes, userId)
    return { allRecipes, totalPages }
  }

  public static async findAllUsersFavoriteRecipesAndFormat(userId: User['id'], { pageNumber, recipePerPage }:
    { pageNumber: number, recipePerPage: number }) {
    await User.findByOrFail('id', userId)
    const favoriteRecipes = (await Recipe.query().whereHas('FavoriteRecipes', (recipesQuery) => {
      recipesQuery.where('userId', userId)
    }).orderBy('created_at', 'desc').paginate(pageNumber, recipePerPage))

    const totalPages = this.getTotalPages(favoriteRecipes, recipePerPage)

    const allRecipes = (await this.formatMany(favoriteRecipes, userId))!

    return { allRecipes, totalPages }
  }

  public static async findRecipeById(id: Recipe['id'], userId: User['id']): Promise<IformatedRecipe | null> {
    const recipe = await Recipe.query().where('user_id', '=', userId).where('id', '=', id)
    if (!recipe[0]) {
      return null
    }
    const formatedRecipe = this.formatOne(recipe[0], userId)
    return formatedRecipe
  }

  public static async getRecipeTitle(id: Recipe['id']): Promise<Recipe['title']> {
    const recipe = await Recipe.findByOrFail('id', id)
    return recipe.title
  }

  public static async update(recipeId: Recipe['id'], newData: IrecipeSchema, userId: User['id']) {
    const recipeArray = await Recipe.query().where('user_id', '=', userId).where('id', '=', recipeId)
    const recipe = recipeArray[0]
    if (!recipe) {
      return null
    }

    await CategoryHelper.FindOrCreate(newData.categoryName)

    await UploadHelper.delete(recipe.imageUrl)
    const newImageUrl = await UploadHelper.upload(newData.image, 'recipes')
    await IngredientsHelper.update(newData.ingredients, recipe)

    recipe.title = newData.title
    recipe.description = newData.description
    recipe.imageUrl = newImageUrl

    recipe.save()

    const formatedRecipe = await this.formatOne(recipe, userId)

    return formatedRecipe
  }

  public static async delete(recipe_id: Recipe['id'], user_id: User['id']): Promise<void> {
    const recipe = (await Recipe.query().where('user_id', '=', user_id).where('id', '=', recipe_id))
    if (!recipe[0]) {
      return
    }
    await UploadHelper.delete(recipe[0].imageUrl)
    await recipe[0].delete()
  }

  private static async formatOne(recipe: Recipe, userId: User['id'] | undefined) {
    const { id, title, description, imageUrl, createdAt, updatedAt, categoryId, userId: recipeOwnUserId } = recipe
    const ingredients = (await IngredientsHelper.getFormatedRecipeIngredients(recipe))!
    const category = (await CategoryHelper.findName(categoryId))!
    const userName = (await UserHelper.findName(recipeOwnUserId))!

    const likes = (await InteractionsHelper.count('RecipeLike', id))
    const favorites = (await InteractionsHelper.count('RecipeFavorite', id))
    const comments = (await CommentsHelper.getRecipeAllComments(id))

    if (!userId) {
      return {
        id, title, description, category, imageUrl, userName, ingredients,
        metrics: { likes, favorites, comments, liked: false, favorited: false }, createdAt, updatedAt,
      }
    }

    const liked = (await InteractionsHelper.hasUserLiked(userId, recipe.id))!
    const favorited = (await InteractionsHelper.hasUserFavorited(userId, recipe.id))!

    const formatedRecipe = {
      id, title, description, category, imageUrl, userName, ingredients,
      metrics: { likes, favorites, comments, liked, favorited }, createdAt, updatedAt,
    }
    return formatedRecipe
  }

  private static async formatMany(recipeArray: Recipe[], userId: User['id'] | undefined) {
    const allRecipes: Array<IformatedRecipe> = []

    for (const recipe of recipeArray) {
      const formatedRecipe = await this.formatOne(recipe, userId)
      allRecipes.push(formatedRecipe)
    }
    return allRecipes
  }

  private static getTotalPages(recipes: ModelPaginatorContract<Recipe>, recipePerPage: number) {
    const totalRecipes = recipes.total
    const totalPages = totalRecipes % recipePerPage > 0 ?
      Math.floor(totalRecipes / recipePerPage) + 1 : Math.floor(totalRecipes / recipePerPage)
    return totalPages
  }
}
