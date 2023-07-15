import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default abstract class RecipeSchema {
  private static creationSchema = schema.create({
    categoryName: schema.string({ trim: true}),
    title: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    ingredients: schema.string({trim: true}),
    image: schema.file({
      size: '5mb',
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })

  private static paginationSchema = schema.create({
    pageNumber: schema.number([
      rules.range(1, 9999),
    ]),
    recipePerPage: schema.number([
      rules.range(5, 30),
    ]),
  })

  public static async validateCreation (request: HttpContextContract['request']) {
    const validation = await request.validate({
      schema: this.creationSchema,
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

  public static async validatePagination (request: HttpContextContract['request']) {
    const validation = await request.validate({
      schema: this.paginationSchema,
      messages: {
        'pageNumber.required': 'Por favor, informe o campo pageNumber para definir a página atual',
        'pageNumber.range': 'Por favor, escolha um numero maior do que 0',
        'pageNumber.number': 'O campo só aceita números',
        'recipePerPage.required': 'Por favor, informe o campo recipePerPage para definir quantas receitas por página',
        'recipePerPage.range': 'Por favor, escolha um numero entre 5 e 30',
        'recipePerPage.number': 'O campo só aceita números',
      },
    })
    return validation
  }
}
