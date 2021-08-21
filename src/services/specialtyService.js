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


module.exports = {
	createSpecialtyService,
	getTopSpecialtyService,
	getAllSpecialtiesService,
	getDetailSpecialtyByIdService
}