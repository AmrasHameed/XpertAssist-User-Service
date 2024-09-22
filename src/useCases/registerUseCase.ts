import auth from '../middleware/auth';
import UserRepository from '../repositories/userRepo';
import bcrypt from '../services/bcrypt';
import { getOtpByEmail } from '../services/redisClient';
import { UserInterface } from '../utilities/interface';
import { sendOtp } from '../utilities/sendOtp';

const userRepository = new UserRepository();

export default class RegisterUseCase {
  signupOtp = async (name: string, email: string) => {
    try {
      const user = (await userRepository.findByEmail(email)) as UserInterface;
      if (user) {
        return { message: 'UserExist' };
      }
      const response = await sendOtp({email, name}) 
      return {message: response}
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  resendOtp = async (name: string, email: string) => {
    try {
      const response = await sendOtp({email, name}) 
      return {message: response}
    } catch (error) {
      return { message: (error as Error).message };
    }
  };

  registerUser = async (
    name: string,
    email: string,
    password: string,
    mobile: string,
    userImage: string,
    otp: string
  ) => {
    try {
      const storedOtp = await getOtpByEmail(email)
      if(storedOtp === null || storedOtp.toString() !== otp.toString()) {
        console.log("OTP does not match or is not found.")
        return {message: 'OTP does not match or is not found.'}
      }
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

