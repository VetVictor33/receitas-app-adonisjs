import Ingredient from 'App/Models/Ingredient'
import Recipe from 'App/Models/Recipe'
import FormaterHelper from './FormaterHelper'
import { Iingredient } from 'App/intercafes/Ingredients'

export default abstract class IngredientsHelper{
  public static async createIngredients (ingredients: string, recipeId: Recipe['id']): Promise<Ingredient[]>{
    const arrayOfIngredient = FormaterHelper.array(ingredients)
    const createdIngredients : Ingredient[] = []
    for (const name of arrayOfIngredient) {
      const createdIngredient = await Ingredient.create({ name, recipeId })
      createdIngredients.push(createdIngredient)
    }
    return createdIngredients
  }

  public static async update (ingredients: string, recipe: Recipe): Promise<void>{
    await this.delete(recipe)
    await this.createIngredients(ingredients, recipe.id)
  }

  public static async delete (recipe: Recipe): Promise<void>{
    const recipeIngredients = await recipe.related('Ingredients').query().where('recipe_id', '=', recipe.id)
    recipeIngredients.forEach(async ingredient => await ingredient.delete())
  }

  public static async getFormatedRecipeIngredients (recipe: Recipe): Promise<Iingredient[]> {
    const ingredients = await recipe.related('Ingredients').query().where('recipe_id', '=', recipe.id)
    const allIngredientsFormated: Array<Iingredient> = []

    for (const ingredient of ingredients) {
      const {id, name} = ingredient
      const recipeName = recipe.title
      const formatedIngrediente = {id, name, recipeName}
      allIngredientsFormated.push(formatedIngrediente)
    }
    return allIngredientsFormated
  }
}
