import { v4 as uuidv4 } from 'uuid'
import Drive from '@ioc:Adonis/Core/Drive'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default abstract class UploadHelper{
  public static async upload (request: HttpContextContract['request'], fileName: string, directory: string):Promise<string> {
    const file = request.file(fileName)!
    const imageName = `${uuidv4()}.${file.extname}`
    await file.moveToDisk(directory, {name:imageName})
    const imageUrl = await Drive.getUrl(`/${directory}/${imageName}`)
    return imageUrl
  }
}
