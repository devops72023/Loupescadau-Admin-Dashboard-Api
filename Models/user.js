import mongoose from 'mongoose';
const { model, models } = mongoose;
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from 'uuid';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    } ,
    about: {
        type: String,
        trim: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []   
    },
    image: {
        type: String,
        default: "user-default-image.png",
    }
}, {
    timestamps: true
});

userSchema.virtual('password')
    .set(function(password) { 
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    encryptPassword: function(password) {
        if(!password) {
            return '';
        } else {
            try {
                return CryptoJS.SHA1(password + this.salt).toString(CryptoJS.enc.Hex);
            } catch (err) {
                return '';
            }
        }        
    },

    authenticate: function(plainText) {
        return CryptoJS.SHA1(plainText + this.salt).toString(CryptoJS.enc.Hex) == this.hashed_password;
    }
};

const User = models.User || model('User' , userSchema);

// module.exports = mongoose.model('User', userSchema);
export default User;