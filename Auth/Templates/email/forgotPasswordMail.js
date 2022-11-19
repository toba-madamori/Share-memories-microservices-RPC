const resetPasswordOptions = (email, link, name) => {
    const options = {}
    options.from = 'noreply@sharememories.com'
    options.to = email
    options.subject = 'Reset Password'
    options.text = `Hi, You asked to reset your password.
    Please click this link to reset your password.
    ${link}  
    Please note the link expires in 15-minutes.
    Yours truly
    The Share-Memories Team`
    options.html = `<p><b>Hello ${name}</b></p> 
                    <p>You requested a password reset on your Share-Memories account <br>
                    Please click the button below to set a new password.</p>
                    <p><a href = "${link}" > Reset Password </a></p>
                    <p>If you did not initiate this request, please ignore this email and contact our Support Team immediately.</p>
                    <hr>
                    <br>
                    If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser: <br> 
                    <b>${link}</b>
                    <p>Best Regards, <br>
                    The Share-Memories Team</p>`

    return options
}

module.exports = {
    resetPasswordOptions
}
