const express = require('express');
const homeController = require('../controllers/home.controller');
const userController = require('../controllers/user.controller');;
const doctorController = require('../controllers/doctor.controller');
const patientController = require('../controllers/patient.controller');
const specialtyController = require('../controllers/specialty.controller');
const clinicController = require('../controllers/clinic.controller');

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    
    router.post('/AI/findUser', userController.handleFindUser);

    router.post('/api/login', userController.handleLogin)
    router.post('/api/register', userController.handleCreateUser)

    router.get('/api/get-all-users', userController.handleGetUsers)
    router.post('/api/create-new-user', userController.handleCreateUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/allcode', userController.getAllCode)
    router.post('/api/get-user-schedules', userController.handleFindUserSchedules);
    router.post('/api/user-cancel-schedule', userController.handleUserCancelSchedule);

    router.get('/api/top-doctor-home', doctorController.getTopDoctorHome)
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)
    router.get('/api/get-all-doctors-detail', doctorController.getAllDoctorsDetail)
    router.post('/api/save-info-doctors', doctorController.saveInfoDoctor)
    router.get('/api/get-detail-doctors-by-id', doctorController.getDetailDoctorsById)
    router.post('/api/bulk-create-schedule', doctorController.blunkCreateSchedule)
    router.get('/api/get-schedule-doctors-by-date', doctorController.getScheduleDoctorByDate)
    router.get('/api/get-extra-info-doctors-by-id', doctorController.getExtraInfoDoctorById)
    router.get('/api/get-profile-doctors-by-id', doctorController.getProfileDoctorById)

    router.get('/api/get-list-patient-by-doctor', doctorController.getListPatientByDoctor)
    router.post('/api/send-remedy', doctorController.sendRemedy)

    router.post('/api/patient-book-schedule', patientController.bookingAppointment)
    router.post('/api/verifying-book-appointment', patientController.verifyingBookAppointment)

    router.post('/api/create-a-new-specialty', specialtyController.createSpecialty)
    router.get('/api/get-top-specialties-home', specialtyController.getTopSpecialtyHome)
    router.get('/api/get-all-specialties', specialtyController.getAllSpecialties)
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById)
    router.put('/api/edit-specialty', specialtyController.handleEditSpecialty)
    router.delete('/api/delete-specialty', specialtyController.handleDeleteSpecialty)

    router.post('/api/create-a-new-clinic', clinicController.createClinic)
    router.get('/api/get-top-clinics-home', clinicController.getTopClinicHome)
    router.get('/api/get-all-clinics', clinicController.getAllClinics)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)
    router.put('/api/edit-clinic', clinicController.handleEditClinic)
    router.delete('/api/delete-clinic', clinicController.handleDeleteClinic)
    router.get('/*', (req, res) => {
        const fileUrl = __dirname.split('src')[0]
        return res.sendFile(fileUrl + `/${req.params['0']}`)
    });

    app.use('/', router);
}

module.exports = initWebRoutes;