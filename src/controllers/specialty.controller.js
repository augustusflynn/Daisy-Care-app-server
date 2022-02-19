const specialtyService = require('../services/specialtyService')

let createSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.createSpecialtyService(req.body);
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: 1,
            errMessage: "Error from server!"
        })
    }
}

let getTopSpecialtyHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit)
        limit = 8;
    try {
        let specialties = await specialtyService.getTopSpecialtyService(+limit)
        return res.status(200).json(specialties)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getAllSpecialties = async (req, res) => {
    try {
        let specialties = await specialtyService.getAllSpecialtiesService()
        return res.status(200).json(specialties)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        let specialties = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location)
        return res.status(200).json(specialties)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let handleEditSpecialty = async (req, res) => {
    let data = req.body;
    let message = await specialtyService.updateSpecialtyData(data);
    return res.status(200).json(message);
}

let handleDeleteSpecialty = async (req, res) => {
    let id = req.body.id;

    let message = await specialtyService.deleteSpecialtyById(id);
    return res.status(200).json(message);
}

module.exports = {
    createSpecialty,
    getTopSpecialtyHome,
    getAllSpecialties,
    getDetailSpecialtyById,
    handleEditSpecialty,
    handleDeleteSpecialty
}