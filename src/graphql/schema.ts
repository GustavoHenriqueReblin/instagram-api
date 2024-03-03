const userResolver = require('./resolvers/userResolver');
const userTypeSchema = require('./types/userType');

const schema = {
    typeDefs: [
        userTypeSchema,
    ],
    resolvers: [
        userResolver, 
    ],
};

module.exports = schema;