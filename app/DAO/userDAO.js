import mongoose from 'mongoose';
import * as _ from 'lodash';
import Promise from 'bluebird';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';
import uniqueValidator from 'mongoose-unique-validator';
import nodemailer from "nodemailer";
import userVerificationDAO from "./userVerificationDAO";
import User from "mongodb/lib/collection";

// const express = require("express")
// // const router = express.Router()
// const router = express();
// const bcrypt = require("bcrypt")
// const {v4: uuidv4} = require("uuid")
// const path = require("path")
const userRole = {
    admin: 'admin',
    user: 'user'
};

const userRoles = [userRole.admin, userRole.user];
// const UserVerification = require("./userVerificationDAO")
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true, unique: false},
    surname: {type: String, required: true, unique: false},
    role: {type: String, required: true, unique: false},
    registerDateInMs: {type: String, required: true, unique: false},
    // verified: {type: Boolean}
    // role: { type: String, enum: userRoles, default: userRole.admin, required: false },
    // active: { type: Boolean, default: true, required: false },
}, {
    collection: 'user'
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('user', userSchema);
//
// let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//         user: process.env.AUTH_EMAIL,
//         pass: process.env.AUTH_PASSWORD,
//     },
// })
// const sendVerificationEmail = ({_id, email}, res) => {
//     console.log("tutaj 1")
//     const currentUrl = "http://localhost:3002/"
//     const uniqueString = uuidv4() + _id;
//     console.log('us ', uniqueString)
//     const mailOptions = {
//         from: process.env.AUTH_EMAIL,
//         to: email,
//         subject: "Preludium - zweryfikuj swój email",
//         html: `<p>Zweryfukuj swój email, aby móc się zalogować</p>
//                <p>Ten link <b>wygasa za 6 godzin</b>.</p>
//                <p>Naciśnij <a href=${currentUrl + "user/verify/" + _id + "/" + uniqueString}> tutaj</a>, aby ukończyć rejestrację</p>`,
//     };
//     const saltRounds = 10;
//     bcrypt
//         .hash(uniqueString, saltRounds)
//         .then((hashedUniqueString) => {
//             const newVerification = new UserVerification({
//                 userId: _id,
//                 uniqueString: hashedUniqueString,
//                 createdAt: Date.now(),
//                 expiresAt: Date.now() + 21600000
//             })
//             newVerification
//                 .save()
//                 .then(() => {
//                     console.log("tutaj 2")
//                     transporter
//                         .sendMail(mailOptions)
//                         .then((response) => {
//                             console.log('res!!! ', response)
//                             // res.json({
//                             //     status: "PENDING",
//                             //     message: "Verification email sent!",
//                             // })
//                         })
//                         .catch((error) => {
//                             console.log(error)
//                             // res.json({
//                             //     status: "FAILED",
//                             //     message: "Couldn't save verification email data!",
//                             // })
//                         })
//                 })
//                 .catch((error) => {
//                     console.log(error)
//                     // res.json({
//                     //     status: "FAILED",
//                     //     message: "Couldn't save verification email data!",
//                     // })
//                 })
//         })
//         .catch((error) => {
//             console.log(error)
//             // res.json({
//             //     status: "FAILED",
//             //     message: "An error occurred while hashing email data!",
//             // })
//         })
// }
//
// router.get("/verify/:userId/:uniqueString", (req, res) => {
//    console.log("im here")
//
//     let {userId, uniqueString} = req.params;
//     UserVerification
//         .find({userId})
//         .then((result) => {
//             if (result.length > 0) {
//                 const {expiresAt} = result[0];
//                 const hashedUniqueString = result[0].uniqueString;
//                 if (expiresAt < Date.now()) {
//                     UserVerification.deleteOne({userId})
//                         .then(result => {
//                             UserModel.deleteOne({_id: userId})
//                                 .then(() => {
//                                     // let message = "Link has expired. Please sign up again"
//                                     // res.redirect(`/user/verified?error=true&message=${message}`);
//
//                                 })
//                                 .catch(error => {
//                                     console.log(error)
//                                     // let message = "Clearing user with expired unique string failed"
//                                     // res.redirect(`/user/verified?error=true&message=${message}`);
//                                 })
//                         })
//                         .catch((error) => {
//                             console.log(error)
//                             // let message = "An error occurred while clearing expired user verification record"
//                             // res.redirect(`/user/verified?error=true&message=${message}`);
//                         })
//                 } else {
//                     bcrypt
//                         .compare(uniqueString, hashedUniqueString)
//                         .then(result => {
//                             if (result) {
//                                 //string match
//                                 UserModel.updateOne({_id: userId}, {verified: true})
//                                     .then(() => {
//                                         UserVerification.deleteOne({userId})
//                                             .then(() => {
//                                                 res.sendFile(path.join(__dirname, "./../views/verified.html"))
//                                             })
//                                             .catch((error) => {
//                                                 console.log(error)
//                                                 // let message = "An error occurred while finalizing successful verification"
//                                                 // res.redirect(`/user/verified?error=true&message=${message}`);
//
//                                             })
//                                     })
//                                     .catch((error) => {
//                                         console.log(error)
//                                         // let message = "An error occurred while updating user record to show verified."
//                                         // res.redirect(`/user/verified?error=true&message=${message}`);
//
//                                     })
//                             } else {
//                                 // let message = "Invalid verification details passed. Check your inbox."
//                                 // res.redirect(`/user/verified?error=true&message=${message}`);
//
//                             }
//                         })
//                         .catch((error) => {
//                             console.log(error)
//                             // let message = "An error occurred while comparing unique strings."
//                             // res.redirect(`/user/verified?error=true&message=${message}`);
//
//                         })
//                 }
//             } else {
//                 // let message = "Account record doesn't exist or has been verified already. Please sign up or log in."
//                 // res.redirect(`/user/verified?error=true&message=${message}`);
//             }
//         })
//         .catch((error) => {
//             console.log(error)
//             // let message = "An error occurred while checking fir existing user verification record"
//             // res.redirect(`/user/verified?error=true&message=${message}`);
//         })
// })
//
//
// router.get("/verified", (req, res) => {
//     res.sendFile(path.join(__dirname, "./../views/verified.html"))
// })

function createNewOrUpdate(user) {
    return Promise.resolve().then(() => {
        if (!user.id) {
            return new UserModel(user).save().then((result) => {
                if (result) {
                    // let payloadEmail = result.email
                    // let payloadId = result._id
                    // let payload = {_id: payloadId, email: payloadEmail}
                    // console.log("result, ", result)
                    // sendVerificationEmail(payload, res);
                    return mongoConverter(result);
                }
            })
            // .then((result) => sendVerificationEmail(result, res));
        } else {
            return UserModel.findByIdAndUpdate(user.id, _.omit(user, 'id'), {new: true});
        }
    }).catch(error => {
        if ('ValidationError' === error.name) {
            error = error.errors[Object.keys(error.errors)[0]];
            throw applicationException.new(applicationException.BAD_REQUEST, error.message);
        }
        throw error;
    });
}

async function getAllUsers() {
    const result = await UserModel.find().sort({registerDateInMs: -1});
    if (result) {
        return mongoConverter(result);
    }
    throw applicationException.new(applicationException.BAD_REQUEST, 'No users');
}

async function updateRoleById(userId, role) {
    return UserModel.findOneAndUpdate(
        {_id: userId},
        {$set: {role: role}}
    );
}

async function getByEmailOrName(name) {
    const result = await UserModel.findOne({$or: [{email: name}, {name: name}]});
    if (result) {
        // if (result.verified) {
        //     console.log('verified ',result.verified)
        return mongoConverter(result);
        // }
    }
    throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
}

async function get(id) {
    const result = await UserModel.findOne({_id: id});
    if (result) {
        return mongoConverter(result);
    }
    throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
}

async function removeById(id) {
    return await UserModel.findByIdAndRemove(id);
}

export default {
    createNewOrUpdate: createNewOrUpdate,
    getByEmailOrName: getByEmailOrName,
    getAllUsers: getAllUsers,
    updateRoleById: updateRoleById,
    get: get,
    removeById: removeById,

    userRole: userRole,
    model: UserModel
};
