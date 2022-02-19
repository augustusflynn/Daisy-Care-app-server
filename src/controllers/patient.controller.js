const patientService = require('../services/patientService');

let bookingAppointment = async (req, res) => {
	 try {
        let info = await patientService.postBookAppointmentService(req.body);
        
        return res.status(200).json(info);
    } catch(e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}

let verifyingBookAppointment = async (req, res) => {
    try {
        let info = await patientService.postVerifyingBooking(req.body);
        
        return res.status(200).json(info);
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server!"
        })
    }
}


module.exports = {
	bookingAppointment,
    verifyingBookAppointment
}