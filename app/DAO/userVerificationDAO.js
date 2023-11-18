import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userVerificationSchema = new mongoose.Schema({
    userId: {type: String},
    uniqueString: {type: String},
    createdAt: {type: Date},
    expiresAt: {type: Date},
}, {
    collection: 'userVerification'
});

userVerificationSchema.plugin(uniqueValidator);

const UserVerificationModel = mongoose.model('userVerification', userVerificationSchema);

module.exports = UserVerificationModel
export default {

};
