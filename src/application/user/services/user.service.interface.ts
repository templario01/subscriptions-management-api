import { UpdateAccountInput } from '../dtos/input/update-user.input'
import { UserWithInfoModel } from '../dtos/models/user-with-info.model'

export abstract class IUserService {
  abstract updateUserInfo(data: UpdateAccountInput): Promise<UserWithInfoModel>
  abstract getUserInfo(uuid: string): Promise<UserWithInfoModel>
}
