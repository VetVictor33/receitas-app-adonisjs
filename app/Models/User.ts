import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, beforeSave, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Recipe from './Recipe'
import FavoriteRecipes from './FavoriteRecipes'

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
    foreignKey: 'user_id',
  })
  public recipes: HasMany<typeof Recipe>

  @hasMany(() => FavoriteRecipes,{
    foreignKey: 'user_id',
  })
  public favorteRecipes: HasMany<typeof FavoriteRecipes>

  @manyToMany(() => Recipe)
  public favoriteRecipes: ManyToMany<typeof Recipe>

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
