import doctorService from '../services/doctorService'

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) 
        limit = 8;
    try {
        let doctors = await doctorService.getTopDoctorsHome(+limit)
        return res.status(200).json(doctors)
    }catch (e){
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
} 

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorsService();
        
        return res.status(200).json(doctors)
        
    } catch(e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let saveInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInfoDoctorsService(req.body)
        return res.status(200).json(response)
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getDetailDoctorsById = async (req, res) => {
    try {
        let info = await doctorService.getDoctorByIdService(req.query.id);

        return res.status(200).json(info)
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let blunkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.blunkCreateScheduleService(req.body)
        return res.status(200).json(info)
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage:"Error from server!"
        })
    }
}

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleDoctorByDateService(req.query.doctorId, req.query.date);

        return res.status(200).json(info)
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getExtraInfoDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getExtraInfoDoctorByIdService(req.query.doctorId);

        return res.status(200).json(info)
    }catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getProfileDoctorByIdService(req.query.doctorId);

        return res.status(200).json(info)
    }catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getListPatientByDoctor = async (req, res) => {
    try {
        let data = await doctorService.getListPatientService(req.query.id, req.query.date);

        return res.status(200).json(data)
    }catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let data = await doctorService.sendRemedyService(req.body);
        return res.status(200).json(data)
    }catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getAllDoctorsDetail = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorsDetailService();
        
        return res.status(200).json(doctors)
        
    } catch(e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

module.exports = {
    getTopDoctorHome:getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveInfoDoctor: saveInfoDoctor,
    getDetailDoctorsById: getDetailDoctorsById,
    blunkCreateSchedule: blunkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInfoDoctorById: getExtraInfoDoctorById,
    getProfileDoctorById: getProfileDoctorById,
    getListPatientByDoctor,
    sendRemedy,
    getAllDoctorsDetail
}