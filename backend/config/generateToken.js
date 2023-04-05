const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({id},`major`,{
        expiresIn:"80d"
    });
};

module.exports = generateToken;