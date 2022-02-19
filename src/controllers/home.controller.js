const CRUDService = require('../services/CRUDService');

let getHomePage = async (req, res) => {
    try {
        // let data = await db.User.findAll();
        return res.render('homePage.ejs', {
            data: JSON.stringify({})
        });
    } catch (err) {
        console.log(err);
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('post from crud')
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;

    if (userId) {
        let userData = await CRUDService.getUserById(userId);
        // console.log(`----------`);
        // console.log(userData);
        // console.log(`----------`);
        //check userData

        return res.render("editCRUD.ejs", {
            user: userData
        });
    }
    else
        return res.send("User not found!");
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.upDateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUsers
    });
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send("DELETED");
    } else {
        return res.send("USER NOT FOUND!");
    }
}

module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}