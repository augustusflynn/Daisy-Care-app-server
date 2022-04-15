const userService = require('../services/userService');

let handleLogin = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        if(!email || !password)
            return res.status(200).json({
                errCode: 1,
                message: "Missing input parrameter!"
            });
        
    
        let userData = await userService.handleLogin(email, password);
        //check email exit
        //cmp password
        //return userInfo
        //access_token: JWT
        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ?  userData.user : {}
        });
    } catch (error) {
        console.log('login errror', error);
    }
}

let handleGetUsers = async (req, res) => {
    //type ALL | id
    let id = req.query.id;
    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing parrameter!",
            users: []
        })
    }
    let users = await userService.getUser(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        users
    })
}

let handleCreateUser = async (req, res) => {
    let message = await userService.createUser(req.body);

    return res.status(200).json({...message});
}

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
}

let handleDeleteUser = async (req, res) => {
    let id = req.body.id;

    let message = await userService.deleteUserById(id);
    return res.status(200).json(message);
}

let getAllCode = async (req, res) => {
    try {
        setTimeout(async () => {
            let data = await userService.getAllCodeService(req.query.type);
            return res.status(200).json(data);
        }, 5000)
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        });
    }
}

let handleFindUser = async (req, res) => {
    try {
        let data = await userService.findUser(req.body);
        return res.status(200).json(data);
    } catch(e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        });
    }
}

let handleFindUserSchedules = async (req, res) => {
    try {
        let data = await userService.findUserSchedules(req.body.userId);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let handleUserCancelSchedule = async (req, res) => {
    try {
        let data = await userService.userCancelSchedule(req.body.scheduleId);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

module.exports = {
    handleLogin: handleLogin,
    handleGetUsers: handleGetUsers,
    handleCreateUser: handleCreateUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    getAllCode: getAllCode,
    handleFindUser: handleFindUser,
    handleFindUserSchedules,
    handleUserCancelSchedule
}