import { updateUser } from "../model/userModel";
import { User } from "../types";
const jwt = require('jsonwebtoken');

export const generateToken = async (user: User) => {
    const payload = {
        id: user.id,
        email: user.email,
        password: user.password,
    };

    const options = {
        expiresIn: '1d', 
        algorithm: 'HS256', 
    };

    user.token = jwt.sign(payload, process.env.SECRET_KEY, options) as string;
    await updateUser(user);

    return user;
};