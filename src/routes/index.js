const { Router } = require('express')
const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const router = Router()

router.post('/send-email', (req, res) => {
	const { name, email, phone, message, to } = req.body

	const contentHtml = `
    <h1>Formulario de Nodemailer</h1>
    <ul>
        <li>name: ${name}</li>
        <li>email: ${email}</li>
        <li>phone: ${phone}</li>
    </ul>
    <p>${message}</p>
    `

	const CLIENT_NAME = process.env.CLIENT_NAME
	const CLIENT_ID = process.env.CLIENT_ID
	const CLIENT_SECRET = process.env.CLIENT_SECRET
	const REDIRECT_URI = process.env.REDIRECT_URI
	const REFRESH_TOKEN = process.env.REFRESH_TOKEN

	const oAuth2Client = new google.auth.OAuth2(
		CLIENT_ID,
		CLIENT_SECRET,
		REDIRECT_URI
	)

	oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

	const sendMail = async () => {
		try {
			const accessToken = await oAuth2Client.getAccessToken()
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: CLIENT_NAME,
					clientId: CLIENT_ID,
					clientSecret: CLIENT_SECRET,
					refreshToken: REFRESH_TOKEN,
					accessToken,
				},
			})
			const mailOptions = {
				from: `Pagina web Nodemailer ${CLIENT_NAME}`,
				to: to,
				subject: 'Nodemailer prueba',
				html: contentHtml,
			}

			return await transporter.sendMail(mailOptions)
		} catch (error) {
			console.log(error)
			throw new Error('Error al enviar email')
		}
	}

	sendMail()
		.then((result) => res.status(200).send('Enviado'))
		.catch((error) => console.log(error.message))
})

module.exports = router
