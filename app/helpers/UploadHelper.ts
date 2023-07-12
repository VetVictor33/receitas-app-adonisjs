import { v4 as uuidv4 } from 'uuid'
import Drive from '@ioc:Adonis/Core/Drive'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

export default abstract class UploadHelper{
  public static async upload (file: MultipartFileContract, directory: string):Promise<string> {
    const imageName = `${uuidv4()}.${file.extname}`
    await file.moveToDisk(directory, {name:imageName})
    const imageUrl = await Drive.getUrl(`/${directory}/${imageName}`)
    return imageUrl
  }
}
