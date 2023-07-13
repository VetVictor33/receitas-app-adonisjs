/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor () {
    super(Logger)
  }

  public async handle (error: any, ctx: HttpContextContract) {
    switch (error.code) {
      case 'E_VALIDATION_FAILURE':
      case 'E_UNAUTHORIZED_ACCESS':
      case 'E_ROUTE_NOT_FOUND':
        return super.handle(error, ctx)

      case 'E_INVALID_AUTH_PASSWORD':
      case 'E_INVALID_AUTH_UID':
        return ctx.response.status(400).send({message: 'Credenciais inválidas'})

      case 'E_ROW_NOT_FOUND':
        return ctx.response.status(422).send({message: 'Recurso não encontrado'})

      case '23505':
        return ctx.response.status(400).send({message: 'Credienciais já cadastradas'})

      default:
        return ctx.response.status(500).send({message: 'Internal server error'})
    }
  }
}
