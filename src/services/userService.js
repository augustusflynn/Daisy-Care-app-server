import db from '../models/index'
import bcrypt from 'bcryptjs';

var salt = bcrypt.genSaltSync(10);


let handleLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExit = await checkEmail(email);
            //if user is exit, then compare password
            if (isExit) {
                let user = await db.User.findOne({
                    where: { email: email },
                    raw: true,
                    //want to get everything except for ...
                    //include: what you want
                    //exclude: what you don't want
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'image', 'positionId']
                    }
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "ok";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password!";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found!";
                }
                resolve(userData);
            }
            else {
                userData.errCode = 1;
                userData.errMessage = "Your's email isn't exist in system!";
                resolve(userData);
            }
        } catch (err) {
            reject(err);
        }
    })
}

let checkEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user)
                resolve(true);
            else
                resolve(false);
        } catch (err) {
            reject(err);
        }
    })
}

let getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let users = {};
        try {
            if (userId == "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                });
            } else if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}

let validateInput = (data) => {
    const arr = ["email", "birthday", "password", "gender", "firstName", "lastName", "address", "phoneNumber"];

    for (let i = 0; i < arr.length; i++) {
        if (!data[arr[i]]) {
            return ({
                isValid: false,
                errCode: 1,
                errMessage: "Missing parameter " + arr[i]
            })
        }
    }

    return ({
        isValid: true
    });
}

let createUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        const {
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            roleId,
            address,
            gender,
            positionId,
            image,
            birthday
        } = data;
        try {
            let validate = validateInput(data);

            if (validate.isValid) {
                let check = await checkEmail(email);
                if (check) {
                    resolve({
                        errCode: 2,
                        errMessage: "Email is used! Please try another..."
                    });
                }
                else {
                    let hasPasswordFromCrypt = await hashPassword(password);
                    await db.User.create({
                        email: email,
                        password: hasPasswordFromCrypt,
                        firstName: firstName,
                        lastName: lastName,
                        address: address,
                        phoneNumber: phoneNumber,
                        gender: gender,
                        roleId: roleId ? roleId : "R3",
                        positionId: positionId ? positionId : "",
                        image: image ? image : "",
                        birthday: birthday
                    })
                    resolve({
                        errCode: 0,
                        message: "Create user succeeded!"
                    });
                }
            } else {
                resolve(validate)
            }

        } catch (er) {
            reject(er)
        }
    })
}

let hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (er) {
            reject(er);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id)
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parrameter!'
                })
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            });

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                if (data.image)
                    user.image = data.image;

                user.save()
                resolve({
                    errCode: 0,
                    message: "Update user success!"
                });
            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found!"
                });
            }

        } catch (er) {
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

            if (!user)
                resolve({
                    errCode: 2,
                    errMessage: "The user isn't exist!"
                })
            else {
                //          way1          //
                // await user.destroy();
                //       way2     //
                db.User.destroy({
                    where: { id: userId }
                })
                resolve({
                    errCode: 0,
                    message: "The user has been deleted!"
                });
            }
        } catch (er) {
            reject(er);
        }
    })
}

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parrameter!"
                })
            }
            let res = {};
            let allcode = await db.Allcode.findAll({
                where: { type: typeInput }
            });
            res.errCode = 0;
            res.data = allcode;

            resolve(res);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleLogin: handleLogin,
    getUser: getUser,
    createUser: createUser,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
    getAllCodeService: getAllCodeService,
}