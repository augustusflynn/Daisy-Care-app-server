const db = require('../models/index');
require('dotenv').config()
const emailService = require('./emailService');
const { v4: uuidv4 } = require('uuid');

let buildUrlEmail = (doctorId, token) => {
	let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`

	return result;
}

let postBookAppointmentService = (data) => {
	return new Promise(async (resolve, reject) => {
		const {
			email,
			doctorId,
			timeType,
			date,
			firstName,
			lastName,
			address,
			phoneNumber,
			gender,
			language,
			timeString,
			doctorName,
			reason
		} = data
		try {
			//upsert patient
			let user = await db.User.findOrCreate({
				where: { email: email },
				defaults: {
					firstName: firstName,
					lastName: lastName,
					email: email,
					roleId: "R3",
					address: address,
					phoneNumber: phoneNumber,
					gender: gender
				}
			})

			//create booking record

			let token = uuidv4();

			if (user && user[0]) {
				await db.Booking.findOrCreate({
					where: { patientId: user[0].id, timeType: timeType, date: date },
					defaults: {
						statusId: "S1",
						doctorId: doctorId,
						patientId: user[0].id,
						date: date,
						timeType: timeType,
						token: token,
						reason: reason
					}
				})

				await emailService.sendEmailSync({
					recieverEmail: email,
					patientName: `${lastName} ${firstName}`,
					time: timeString,
					doctorName: doctorName,
					language: language,
					redirectLink: buildUrlEmail(doctorId, token)
				})
			}

			resolve({
				errCode: 0,
				message: language === "vi" ? "Quý khách vui lòng xác nhận thông tin đặt lịch khám tại email!" : "Please check your email to verify booking schedule!"
			});



		} catch (e) {
			reject(e);
		}
	})
}

let postVerifyingBooking = (data) => {
	return new Promise(async (resolve, reject) => {
		const { token, doctorId } = data;
		try {
			if (!token || !doctorId) {
				resolve({
					errCode: 1,
					errMessage: "Missing parameter!"
				})
			} else {
				let appointment = await db.Booking.findOne({
					where: { doctorId: doctorId, token: token, statusId: "S1" },
					raw: false
				})

				if (appointment) {
					appointment.statusId = "S2";

					await appointment.save()
					resolve({
						errCode: 0,
						message: "Update the appointment succeed!"
					})
				} else {
					resolve({
						errCode: 2,
						message: "Appointment has been actived or doesn't exist!"
					})
				}

			}
		} catch (e) {
			reject(e)
		}
	})
}

module.exports = {
	postBookAppointmentService,
	postVerifyingBooking
}