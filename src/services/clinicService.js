import db from '../models/index'
require('dotenv').config()


let createClinicService = (data) => {
	return new Promise(async (resolve, reject) => {
		const {
			nameVi,
			nameEn,
			address,
			descriptionHTML,
			descriptionMarkdown,
			image,
		} = data;
		try {
			if (!nameVi || !nameEn || !address || !image || !descriptionHTML || !descriptionMarkdown) {
				resolve({
					errCode: 0,
					errMessage: "Missing required parameter!"
				})
			} else {
				await db.Clinic.create({
					descriptionMarkdown: descriptionMarkdown,
					descriptionHTML: descriptionHTML,
					image: image,
					nameVi: nameVi,
					nameEn: nameEn
				})

				resolve({
					errCode: 0,
					message: "Save specialty succeed!"
				})
			}
		} catch (e) {
			reject(e);
		}
	})

}


let getTopClinicService = (limit) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!limit) {
				resolve({
					errCode: 0,
					errMessage: "Missing required parameter!"
				})
			} else {
				let data = await db.Clinic.findAll({
					limit: limit,
					attributes: {
						exclude: ['descriptionHTML', 'descriptionMarkdown']
					}
				})

				if (data && data.length > 0) {
					data.map((item) => {
						item.image = Buffer.from(item.image, 'base64').toString('binary');

						return item;
					})
				}

				resolve({
					errCode: 0,
					data: data
				})
			}
		} catch (e) {
			reject(e);
		}
	})
}

let getAllClinicsService = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let data = await db.Clinic.findAll()

			if (data && data.length > 0) {
				data.map((item) => {
					item.image = Buffer.from(item.image, 'base64').toString('binary');

					return item;
				})
			}

			resolve({
				errCode: 0,
				data: data
			})
		}
		catch (e) {
			reject(e);
		}
	})
}


let getDetailClinicByIdService = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id) {
				resolve({
					errCode: 1,
					errMessage: "Missing required parameter!"
				})
			} else {
				let data = await db.Clinic.findOne({
					where: { id: id }
				})


				if (data) {
					data.image = Buffer.from(data.image, 'base64').toString('binary');

					let doctorClinic = []
					doctorClinic = await db.Doctor_Info.findAll({
						where: { clinicId: id },
						attributes: ['doctorId']
					})

					data.doctorClinic = doctorClinic;

				} else {
					data = {}
				}

				resolve({
					errCode: 0,
					data: data
				})
			}

		}
		catch (e) {
			reject(e);
		}
	})
}

module.exports = {
	createClinicService,
	getTopClinicService,
	getAllClinicsService,
	getDetailClinicByIdService
}