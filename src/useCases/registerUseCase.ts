import auth from '../middleware/auth';
import UserRepository from '../repositories/userRepo';
import bcrypt from '../services/bcrypt';
import { UserInterface } from '../utilities/interface';

const userRepository = new UserRepository();

export default class RegisterUseCase {
  registerUser = async (
    name: string,
    email: string,
    password: string,
    mobile: string,
    userImage: string
  ) => {
    try {
      const user = (await userRepository.findByEmail(email)) as UserInterface;
      if (user) {
        return { message: 'UserExist' };
      }
      const hashedPassword = await bcrypt.securePassword(password);
      const newUserData = {
        name,
        email,
        mobile,
        password: hashedPassword,
        userImage,
      };
      const response = await userRepository.saveUser(newUserData);
      if (response.message === 'UserCreated') {
        const user = (await userRepository.findByEmail(email)) as UserInterface;
        const token = await auth.createToken(user._id.toString(), '15m');
        const refreshToken = await auth.createToken(user._id.toString(), '7d');
        return {
          message: 'Success',
          name: user.name,
          token,
          _id: user._id,
          refreshToken,
          image: user.userImage,
        };
      } else {
        return { message: 'UserNotCreated' };
      }
    } catch (error) {
      return { message: (error as Error).message };
    }
  };
}
