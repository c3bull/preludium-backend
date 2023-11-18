import PasswordDAO from '../DAO/passwordDAO';
import TokenDAO from '../DAO/tokenDAO';
import UserDAO from '../DAO/userDAO';
import applicationException from '../service/applicationException';
import sha1 from 'sha1';
import OrderDAO from "../DAO/orderDAO";


// const nodemailer = require("nodemailer")
// require("dotenv").config()
// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.AUTH_EMAIL,
//         pass: process.env.AUTH_PASSWORD,
//     },
// })
//
// transporter.verify((error, success) => {
//     if(error){
//         console.log(error);
//     }else{
//         console.log("ready")
//         console.log(success)
//     }
// })

function create(context) {

    function hashString(password) {
        return sha1(password);
    }

    async function authenticate(name, password) {
        let userData;
        const user = await UserDAO.getByEmailOrName(name);
        if (!user) {
            throw applicationException.new(applicationException.UNAUTHORIZED, 'User with that email does not exist');
        }
        userData = await user;
        await PasswordDAO.authorize(user.id, hashString(password));
        const token = await TokenDAO.create(userData);
        return getToken(token);
    }

    function getToken(token) {
        return {token: token.value};
    }

    function getAllUsers() {
        return UserDAO.getAllUsers();
    }

    function updateRoleById(userId, role) {
        return UserDAO.updateRoleById(userId, role);
    }

    async function createNewOrUpdate(userData) {
        const user = await UserDAO.createNewOrUpdate(userData);
        if (await userData.password) {
            return await PasswordDAO.createOrUpdate({userId: user.id, password: hashString(userData.password)});
        } else {
            return user;
        }
    }

    async function removeHashSession(userId) {
        return await TokenDAO.remove(userId);
    }

    return {
        authenticate: authenticate,
        createNewOrUpdate: createNewOrUpdate,
        getAllUsers: getAllUsers,
        updateRoleById: updateRoleById,
        removeHashSession: removeHashSession
    };
}

export default {
    create: create
};
