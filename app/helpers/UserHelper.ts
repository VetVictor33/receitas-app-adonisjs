import User from 'App/Models/User'

export default abstract class UserHelper{
  public static async findName (id: User['id']): Promise<User['username'] | undefined> {
    const user = await User.findBy('id', id)
    return user?.username
  }
}
