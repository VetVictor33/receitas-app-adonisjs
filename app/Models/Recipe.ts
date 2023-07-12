import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Category from './Category'
import Comment from './Comment'
import Ingredient from './Ingredient'
import User from './User'

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
  public userId: number

  @column()
  public categoryId: number

  @belongsTo(()=> User, {
    foreignKey: 'userId',
  })
  public User: BelongsTo<typeof User>

  @belongsTo(()=> Category, {
    foreignKey: 'categoryId',
  })
  public Category: BelongsTo<typeof Category>

  @hasMany(() => Ingredient)
  public Ingredients: HasMany<typeof Ingredient>

  @hasMany(() => Comment)
  public Comments: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
