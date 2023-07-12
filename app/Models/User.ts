import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Recipe from './Recipe'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public usarname: string

  @column()
  public password: string

  @hasMany(() => Recipe,{
    foreignKey: 'user_id',
  })
  public recipes: HasMany<typeof Recipe>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
