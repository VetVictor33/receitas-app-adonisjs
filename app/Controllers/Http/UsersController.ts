import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UserSchema from 'App/Schemas/UserSchema'

export default class UsersController {
  public async signup ({request, response} : HttpContextContract) {
    const validatedUserData = await UserSchema.validadeSignup(request)

    await User.create(validatedUserData)
    response.status(204)

    return
  }

  public async login ({request, auth} : HttpContextContract) {
    const {email, password} = await UserSchema.validadeLogin(request)
    const token = await auth.attempt(email, password, {
      expiresIn: '24 hours',
    })
    const {username} = auth.user!

    const data = {
      token: token.toJSON(),
      user: {
        username,
        email,
      },
    }

    return data
  }

  public async logout ({auth} : HttpContextContract){
    await auth.use('api').revoke()
    return {
      revoked: true,
      message: 'Logout realizado com sucesso',
    }
  }
}
