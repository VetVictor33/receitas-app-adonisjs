import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserSchema from 'App/Schemas/UserSchema'

export default class UsersController {
  public async signup ({request, response} : HttpContextContract) {
    const validatedUserData = await UserSchema.validadeSignup(request)

    const {id, username, email, createdAt} = await User.create(validatedUserData)

    response.status(201)
    return {data: {id, username, email, createdAt}}
  }

  public async login ({request, auth} : HttpContextContract) {
    const {email, password} = await UserSchema.validadeLogin(request)
    const token = await auth.attempt(email, password, {
      expiresIn: '24 hours',
    })

    return { data: token.toJSON()}
  }

  public async logout ({auth} : HttpContextContract){
    await auth.use('api').revoke()
    return {revoked: true}
  }
}
