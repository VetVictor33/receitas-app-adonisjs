import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default abstract class RecipeSchema {
  private static schema = schema.create({
    categoryName: schema.string({ trim: true}),
    title: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    ingredients: schema.string({trim: true}),
    image: schema.file({
      size: '5mb',
      extnames: ['jpg', 'png'],
    }),
  })

  public static async validate (request: HttpContextContract['request']) {
    const validation = await request.validate({
      schema: this.schema,
      messages: {
        'categoryName.required': 'Por favor, informe o campo categoryName',
        'title.required': 'Por favor, informe o campo title',
        'description.required': 'Por favor, informe o campo description',
        'ingredients.required': 'Por favor, informe o campo ingredientes, cada ingrediente deve ser separado por ,',
        'image.required': 'Por favor, forneça uma imagem',
      },
    })
    return validation
  }
}
