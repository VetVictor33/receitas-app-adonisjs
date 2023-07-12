import { BaseModel, BelongsTo, HasMany, HasOne, belongsTo, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Category from './Category'
import Ingredient from './Ingredient'
import User from './User'
import Comment from './Comment'

export default class Recipe extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public imageUrl: string

  @column()
  public user_id: number

  @belongsTo(()=> User, {
    foreignKey: 'user_id',
  })
  public User: BelongsTo<typeof User>

  @hasOne(() => Category)
  public category: HasOne<typeof Category>

  @hasMany(() => Ingredient)
  public ingredients: HasMany<typeof Ingredient>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
