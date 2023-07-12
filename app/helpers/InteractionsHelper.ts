import Recipe from 'App/Models/Recipe'
import FavoriteRecipes from 'App/Models/FavoriteRecipes'
import RecipeLike from 'App/Models/RecipeLike'
import User from 'App/Models/User'

type Interactions = 'like' | 'unlike' | 'favorite' | 'unfavorite'

type ModelType = 'RecipeLike' | 'RecipeFavorite'

export default abstract class InteractionsHelper{
  public static async do (interaction: Interactions,
    userId: User['id'], recipeId: Recipe['id']): Promise<any> {
    await User.findByOrFail('id', userId)
    await Recipe.findByOrFail('id', recipeId)

    let response
    switch (interaction) {
      case 'like':
        await RecipeLike.firstOrCreate({userId, recipeId})
        return response = this.count('RecipeLike', recipeId)

      case 'unlike':
        const like = await RecipeLike.query().where('user_id', '=', userId).where('recipe_id', '=', recipeId)
        if(like[0]) {
          await like[0].delete()
        }
        return response = this.count('RecipeLike', recipeId)

      case 'favorite':
        await FavoriteRecipes.firstOrCreate({userId, recipeId})
        return response = this.count('RecipeFavorite', recipeId)

      case 'unfavorite':
        const favorite = await FavoriteRecipes.query().where('user_id', '=', userId).where('recipe_id', '=', recipeId)
        if(favorite[0]) {
          await favorite[0].delete()
        }
        return response = this.count('RecipeFavorite', recipeId)
      default:
        break
    }
    return response
  }

  public static async count (model: ModelType, recipeId: Recipe['id']): Promise<any> {
    switch (model) {
      case 'RecipeLike':
        const likeAmout = await RecipeLike.query()
          .where('recipe_id', '=', recipeId).count('* as total likes').returning('total')
        return likeAmout[0].$extras

      case 'RecipeFavorite':
        const favoriteAmout = await FavoriteRecipes.query()
          .where('recipe_id', '=', recipeId).count('* as total favorites').returning('total')
        return favoriteAmout[0].$extras

      default:
        break
    }
  }
}
