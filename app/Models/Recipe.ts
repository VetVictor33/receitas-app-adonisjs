import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, HasOne, belongsTo, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Ingredient from './Ingredient'
import Category from './Category'

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @belongsTo(()=> User, {
    foreignKey: 'user_id',
  })
  public User: BelongsTo<typeof User>

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public imageUrl: string

  @hasOne(() => Category)
  public category: HasOne<typeof Category>

  @hasMany(() => Ingredient)
  public ingredients: HasMany<typeof Ingredient>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
