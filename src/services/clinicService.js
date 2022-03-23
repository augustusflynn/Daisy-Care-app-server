const db = require('../models/index');
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
					nameEn: nameEn,
					address: address
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

let getAllClinicsService = () => {
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

let updateClinicData = (data) => {
	return new Promise(async (resolve, reject) => {
		const {
			id,
			nameVi,
			nameEn,
			descriptionHTML,
			descriptionMarkdown,
			image,
			address
		} = data
		try {
			if (!id)
				resolve({
					errCode: 2,
					errMessage: 'Missing required parrameter!'
				})
			let clinic = await db.Clinic.findOne({
				where: { id: id },
				raw: false
			});
			if (clinic) {
				clinic.nameVi = nameVi;
				clinic.nameEn = nameEn;
				clinic.address = address;
				clinic.descriptionHTML = descriptionHTML;
				clinic.descriptionMarkdown = descriptionMarkdown;
				if (data.image)
					clinic.image = image;

				clinic.save()
				resolve({
					errCode: 0,
					message: "Update clinic succeeded!"
				});
			}
			else {
				resolve({
					errCode: 1,
					errMessage: "Clinic not found!"
				});
			}

		} catch (er) {
			reject(er);
		}
	})
}

let deleteClinicById = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			let clinic = await db.Clinic.findOne({
				where: { id: id }
			})

			if (!clinic)
				resolve({
					errCode: 2,
					errMessage: "The clinic isn't exist!"
				})
			else {
				//          way1          //
				// await user.destroy();
				//       way2     //
				db.Clinic.destroy({
					where: { id: id }
				})
				resolve({
					errCode: 0,
					message: "The clinic has been deleted!"
				});
			}
		} catch (er) {
			reject(er);
		}
	})
}

module.exports = {
	createClinicService,
	getTopClinicService,
	getAllClinicsService,
	getDetailClinicByIdService,
	updateClinicData,
	deleteClinicById
}