import Comment from 'App/Models/Comment'
import Recipe from 'App/Models/Recipe'
import User from 'App/Models/User'
import { IformatedComment } from 'App/interfaces/Comment'
import UserHelper from './UserHelper'
import RecipeHelper from './RecipeHelper'

export default abstract class CommentsHelper {
  public static async getRecipeAllComments(recipeId: Recipe['id']): Promise<IformatedComment[]> {
    const recipe = await Recipe.findByOrFail('id', recipeId)
    const comments = await recipe.related('Comments').query().where('recipe_id', '=', recipeId)
    const formatedComments = (await this.formatMany(comments))!
    return formatedComments
  }

  public static async creatComment(recipeId: Recipe['id'],
    userId: User['id'], content: string): Promise<IformatedComment> {
    await Recipe.findByOrFail('id', recipeId)
    const comment = await Comment.create({ recipeId, userId, content: content })
    const formatedComment = (await this.formatOne(comment))!
    return formatedComment
  }

  public static async deleteComment(
    recipeId: Recipe['id'], userId: User['id'], commentId: Comment['id']): Promise<void> {
    const recipe = await Recipe.findByOrFail('id', recipeId)
    const comment = await recipe.related('Comments').query()
      .where('recipe_id', '=', recipeId).andWhere('userId', '=', userId).andWhere('id', '=', commentId)
    if (comment[0]) {
      await comment[0].delete()
    }
  }

  private static async formatOne(comment: Comment): Promise<IformatedComment> {
    const username = (await UserHelper.findName(comment.userId))!
    const recipeName = (await RecipeHelper.getRecipeTitle(comment.recipeId))!
    const { id, recipeId, content, createdAt, updatedAt } = comment
    const formatedComment = { id, username, content, recipeId, recipeName, createdAt, updatedAt }
    return formatedComment
  }

  private static async formatMany(commentArray: Comment[]): Promise<IformatedComment[]> {
    const allComments: IformatedComment[] = []
    for (const comment of commentArray) {
      const formatedComment = await this.formatOne(comment)
      allComments.push(formatedComment)
    }
    return allComments
  }
}
