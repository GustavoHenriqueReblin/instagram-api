import { getFollowSuggestions, getUser, getUserById, getUserByToken, updateUser } from '../../model/userModel';
import { defaultUserValues, User } from '../../types';
const jwt = require('jsonwebtoken');

const userResolver = {
    Query: {
        user: async (_: any, { input }: any) => {
            const { email, password } = input;
            const user = await getUser(email, password);
            const error = user ? '' : 'Usuário não encontrado!';
            return {
                data: user ? [user] : [],
                message: '',
                error,
            }
        },

        getUserByToken: async (_: any, { input }: any) => {
            const { token } = input;
            if (token) {
                try {
                    const tokenTreaty = token.charAt(0) === '"' ? token.match(/"([^"]*)"/)[1] : token;
                    jwt.verify(tokenTreaty, process.env.SECRET_KEY);
                    const user = await getUserByToken(tokenTreaty);
                    if (!user) throw 'Usuário não encontrado!';
                    
                    return {
                        data: user ? [user] : [],
                        error: '',
                        message: '',
                    };
                } catch (error) {
                    const message = 'Erro ao buscar usuário pelo token!';
                    console.error(message + ' ' + error);
                    return { 
                        data: [], 
                        error,
                        message,
                    };
                }
            }
        },

        getFollowSuggestions: async (_: any, { input }: any) => {
            const { id } = input;
            const users = await getFollowSuggestions(id);
            return {
                data: users ? users : [],
                error: '',
                message: '',
            };
        }
    },

    Mutation: {
        updateUser: async (_: any, { input }: any, __: any) => {
            const affectedRows = await updateUser(input);
            const user = affectedRows && await getUserById(input.id);
            
            const message = user ? 'Usuário atualizado com sucesso!' : 'Usuário não encontrado!';
            const data = user ? [user] : [defaultUserValues];
            
            return {
                data: data,
                message: message,
            }
        },
    }
  };
  
  module.exports = userResolver;