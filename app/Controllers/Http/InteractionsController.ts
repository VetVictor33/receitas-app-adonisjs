import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import InteractionsHelper from 'App/helpers/InteractionsHelper'

export default class InteractionsController {
  public async like ({request, auth} : HttpContextContract) {
    const {id: userId} = auth.user!
    const recipeId = request.param('id')

    const data = await InteractionsHelper.do('like', userId, recipeId)

    return data
  }

  public async favorite ({request, auth} : HttpContextContract) {
    const {id: userId} = auth.user!
    const recipeId = request.param('id')

    const data = await InteractionsHelper.do('favorite',userId, recipeId)

    return data
  }
}
