import Category from 'App/Models/Category'
import FormaterHelper from './FormaterHelper'

export default abstract class CategoryHelper{
  public static async FindOrCreate (name: string): Promise<Category> {
    const formatedName = FormaterHelper.lowerCase(name)
    const category = await Category.findBy('name', formatedName)
    if(category) {
      return category
    }
    const newCategory = await Category.create({name: formatedName})
    return newCategory
  }
}
