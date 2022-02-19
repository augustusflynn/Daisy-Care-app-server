require('dotenv').config()
const nodemailer = require("nodemailer");

let sendEmailSync = async (recieveData) => {
	const { recieverEmail, patientName, time, doctorName, redirectLink, language } = recieveData

	let transporter = nodemailer.createTransport({
		service: 'gmail',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_APP, // generated ethereal user
			pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: '"Augustus Flynn 👻" <huytung139@gmail.com>', // sender address
		to: recieverEmail, // list of receivers
		subject: "Verifying booking schedule from Daisy Care ✔", // Subject line
		html: getHTMLContent(recieveData), // html body
	});
}

let getHTMLContent = (recieveData) => {
	const { language, reciverEmail, time, doctorName, patientName, redirectLink } = recieveData
	if (language === "vi") {
		return (`
	    	<h3>Xin chào ${patientName}!</h3>
			<h4>Tại sao bạn nhận được email này?</h4>
			<p>Đây là email từ hệ thống Daisy Care, bạn đã đặt lịch khám trên trang web của chúng tôi.</p>
			<h4>Thông tin đặt lịch</h4>
			<div>Thời gian: ${time}</div>
			<div>Tên bác sĩ: ${doctorName}</div>

			<p>Nếu những thông tin trên hoàn toàn là sự thật, vui lòng bấm vào đường link bên dưới để hoàn thành đặt lịch khám bệnh!</p>
	
			<span style="border-radius: 3px; padding: 10px 8px;  background-color: #23887c;">
				<a href=${redirectLink} target="_blank" style="text-decoration: none; padding: 10px 8px; color: #fff; font-weight: 600;">Hoàn tất đặt lịch khám bệnh</a>
			</span>
			<p>Cảm ơn quý khách vì đã tin tưởng Daisy Care!<br/>Chúc bạn một ngày tốt lành, ${patientName}.</p>
		`)
	}
	if (language === 'en') {
		return (`
	    	<h3>Dear ${patientName}!</h3>
			<h4>Why you recieve this email ?</h4>
			<p>This email is from Daisy Care's system, you have booked schedule on our site.</p>
			<h4>Information of your schedule</h4>
			<div>Time: ${time}</div>
			<div>Doctor name: ${doctorName}</div>

			<p>If all informations are true, please click on the link below to complete the medical examination</p>
			<div>

			<span style="border-radius: 3px;  background-color: #23887c;">
				<a href=${redirectLink} target="_blank" style="text-decoration: none; padding: 10px 8px; color: #fff; font-weight: 600;">Verifying booking schedule</a>
			</span>
			<p>Thanks for choosing Daisy Care!<br/>Have a good day, ${patientName}.</p>
		`)
	}
}

let sendEmailRemedy = (recieveData) => {
	return new Promise(async(resolve, reject) => {

		try {
			const { recieverEmail, language, image, patientName, patientId } = recieveData

			let transporter = nodemailer.createTransport({
				service: 'gmail',
				port: 587,
				secure: false, // true for 465, false for other ports
				auth: {
					user: process.env.EMAIL_APP, // generated ethereal user
					pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
				},
			});

			// send mail with defined transport object
			let info = await transporter.sendMail({
				from: '"Augustus Flynn 👻" <huytung139@gmail.com>', // sender address
				to: recieverEmail, // list of receivers
				subject: "Examination results from Daisy Care ✔", // Subject line
				html: getHTMLContentRemedy(recieveData), // html body
				attachments: [
					{   // encoded string as an attachment
			            filename: `remedy-${patientId}-${new Date().getTime()}.png`,
			            content: image.split('base64,')[1],
			            encoding: 'base64'
			        }
				]
			});
			resolve();
		} catch(e) {
			resolve(e);
		}
	})
} 

const getHTMLContentRemedy = (data) => {
	const { language, patientName } = data
	if (language === "vi") {
		return (`
	    	<h3>Xin chào ${patientName}!</h3>
			<h4>Tại sao bạn nhận được email này?</h4>
			<p>Đây là email từ hệ thống Daisy Care, bạn đã đặt lịch khám trên trang web của chúng tôi.</p>
			<h4>Thông tin hóa đơn/đơn thuốc được gửi trong tệp đính kèm.</h4>

			<p>Cảm ơn vì đã tin tưởng Daisy Care!<br/>Chúc bạn một ngày tốt lành.</p>
		`)
	}
	if (language === 'en') {
		return (`
	    	<h3>How are you today, ${patientName}?</h3>
			<h4>Why you recieve this email ?</h4>
			<p>This email is from Daisy Care's system, you have booked schedule on our site.</p>
			<h4>Information of your bill/remedy is attached inside the file</h4>

			<p>Thanks for using Daisy's Care service!<br/>Have a good day Adam/Eva.</p>
		`)
	}
}

module.exports = {
	sendEmailSync,
	sendEmailRemedy
}