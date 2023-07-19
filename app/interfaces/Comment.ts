import { DateTime } from 'luxon'

export interface Icomment {
  content : string
}

export interface IformatedComment {
  id: number,
  username: string,
  content: string,
  createdAt: DateTime,
  updatedAt: DateTime
}
