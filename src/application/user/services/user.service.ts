import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRepository } from '../../../persistence/repositories/user.repository'
import { UpdateAccountInput } from '../dtos/input/update-user.input'
import { UserWithInfoModel } from '../dtos/models/user-with-info.model'
import { IUserService } from './user.service.interface'

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async updateUserInfo(data: UpdateAccountInput): Promise<UserWithInfoModel> {
    const user = await this.userRepository.getUserByUUID(data.uuid)
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return this.userRepository.editUserInfo(data)
  }

  async getUserInfo(uuid: string): Promise<UserWithInfoModel> {
    const user = await this.userRepository.getUserByUUID(uuid)
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return user
  }
}
