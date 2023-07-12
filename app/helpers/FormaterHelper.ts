export default abstract class FormaterHelper{
  public static lowerCase (name: string): string{
    const formatedName = name.toLowerCase().trim()
    return formatedName
  }

  public static array (string: string): Array<string>{
    const array = string.split(',')
    array.forEach((element, index) => {
      array[index] = element.trim()
    })
    return array
  }
}
