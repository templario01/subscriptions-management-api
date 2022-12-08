import * as bcrypt from 'bcrypt'

export async function encryptPassword(pass: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(pass, salt)
}
