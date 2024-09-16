import RegisterUseCase from "../useCases/registerUseCase";

const registerUseCase = new RegisterUseCase()

export default class RegisterController {
    registerUser = async (
        call: { request: {name: string, email: string; mobile: string, password: string, userImage: string} },
        callback: (error: any, response: any) => void
      ) => {
        const { name, email, password, mobile, userImage } = call.request;
        try {
          const response = await registerUseCase.registerUser(name, email, password, mobile, userImage);
          callback(null, response);
        } catch (error) {
          console.error('Login failed:', error);
          callback(null, { error: (error as Error).message });
        }
      };
}