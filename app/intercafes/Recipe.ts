import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { DateTime } from 'luxon'
import { Iingredient } from './Ingredients'

export interface IrecipeSchema {
  categoryName: string,
  title: string,
  description: string,
  ingredients: string,
  image: MultipartFileContract
}

export interface InewRecipe {
  image: string,
  categoryName: string,
  ingredients: string,
  title: string,
  description: string
}

export interface IformatedRecipe {
  id: number,
  title: string,
  description: string,
  category: string,
  imageUrl: string,
  userName: string,
  ingredients: Iingredient[],
  metrics: {
    likes: any;
    favorites: any;
    comments: Array<any>
  }
  createdAt: DateTime,
  updatedAt: DateTime
}
