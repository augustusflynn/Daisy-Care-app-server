import clinicService from '../services/clinicService'

let createClinic = async (req, res) => {
	try {
        let info = await clinicService.createClinicService(req.body);
        
        return res.status(200).json(info);
    } catch(e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getTopClinicHome = async(req, res) => {
	let limit = req.query.limit;
    if(!limit) 
        limit = 8;
    try {
        let clinics = await clinicService.getTopClinicService(+limit)
    	return res.status(200).json(clinics)
    }catch (e){
    	console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getAllClinics = async (req, res) => {
    try {
        let clinics = await clinicService.getAllClinicsService()
    	return res.status(200).json(clinics)
    }catch (e){
    	console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let clinics = await clinicService.getDetailClinicByIdService(req.query.id)
        return res.status(200).json(clinics)
    }catch (e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

module.exports = {
	createClinic,
	getTopClinicHome,
	getAllClinics,
    getDetailClinicById
}