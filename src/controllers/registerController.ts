import RegisterUseCase from '../useCases/registerUseCase';

const registerUseCase = new RegisterUseCase();

export default class RegisterController {
  signupOtp = async (
    call: { request: { name: string; email: string } },
    callback: (error: any, response: any) => void
  ) => {
    const { name, email } = call.request;
    try {
      const response = await registerUseCase.signupOtp(name, email);
      callback(null, response);
    } catch (error) {
      console.error('Otp sending failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  resendOtp = async (
    call: { request: { name: string; email: string } },
    callback: (error: any, response: any) => void
  ) => {
    const { name, email } = call.request;
    try {
      const response = await registerUseCase.resendOtp(name, email);
      callback(null, response);
    } catch (error) {
      console.error('Otp sending failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };

  registerUser = async (
    call: {
      request: {
        name: string;
        email: string;
        mobile: string;
        password: string;
        userImage: string;
        otp: string;
      };
    },
    callback: (error: any, response: any) => void
  ) => {
    const { name, email, password, mobile, userImage, otp } = call.request;
    try {
      const response = await registerUseCase.registerUser(
        name,
        email,
        password,
        mobile,
        userImage,
        otp
      );
      callback(null, response);
    } catch (error) {
      console.error('Signup failed:', error);
      callback(null, { error: (error as Error).message });
    }
  };
}
