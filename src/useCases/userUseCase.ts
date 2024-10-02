import UserRepository from '../repositories/userRepo';
import bcrypt from '../services/bcrypt';
import { UpdateUserRequest, UserInterface } from '../utilities/interface';
import { comparePassword } from '../utilities/passwordCompare';

const userRepository = new UserRepository();

export default class UserUseCase {
  getUser = async (id: string) => {
    try {
      const user = await userRepository.findById(id);
      if (user) {
        return { message: 'success', ...user };
      } else {
        return { message: 'No User Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  updateUser = async (id: string, updates: Partial<UpdateUserRequest>) => {
    try {
      const user = (await userRepository.findById(id)) as UserInterface;
      if (user) {
        const response = await userRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'UserUpdated') {
          return { message: 'success' };
        } else {
          return { message: 'User Not Updated' };
        }
      }
      return { message: 'User does not exist' };
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  changePassword = async (
    id: string,
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        return { message: 'No User Found' };
      }
      const isMatch = await comparePassword(currentPassword, user.password)
      if (!isMatch) {
        return { message: 'Entered current password is invalid' };
      }
      const hashedPass = await bcrypt.securePassword(newPassword)
      const updates = {password: hashedPass}
      const response = await userRepository.findByIdAndUpdate(id, updates);
        if (response.message === 'UserUpdated') {
          console.log('Password changed successfully')
          return { message: 'success' };
        } else {
          return { message: 'User Not Updated' };
        }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  isBlocked = async (id: string) => {
    try {
      const user = await userRepository.find(id);
      if (user?.accountStatus === 'Blocked') {
        return { message: 'Blocked'};
      } else if(user?.accountStatus === 'UnBlocked'){
        return { message: 'UnBlocked' };
      } else {
        return { message: 'No User Found' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  }; 
}
