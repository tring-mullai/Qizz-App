import { User } from '../../entities/User';
import { AppDataSource } from '../../db/ormconfig';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginService = async (args: any) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email: args.email } });

    if (!user) {
        throw new Error("No user found");
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
        throw new Error("Incorrect password");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret");

    return {
        token,
        user,
    };
}

