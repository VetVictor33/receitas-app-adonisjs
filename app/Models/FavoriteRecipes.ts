import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Recipe from './Recipe'
import User from './User'

export default class FavoriteRecipes extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public recipeId: number

  @belongsTo(()=> User, {
    foreignKey: 'userId',
  })
  public User: BelongsTo<typeof User>

  @belongsTo(()=> Recipe, {
    foreignKey: 'recipeId',
  })
  public Recipe: BelongsTo<typeof Recipe>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
