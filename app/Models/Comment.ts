import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Recipe from './Recipe'
import User from './User'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public content: string

  @column()
  public userId: number

  @column()
  public recipeId: number

  @belongsTo(()=> User, {
    foreignKey: 'userId',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(()=> Recipe, {
    foreignKey: 'recipeId',
  })
  public recipe: BelongsTo<typeof Recipe>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
