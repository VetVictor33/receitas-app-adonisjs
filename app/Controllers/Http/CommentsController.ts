import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CommentsSchema from 'App/Schemas/CommentSchema'
import CommentsHelper from 'App/helpers/CommentsHelper'

export default class CommentsController {
  public async store ({request, auth} : HttpContextContract) {
    const {id: userId} = auth.user!
    const {recipeId} = request.params()

    const validatedComment = await CommentsSchema.validate(request)

    const comment = await CommentsHelper.creatComment(recipeId, userId, validatedComment.content)

    return {comment}
  }

  public async destroy ({request, auth, response} : HttpContextContract) {
    const {id: userId} = auth.user!
    const {recipeId, id: commentId} = request.params()

    await CommentsHelper.deleteComment(recipeId, userId, commentId)

    response.status(204)
  }
}
