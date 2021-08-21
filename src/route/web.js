import express from 'express'
import homeController from '../controllers/home.controller'
import userController from '../controllers/user.controller';
import doctorController from '../controllers/doctor.controller'
import patientController from '../controllers/patient.controller'
import specialtyController from '../controllers/specialty.controller'
import clinicController from '../controllers/clinic.controller'

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/',   homeController.getHomePage)
    router.get('/crud',   homeController.getCRUD)

    router.post('/post-crud',   homeController.postCRUD)
    router.get('/get-crud',   homeController.displayGetCRUD)
    router.get('/edit-crud',   homeController.getEditCRUD)
    router.post('/put-crud',   homeController.putCRUD)
    router.get('/delete-crud',   homeController.deleteCRUD)


    router.post('/api/login', userController.handleLogin)
    router.post('/api/register', userController.handleCreateUser)

    router.get('/api/get-all-users', userController.handleGetUsers)
    router.post('/api/create-new-user', userController.handleCreateUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)
    router.get('/api/allcode', userController.getAllCode)

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
    
    router.post('/api/create-a-new-clinic', clinicController.createClinic)
    router.get('/api/get-top-clinics-home', clinicController.getTopClinicHome)
    router.get('/api/get-all-clinics', clinicController.getAllClinics)
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById)


    app.use('/', router);
}

module.exports = initWebRoutes;