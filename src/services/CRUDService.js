const bcrypt = require('bcryptjs');
const db = require('../models/index');

var salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hasPasswordFromCrypt = await hashPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hasPasswordFromCrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === 1 ? true : false,
                roleId: data.roleId,
                positionId: "",
                image: ""
            })

            resolve("Succesful!");
        }catch(er) {
            reject(er)
        }
    })
}

let hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        }catch(er) {
            reject(er);
        }
    })
}

let getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            //db. `modelName`
            //raw: true to config console.log just print an array and inside it has objects
            let users = db.User.findAll({ raw: true });
            resolve(users);
        }catch(er) {
            reject(er);
        }
    })
}

let getUserById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true 
            })

            if(user)
                resolve(user);
            else
                resolve({});
        }catch(e) {
            console.log(e);
        }
    })
}

let upDateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id}
            });

            if(user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            }
            else {
                resolve();
            }
            
        }catch(er) {
            reject(er);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })

            if(user)
                await user.destroy();
            
            resolve();
        }catch(er) {
            reject(er);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser, 
    getUserById: getUserById,
    upDateUserData: upDateUserData,
    deleteUserById: deleteUserById,
}