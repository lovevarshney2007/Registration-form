import nodemailer from "nodemailer";

const sendRegisterationEmail = async(to,name) => {
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: `"Cloud Computing Cell AKGEC" <${process.env.EMAIL_USER}>`,
            to,
            subject: "✅ Registration Confirmed for SPOCC’25",
            html:`
            <div style="font-family:Arial;padding:20px;">
          <h2>Hi ${name},</h2>
          <p>🎉 You have successfully registered for the <b>CCC Event - SPOCC’25</b>.</p>
          <p>We’re excited to see you soon!</p>
          <hr/>
          <p>Best Regards,<br/>Cloud Computing Cell AKGEC</p>
        </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    }
    catch(error){
        console.error("Email sending Failed: ",error.message);
    }
};

export {
    sendRegisterationEmail
}