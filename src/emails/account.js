const sgMail = require('@sendgrid/mail')

// to set up an environment for the API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mail@sanjaysekarsamuel.com',
        subject: 'Welcome to the Task manager app!',
        text: `Welcome to the app, ${name}. Please feel free to contact me regarding any queries about the app`

    })
}


const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'mail@sanjaysekarsamuel.com',
        subject: 'We are sorry to see you go! :(',
        text: `Hello, ${name}. We are sad that you are leaving us. Please, let us know why you decided to quit so that we could upgrade to serve better in the future`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}