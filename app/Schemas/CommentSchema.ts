import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default abstract class CommentsSchema {
  private static schema = schema.create({
    content: schema.string({ trim: true }, [
      rules.maxLength(255),
    ]),
  })

  public static async validate(request: HttpContextContract['request']) {
    const validation = await request.validate({
      schema: this.schema,
      messages: {
        'content.required': 'Por favor, informe o campo content',
        'content.maxLength': 'O conteúdo deve ter no máximo 255 caracteres',
      },
    })
    return validation
  }
}
