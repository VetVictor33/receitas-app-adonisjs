import Ingredient from 'App/Models/Ingredient'
import Recipe from 'App/Models/Recipe'
import FormaterHelper from './FormaterHelper'

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
}
