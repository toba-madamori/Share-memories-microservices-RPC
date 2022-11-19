
const signupMailOptions = (email, link, firstname) => {
    const options = {}
    options.from = 'noreply@sharememories.com'
    options.to = email
    options.subject = 'Verification'
    options.text = `Hi, Welcome to Share-Memories, we're are very excited to have you join us.
    Just one more step to complete your registration, use this link to verify your account ${link}
    Yours truly
    The Share-Memories Team`
    options.html = `<p><b>Hello ${firstname}, Welcome to Share-Memories</b></p> 
                    <p>we're are very excited to have you join us</p>
                    <p>Just one more step to complete your registration, use the link below to verify your account</p>
                    <p><a href = "${link}" > Verify Your Account </a></p>
                    <hr>
                    <br>
                    If you're having trouble clicking the "Verify Your Account" button, copy and paste the URL below into your web browser: <br> 
                    <b>${link}</b>
                    <p>Best Regards, <br>
                    The Share-Memories Team</p>`

    return options
}

module.exports = {
    signupMailOptions
}
