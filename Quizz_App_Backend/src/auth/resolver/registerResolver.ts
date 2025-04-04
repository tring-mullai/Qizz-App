
import { loginService } from "../service/loginService";
import { registerService } from "../service/registerService";

export const registerResolver = 
{
    Mutation: {
                register: async (_query:any, args:any) => {
                    return registerService(args);
                  },
    
                login: async (_query:any, args:any) => {
                    return loginService(args);
                },
            },
}