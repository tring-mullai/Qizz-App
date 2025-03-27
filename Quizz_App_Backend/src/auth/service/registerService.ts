import bcrypt from "bcrypt";
import { User } from '../../entities/User';
import { AppDataSource } from '../../db/ormconfig';

export const registerService = async(args: any) => {
    const userRepository = AppDataSource.getRepository(User);
    const { email, name, password } = args;
          
    const existing = await userRepository.findOne({ where: { email } });
    if (existing) {
      throw new Error("Email already exists");
    }
          
    const hashedPassword = await bcrypt.hash(password, 10);
          
    const newUser = userRepository.create({
      email,
      name,
      password: hashedPassword
    });
          
    await userRepository.save(newUser);
          
    return "Registration successful. Please log in."
      
  }

