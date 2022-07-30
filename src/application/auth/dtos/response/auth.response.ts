export interface UserRequest extends Request {
  user?: SessionData
}

export class SessionData {
  id: number
  phone?: string
  username?: string
  roles: string[]
}
