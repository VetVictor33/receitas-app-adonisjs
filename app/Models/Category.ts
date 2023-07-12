import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Recipe from './Recipe'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name:string

  @hasMany(() => Recipe)
  public recipes: HasMany<typeof Recipe>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
