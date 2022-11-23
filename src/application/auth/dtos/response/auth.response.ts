export interface UserRequest extends Request {
  user?: SessionData
}

export class SessionData {
  id: number
  phone?: string
  username?: string
  avatar?: string
  roles: string[]
}

export interface TokenResponse {
  token: string
}
