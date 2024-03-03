import { User } from '../types';
import { Conn } from '../db/Conn';

export const getUser = async (email: string, password: string) => {
    const query = 'SELECT * FROM `user` WHERE email = ? AND password = ? LIMIT 1';
    const [user] = await Conn.execute(query, [email, password]);
    return user[0] as User;
};

export const getUserById = async (id: number) => {
    const query = 'SELECT * FROM `user` WHERE id = ? LIMIT 1';
    const [user] = await Conn.execute(query, [id]);
    return user[0] as User;
};

export const getUserByToken = async (token: string) => {
    const query = 'SELECT * FROM `user` WHERE token = ? LIMIT 1';
    const [user] = await Conn.execute(query, [token]);
    return user[0] as User;
};

// export const createUser = async (user: User) => {
//     const { id, email, name, password, token } = user;
//     const query = 'INSERT INTO `user` (email, name, password, token) VALUE (email = ?, name = ?, password = ?, token = ?)';
//     const [userCreated] = await Conn.execute(query, [email, name, password, token, id]);
//     return userCreated;
// };

export const updateUser = async (user: User) => {
    const { id, email, name, password, token } = user;
    let query = 'UPDATE `user` SET ';

    const toUpdate: string[] = [];
    const queryParams: any[] = [];

    if (email !== undefined) {
        toUpdate.push('email = ?');
        queryParams.push(email);
    }

    if (name !== undefined) {
        toUpdate.push('name = ?');
        queryParams.push(name);
    }

    if (password !== undefined) {
        toUpdate.push('password = ?');
        queryParams.push(password);
    }

    if (token !== undefined) {
        toUpdate.push('token = ?');
        queryParams.push(token);
    }
    
    query += toUpdate.join(', ') + ' WHERE id = ?';
    queryParams.push(id);
    
    const userUpdated = await Conn.execute(query, queryParams);
    return userUpdated[0].affectedRows > 0;
};