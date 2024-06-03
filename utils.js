const bcrypt = require('bcrypt');

async function hashPassword(password) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(hash);
    return hash;
}
 
async function verifyPassword(providedPassword, storedHashedPassword) {
    try {
        const match = await bcrypt.compare(providedPassword, storedHashedPassword);
        return match;
    } catch (error) {
        console.error('Error verifying password:', error);
        return false;
    }
}
module.exports = { hashPassword, verifyPassword };