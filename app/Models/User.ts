import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, HasMany, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import FavoriteRecipes from './FavoriteRecipes'
import Recipe from './Recipe'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public password: string

  @hasMany(() => Recipe,{
    foreignKey: 'userId',
  })
  public recipes: HasMany<typeof Recipe>

  @hasMany(() => FavoriteRecipes,{
    foreignKey: 'userId',
  })
  public favoriteRecipes: HasMany<typeof FavoriteRecipes>

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
