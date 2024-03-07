import { User } from '../types';
import { Conn } from '../db/Conn';
import { generateToken } from '../helper/userHelper';

export const getUser = async (email: string, password: string) => {
    const newPassword = '(*)INSTA' + password + 'INSTA(*)';
    const query = 
        'SELECT u.*, p.`name` FROM `user` u ' +
        'INNER JOIN `person` p ON p.`id` = u.`personId` ' +
        'WHERE u.`email` = ? AND u.`password` = SHA1(?) LIMIT 1';
    const [user] = await Conn.execute(query, [email, newPassword]);
    const userWithToken = await generateToken(user[0]);
    return userWithToken as User;
};

export const getUserById = async (id: number) => {
    const query = 
        'SELECT u.*, p.`name` FROM `user` u ' +
        'INNER JOIN `person` p ON p.`id` = u.`personId` ' +
        'WHERE u.`id` = ? LIMIT 1';
    const [user] = await Conn.execute(query, [id]);
    return user[0] as User;
};

export const getUserByToken = async (token: string) => {
    const query = 
        'SELECT u.*, p.`name` FROM `user` u ' + 
        'INNER JOIN `person` p ON p.`id` = u.`personId` ' +
        'WHERE u.`token` = ? LIMIT 1';
    const [user] = await Conn.execute(query, [token]);
    return user[0] as User;
};

export const getFollowSuggestions = async (userId: number) => {
    const query = 
        'SELECT unotf.*, p.`name` FROM `follow` f ' +
        'INNER JOIN `user` u ON u.`id` = f.`idUserFollowed` ' + 
        'INNER JOIN `follow` notf ON notf.`idUser` = u.`id` ' +
        'INNER JOIN `user` unotf ON unotf.`id` = notf.`idUserFollowed` ' +
        'INNER JOIN `person` p ON p.`id` = unotf.`personId` ' + 
        'WHERE f.idUser = ? ' +
        'GROUP BY unotf.id ' +
        'ORDER BY COUNT(*) DESC ' +
        'LIMIT 10 ';
    const [user] = await Conn.execute(query, [userId]);
    return user as User[];
};

// export const createUser = async (user: User) => {
//     const { id, email, name, password, token } = user;
//     const query = 'INSERT INTO `user` (email, name, password, token) VALUE (email = ?, name = ?, password = ?, token = ?)';
//     const [userCreated] = await Conn.execute(query, [email, name, password, token, id]);
//     return userCreated;
// };

export const updateUser = async (user: User) => {
    const conn = await Conn.getConnection();
    let userUpdated;
    try {
        const { id, personId, email, name, password, token } = user;
        let queryUser = 'UPDATE `user` SET ';
        let queryPerson = 'UPDATE `person` SET ';

        const toUserUpdate: string[] = [];
        const toPersonUpdate: string[] = [];
        const queryUserParams: any[] = [];
        const queryPersonParams: any[] = [];

        if (email !== undefined) {
            toUserUpdate.push('email = ?');
            queryUserParams.push(email);
        }

        if (email !== undefined) {
            toUserUpdate.push('username = ?');
            queryUserParams.push(email);
        }

        if (name !== undefined) {
            toPersonUpdate.push('name = ?');
            queryPersonParams.push(name);
        }

        if (password !== undefined) {
            toUserUpdate.push('password = ?');
            queryUserParams.push(password);
        }

        if (token !== undefined) {
            toUserUpdate.push('token = ?');
            queryUserParams.push(token);
        }
        
        queryUser += toUserUpdate.join(', ') + ' WHERE id = ?';
        queryUserParams.push(id);

        queryPerson += toPersonUpdate.join(', ') + ' WHERE id = ?';
        queryPersonParams.push(personId);

        await conn.beginTransaction();
        await Conn.execute(queryPerson, queryPersonParams);
        userUpdated = await Conn.execute(queryUser, queryUserParams);
        await conn.commit();
    } catch (error) {
        await conn.rollback();
        console.error('Erro ao atualizar `user` ou `person`: ', error);
    } finally {
        conn.release();
        return userUpdated[0].affectedRows > 0;
    }
};