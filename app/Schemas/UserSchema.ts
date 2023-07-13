import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default abstract class UserSchema {
  private static SignupSchema = schema.create({
    username: schema.string({ trim: true }, [
      rules.alphaNum({
        allow: [ 'underscore', 'dash'],
      }),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
    ]),
    password: schema.string({ trim: true }, [
      rules.minLength(6),
    ]),
  })
  private static LoginSchema = schema.create({
    email: schema.string({ trim: true }, [
      rules.email(),
    ]),
    password: schema.string({ trim: true }, [
      rules.minLength(6),
    ]),
  })

  public static async validadeSignup (request: HttpContextContract['request']) {
    const validation = await request.validate({
      schema: this.SignupSchema,
      messages: {
        'username.required': 'Por favor, informe o campo username',
        'username.alphaNum': 'Por favor, utilize apenas letras, números, underscore e travessão',
        'email.required': 'Por favor, informe o campo email',
        'email.email': 'Por favor, informe um email com formato válido',
        'password.required': 'Por favor, informe o campo password',
        'password.minLength': 'Por favor, informe uma senha com no mínimo 6 caracteres',
      },
    })
    return validation
  }
  public static async validadeLogin (request: HttpContextContract['request']) {
    const validation = await request.validate({
      schema: this.LoginSchema,
      messages: {
        'email.required': 'Por favor, informe o campo email',
        'email.email': 'Por favor, informe o campo email válido',
        'password.required': 'Por favor, informe o campo password',
      },
    })
    return validation
  }
}
