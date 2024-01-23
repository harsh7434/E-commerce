const Admin = require('../models/admin');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// check Login
module.exports.checklogin = async(req,res)=>{
    return res.redirect('/admin/deshboard');
}

// deshboard
module.exports.deshboard = async (req, res) => {
    return res.render("deshboard");
}


// add admin
module.exports.add_admin = async (req, res) => {
    return res.render("add_admin")
}

// add data
module.exports.addAdminData = async (req, res) => {
    try {
        var imagePath = '';
        req.body.role = 'admin';
        req.body.isActive = true;
        req.body.create_date = new Date().toLocaleString();
        req.body.updated_date = new Date().toLocaleString();
        if (req.file) {
            imagePath = Admin.imageAdminPath + "/" + req.file.filename;
        }
        req.body.adminImage = imagePath;
        let addData = await Admin.create(req.body);
        if (addData) {
            console.log("Data Insert successfuly");
            return res.redirect("/admin/add_admin");
        }
        else {
            console.log("Data Not Inserted");
            return res.redirect("/admin/add_admin");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}


// view Data
module.exports.view_admin = async (req, res) => {
    try {
        let search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        if (req.query.page) {
            page = req.query.page;
        }
        else {
            page = 0;
        }

        var parpage = 2;
        let totaladmindata = await Admin.find({
            $or: [

                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "gender": { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        }).countDocuments();
        let data = await Admin.find({
            $or: [

                { "name": { $regex: ".*" + search + ".*", $options: "i" } },
                { "email": { $regex: ".*" + search + ".*", $options: "i" } },
                { "gender": { $regex: ".*" + search + ".*", $options: "i" } }
            ]
        })
            .limit(parpage)
            .skip(parpage * page);
        return res.render("view_admin", {
            adminData: data,
            cpage : page,
            search : search,
            totaldoc: Math.ceil(totaladmindata / parpage)
        });
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

// de-active data
module.exports.setDeactive = async (req, res) => {
    try {
        if (req.params.id) {
            let activeData = await Admin.findByIdAndUpdate(req.params.id, { isActive: false });

            if (activeData) {
                console.log("Data is Deactive");
                return res.redirect("back");
            }
            else {
                console.log("Data is Active");
                return res.redirect("back");
            }
        }
        else {
            console.log("Params is Not Found!!!");
            return redirect("back");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}


// active data
module.exports.setActive = async (req, res) => {
    try {
        if (req.params.id) {
            let activeData = await Admin.findByIdAndUpdate(req.params.id, { isActive: true });

            if (activeData) {
                console.log("Data is Active");
                return res.redirect("back");
            }
            else {
                console.log("Data is Deactive");
                return res.redirect("back");
            }
        }
        else {
            console.log("Params is Not Found!!!");
            return redirect("back");
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

// delete data
module.exports.deleteAdminData = async (req, res) => {
    try {
        let oldData = await Admin.findById(req.params.id);
        if (oldData) {
            var oldImage = oldData.adminImage;
            if (oldImage) {
                let FullPath = path.join(__dirname, "..", oldData.adminImage);
                await fs.unlinkSync(FullPath);
            }
        }
        else {
            console.log("Image Path is Worng");
            return res.redirect("back");
        }
        await Admin.findByIdAndDelete(req.params.id);
         return res.redirect("back");
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

// update page
module.exports.updateAdminData = async (req, res) => {
    try{
        let record = await Admin.findById(req.params.id);
        return res.render("update_admin", {
            up: record,
        });
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// Edit update data
module.exports.EditAdminData = async (req, res) => {
    try{
        let oldData = await Admin.findById(req.body.EditId);
        req.body.isActive = true;
        req.body.updated_date = new Date().toLocaleString();
        if (req.file) {
            if (oldData.adminImage) {
                let FullPath = path.join(__dirname, "..", oldData.adminImage);
                await fs.unlinkSync(FullPath);
            }
            var imagePath = '';
            imagePath = Admin.imageAdminPath + "/" + req.file.filename;
            req.body.adminImage = imagePath;
        }
        else {
            req.body.adminImage = imagePath;
        }
        await Admin.findByIdAndUpdate(req.body.EditId, req.body);
        return res.redirect("view_admin")
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// delete All
module.exports.deleteAllAdmin = async (req, res) => {
    try {
        await Admin.deleteMany({ _id: { $in: req.body.deleteall}});
        return res.redirect('back')
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

// forgotten PassWord
module.exports.checkmail = async(req,res)=>{
    try {
        let emaildata = await Admin.findOne({email:req.body.email});
        if(emaildata){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                  user: "paghadalavadhpaghadalavadh607@gmail.com",
                  pass: "xogrladxjjpwpmhe",
                },
              });
              
              let otp = Math.floor(Math.random()*90000)+10000;
              res.cookie('otp',otp);
              res.cookie('email',emaildata.email);
              const info = await transporter.sendMail({
                from: 'paghadalavadhpaghadalavadh607@gmail.com', // sender address
                to: "paghadalavadhpaghadalavadh607@gmail.com", // list of receivers
                subject: "OTP", // Subject line
                text: "Hello world?", // plain text body
                html: `<b>OTP HERE : ${otp}</b>`, // html body
              });

              if(info){
                 return res.redirect("otp_page");
              }
              else{
                console.log("OTP is not genarate");
                return res.redirect("back");
              }
        }
        else{
            console.log("Email is not found");
            return res.redirect("back");
        }
    } 
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.checkotp = async(req,res)=>{
    try{
        if(req.body.otp == req.cookies.otp){
            return res.redirect('resetPass');
        }
        else{
            console.log("OTP is not match");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.verifyPass = async(req,res)=>{
    try{
        if(req.body.npass == req.body.cpass){
            let email = req.cookies.email;
            let checkemail = await Admin.findOne({email:email});
            if(checkemail){
                let resetPass = await Admin.findByIdAndUpdate(checkemail.id,{password:req.body.npass})
                if(resetPass){
                    res.clearCookie('otp');
                    res.clearCookie('email');
                    return res.redirect("/admin/");
                }
                else{
                    console.log("Password not match");
                    return res.redirect('back');
                }
            }
            else{
                console.log("Record not found");
                return res.redirect('back');
            }
        }
        else{
            console.log("New password and confirm password not match");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}

// profile
module.exports.profile = async(req,res)=>{
    return res.render("profile");
}

module.exports.EditprofileData = async(req,res)=>{
    try{
        let oldData = await Admin.findById(req.body.EditId);
        req.body.isActive = true;
        req.body.update_date = new Date().toLocaleString();
        if (req.file) {
            if (oldData.adminImage) {
                let FullPath = path.join(__dirname, "..", oldData.adminImage);
                await fs.unlinkSync(FullPath);
            }
            var imagePath = '';
            imagePath = Admin.imageAdminPath + "/" + req.file.filename;
            req.body.adminImage = imagePath;
        }
        else {
            req.body.adminImage = imagePath;
        }
        await Admin.findByIdAndUpdate(req.body.EditId, req.body);
        return res.redirect("profile")
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}


// change password
module.exports.changepassword = async(req,res)=>{
    try{
        let adminRecord = req.user;
        if(adminRecord.password == req.body.password){
            if(req.body.password != req.body.newpassword){
                if(req.body.newpassword == req.body.confirmpassword){
                    let allAdmin = await Admin.findById(adminRecord._id);
                    if(allAdmin){
                        let editPass = await Admin.findByIdAndUpdate(allAdmin.id,{'password':req.body.newpassword});
                        if(editPass){
                            return res.redirect("/admin/logout");
                        }
                        else{
                            console.log("Password is not change");
                        }
                    }
                    else{
                        console.log("Record not found");
                    }
                }
                else{
                    console.log("New and Confirm password is not match");
                }
            }
            else{
                console.log("Current and New password is same");
            }
        }
        else{
            console.log("Current password is not match");
        }
    }
    catch(err){
        console.log(err);
        return res.redirect("back");
    }
}