const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const secretString = "secret string"

const login = async (email, password) => {
    try {
        let foundUser = await User.findOne({email: email.trim()}).exec()
        if(!foundUser) {
            throw "User does not exist"
        }
        if(foundUser.isBanned === 1) {
            throw "User is banned. Please contact your website admin"
        }
        let encryptedPassword = await foundUser.password
        let checkPassword = await bcrypt.compare(password, encryptedPassword)
        if (checkPassword === true) {
            //Đăng nhập thành công
            let jsonObject = {
                id: foundUser._id
            }
            let tokenKey = await jwt.sign(jsonObject, 
                                secretString, {
                                    expiresIn: 86400 // Expire in 24h
                                })
            //Trả về thông tin user kèm tokenKey
            let userObject = await foundUser.toObject()            
            userObject.tokenKey = tokenKey                                
            return userObject
        } else {
            throw 'Tên user hoặc mật khẩu sai'
        }
    } catch(error) {
        throw error
    }
}

const verifyJWT = async (tokenKey) => {
    try {          
        let decodedJson = await jwt.verify(tokenKey, secretString)
        if(Date.now() / 1000 >  decodedJson.exp) {
            throw "Token hết hạn, mời bạn login lại"
        }
        let foundUser = await User.findById(decodedJson.id)
        if (!foundUser) {
            throw "Ko tìm thấy user với token này"
        }
        if(foundUser.isBanned === 1) {
            throw "User đã bị khoá tài khoản, do vi phạm điều khoản"
        }
        return foundUser
    } catch(error) {
        throw error
    }                 
}

module.exports = {
    login, verifyJWT
}