const db = require('../models/index');
const _ = require('lodash');
require('dotenv').config()
const emailService = require('./emailService');

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorsHome = (inputLimit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                limit: inputLimit,
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"]
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ["valueEn", "valueVi"] },
                    { model: db.Allcode, as: 'genderData', attributes: ["valueEn", "valueVi"] },
                    { model: db.Doctor_Info, attributes: ["specialtyId", "provinceId"] },
                ],
                nest: true,
                raw: true
            })
            if (doctors && doctors.length > 0) {
                //decode
                for (let i = 0; i < doctors.length; i++) {
                    doctors[i].image = Buffer.from(doctors[i].image, 'base64').toString('binary')
                }
            }
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            console.log(e)
            reject(e);
        }
    })
}

let getAllDoctorsService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ["password"]
                },
            })
            if (doctors && doctors.length > 0) {
                //decode
                for (let i = 0; i < doctors.length; i++) {
                    doctors[i].image = Buffer.from(doctors[i].image, 'base64').toString('binary')
                }
            }
            resolve({
                errCode: 0,
                data: doctors
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

let saveInfoDoctorsService = (data) => {
    return new Promise(async (resolve, reject) => {
        const {
            contentHTML,
            contentMarkdown,
            description,
            doctorId,
            action,
            selectedPayment,
            selectedPrice,
            selectedProvince,
            selectedSpecialty,
            selectedClinic,
            nameClinic,
            clinicAddress,
            note
        } = data
        try {
            if (
                !doctorId ||
                !contentHTML ||
                !contentMarkdown ||
                !action ||
                !selectedPayment ||
                !selectedPrice ||
                !selectedProvince ||
                !nameClinic ||
                !clinicAddress ||
                !note ||
                !selectedSpecialty
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parrameter!"
                })
            } else {

                //upsert to Markdown
                if (action === "CREATE") {
                    await db.Markdown.create({
                        contentHTML: contentHTML,
                        contentMarkdown: contentMarkdown,
                        description: description,
                        doctorId: doctorId
                    })
                } else if (action === "EDIT") {
                    let markdownDoctor = await db.Markdown.findOne({
                        where: { doctorId: doctorId },
                        raw: false
                    });

                    if (markdownDoctor) {
                        markdownDoctor.contentHTML = contentHTML;
                        markdownDoctor.contentMarkdown = contentMarkdown;
                        markdownDoctor.description = description;
                        await markdownDoctor.save();
                    }

                }

                //upsert to Doctor_Info
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: doctorId },
                    raw: false
                })

                if (doctorInfo) {
                    //update
                    doctorInfo.priceId = selectedPrice;
                    doctorInfo.provinceId = selectedProvince;
                    doctorInfo.paymentId = selectedPayment;
                    doctorInfo.note = note;
                    doctorInfo.addressClinicId = clinicAddress;
                    doctorInfo.nameClinic = nameClinic;
                    doctorInfo.specialtyId = selectedSpecialty;
                    doctorInfo.clinicId = selectedClinic ? selectedClinic : 1000;

                    await doctorInfo.save()
                } else {
                    //create
                    await db.Doctor_Info.create({
                        doctorId: doctorId,
                        priceId: selectedPrice,
                        provinceId: selectedProvince,
                        paymentId: selectedPayment,
                        note: note,
                        addressClinicId: clinicAddress,
                        nameClinic: nameClinic,
                        specialtyId: selectedSpecialty,
                        clinicId: selectedClinic ? selectedClinic : 1000
                    })
                }

                resolve({
                    errCode: 0,
                    message: "Save data succeed!"
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDoctorByIdService = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parrameter!"
                })
            } else {
                let doctorInfo = await db.User.findOne({
                    where: { id: id },
                    attributes: {
                        exclude: ["password"]
                    },
                    include: [
                        { model: db.Markdown, attributes: ["description", "contentHTML", "contentMarkdown"] },
                        { model: db.Allcode, as: 'positionData', attributes: ["valueEn", "valueVi"] },
                        {
                            model: db.Doctor_Info,
                            attributes: { exclude: ["id", "doctorId"] },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ["valueEn", "valueVi"] },
                                { model: db.Allcode, as: 'provinceData', attributes: ["valueEn", "valueVi"] },
                                { model: db.Allcode, as: 'paymentData', attributes: ["valueEn", "valueVi"] }
                            ]
                        }

                    ],
                    raw: false,
                    nest: true
                })

                if (doctorInfo && doctorInfo.image) {
                    //decode
                    doctorInfo.image = Buffer.from(doctorInfo.image, 'base64').toString('binary')
                }

                if (!doctorInfo)
                    doctorInfo = {}

                resolve({
                    errCode: 0,
                    data: doctorInfo
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let blunkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })
            } else {
                let scheduleData = data.arrSchedule;
                if (scheduleData && scheduleData.length > 0) {
                    scheduleData = scheduleData.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        item.date = item.date.toString()
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })

                let toCreate = _.differenceWith(scheduleData, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date;
                })

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                    resolve({
                        errCode: 0,
                        message: "Saved schedule!"
                    })
                }
                else
                    resolve({
                        errCode: 1,
                        errMessage: "That time is full! Please choose another."
                    })


            }

        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleDoctorByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ["valueEn", "valueVi"] },
                        { model: db.User, as: 'doctorData', attributes: ["firstName", "lastName"] },
                    ],
                    nest: true,
                    raw: true
                })

                if (!dataSchedule) {
                    dataSchedule = []
                }

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInfoDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parrameter!"
                })
            } else {
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ["valueEn", "valueVi"] },
                        { model: db.Allcode, as: 'provinceData', attributes: ["valueEn", "valueVi"] },
                        { model: db.Allcode, as: 'paymentData', attributes: ["valueEn", "valueVi"] }
                    ],
                    raw: false,
                    nest: true
                })

                if (!doctorInfo)
                    doctorInfo = {}

                resolve({
                    errCode: 0,
                    data: doctorInfo
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parrameter!"
                })
            } else {
                let doctorInfo = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ["password"]
                    },
                    include: [
                        { model: db.Markdown, attributes: ["description"] },
                        { model: db.Allcode, as: 'positionData', attributes: ["valueEn", "valueVi"] },
                        {
                            model: db.Doctor_Info,
                            attributes: { exclude: ["id", "doctorId"] },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ["valueEn", "valueVi"] },
                                { model: db.Allcode, as: 'provinceData', attributes: ["valueEn", "valueVi"] },
                                { model: db.Allcode, as: 'paymentData', attributes: ["valueEn", "valueVi"] }
                            ]
                        }

                    ],
                    raw: false,
                    nest: true
                })

                if (doctorInfo && doctorInfo.image) {
                    doctorInfo.image = Buffer.from(doctorInfo.image, 'base64').toString('binary')

                }

                if (!doctorInfo)
                    doctorInfo = {}

                resolve({
                    errCode: 0,
                    data: doctorInfo
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getListPatientService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parrameter!"
                })
            } else {
                let doctorInfo = await db.Booking.findAll({
                    where: {
                        statusId: "S2",
                        doctorId: doctorId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ["email", 'firstName', 'lastName', 'address', 'gender', 'birthday'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ["valueEn", "valueVi"] },
                            ]
                        },
                        { model: db.Allcode, as: 'timeData', attributes: ["valueEn", "valueVi"] },

                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: doctorInfo
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


let sendRemedyService = (data) => {
    return new Promise(async (resolve, reject) => {
        const {
            email,
            file,
            patientId,
            doctorId,
            timeType,
            firstName,
            lastName,
            language
        } = data
        try {

            if (!email || !patientId || !doctorId || !timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!"
                })
            } else {
                //update status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: doctorId,
                        patientId: patientId,
                        timeType: timeType,
                        statusId: "S2"
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = "S3";
                    await appointment.save()

                    const patientName = language === 'vi' ? `${lastName} ${firstName}` : `${firstName} ${lastName}`

                    await emailService.sendEmailRemedy({
                        recieverEmail: email,
                        language: language,
                        image: file,
                        patientName: patientName,
                        patientId: patientId
                    })

                }


                resolve({
                    errCode: 0,
                    message: language === "vi" ? "Thao tác thành công" : "Succeed!"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctorsDetailService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"]
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ["valueEn", "valueVi"] },
                ],
                nest: true,
                raw: true
            })

            resolve({
                errCode: 0,
                data: doctors
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorsHome: getTopDoctorsHome,
    getAllDoctorsService: getAllDoctorsService,
    saveInfoDoctorsService: saveInfoDoctorsService,
    getDoctorByIdService: getDoctorByIdService,
    blunkCreateScheduleService: blunkCreateScheduleService,
    getScheduleDoctorByDateService: getScheduleDoctorByDateService,
    getExtraInfoDoctorByIdService: getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService: getProfileDoctorByIdService,
    getListPatientService,
    sendRemedyService,
    getAllDoctorsDetailService
}