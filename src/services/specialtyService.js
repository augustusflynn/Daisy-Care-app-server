import db from '../models/index'
require('dotenv').config()

let createSpecialtyService = (data) => {
	return new Promise(async (resolve, reject) => {
		const {
			nameVi,
			nameEn,
			imgBase64,
			descriptionHTML,
			descriptionMarkdown
		} = data;

		try {
			if (!nameVi || !nameEn || !imgBase64 || !descriptionHTML || !descriptionMarkdown) {
				resolve({
					errCode: 0,
					errMessage: "Missing required parameter!"
				})
			} else {
				await db.Specialty.create({
					descriptionMarkdown: descriptionMarkdown,
					descriptionHTML: descriptionHTML,
					image: imgBase64,
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

let getTopSpecialtyService = (limit) => {
	return new Promise(async (resolve, reject) => {

		try {
			if (!limit) {
				resolve({
					errCode: 0,
					errMessage: "Missing required parameter!"
				})
			} else {
				let data = await db.Specialty.findAll({
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

let getAllSpecialtiesService = (data) => {
	return new Promise(async (resolve, reject) => {
		try {
			let data = await db.Specialty.findAll()

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


let getDetailSpecialtyByIdService = (id, location) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (!id || !location) {
				resolve({
					errCode: 1,
					errMessage: "Missing required parameter!"
				})
			} else {
				let data = await db.Specialty.findOne({
					where: { id: id },
					attributes: ['descriptionHTML', 'descriptionMarkdown', 'image']
				})

				if (!data) {
					data = {}
				} else {
					let doctorSpecialty = [];

					if (location === "ALL") {
						doctorSpecialty = await db.Doctor_Info.findAll({
							where: { specialtyId: id },
							attributes: ['doctorId', 'provinceId']
						})
					} else {
						doctorSpecialty = await db.Doctor_Info.findAll({
							where: { specialtyId: id, provinceId: location },
							attributes: ['doctorId', 'provinceId']
						})
					}

					data.doctorSpecialty = doctorSpecialty;

					data.image = Buffer.from(data.image, 'base64').toString('binary');

					resolve({
						errCode: 0,
						data: data
					})
				}
			}
		}
		catch (e) {
			reject(e);
		}
	})
}


let updateSpecialtyData = (data) => {
	return new Promise(async (resolve, reject) => {
		const {
			id,
			nameVi,
			nameEn,
			descriptionHTML,
			descriptionMarkdown,
			image
		} = data
		try {
			if (!id)
				resolve({
					errCode: 2,
					errMessage: 'Missing required parrameter!'
				})
			let specialty = await db.Specialty.findOne({
				where: { id: id },
				raw: false
			});
			if (specialty) {
				specialty.nameVi = nameVi;
				specialty.nameEn = nameEn;
				specialty.descriptionHTML = descriptionHTML;
				specialty.descriptionMarkdown = descriptionMarkdown;
				if (data.image)
					specialty.image = image;

				clinic.save()
				resolve({
					errCode: 0,
					message: "Update specialty succeeded!"
				});
			}
			else {
				resolve({
					errCode: 1,
					errMessage: "Specialty not found!"
				});
			}

		} catch (er) {
			reject(er);
		}
	})
}

let deleteSpecialtyById = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			let specialty = await db.Specialty.findOne({
				where: { id: id }
			})

			if (!specialty)
				resolve({
					errCode: 2,
					errMessage: "The specialty isn't exist!"
				})
			else {
				//          way1          //
				// await user.destroy();
				//       way2     //
				db.Specialty.destroy({
					where: { id: id }
				})
				resolve({
					errCode: 0,
					message: "The specialty has been deleted!"
				});
			}
		} catch (er) {
			reject(er);
		}
	})
}

module.exports = {
	createSpecialtyService,
	getTopSpecialtyService,
	getAllSpecialtiesService,
	getDetailSpecialtyByIdService,
	updateSpecialtyData,
	deleteSpecialtyById
}