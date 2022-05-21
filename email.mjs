import nodemailer from 'nodemailer';
import 'dotenv/config' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
//import express from 'express'

function sendemail(email, court, time, error){

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'tickreminder@gmail.com',
        pass: process.env.EMAILPASSWORD
        }
    
    });

    var mailOptions1 = {
        from: 'tickreminder@gmail.com',
        to: email, //need to change this to user's friends somehow
        subject: 'tennis signed up',
        text: 'you signed up for court '+court+' at '+time
    };

    var mailOptions2 = {
        from: 'tickreminder@gmail.com',
        to: email, //need to change this to user's friends somehow
        subject: 'error tennis signed up',
        text: 'there was an error signing up for court'
    };

    let emailoption
    if(error){
        emailoption = mailOptions2
    }else{
        emailoption = mailOptions1
    }

    transporter.sendMail(emailoption, function(err, data){ // the function needed to export i think
        if (err) {
        console.log('Error', err)
        } else {
        console.log('Email sent')
        }
    })

}

export default sendemail;
//sendemail('stephen382012@hotmail.com', '1', '10:00', false);