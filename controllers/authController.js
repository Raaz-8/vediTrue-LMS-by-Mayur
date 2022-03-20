const User = require('../models/user');
const Task = require('../models/tasks');

const jwt =require('jsonwebtoken');
const path = require('path');

//handle errors
const handleErrors=(err)=>{
    console.log(err.message,err.code);
    let errors={email:'',password:''};

    //
    if(err.message==='Incorrect Email'){
        errors.email='That Email is not registered';
    }

    if(err.message==='Incorrect Password'){
        errors.password='That Password is Incorrect';
    }

    //duplicate error
    if(err.code===11000){
        errors.email='that email is already exist'
        return errors;
    }
    

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken=(id)=>{
    return jwt.sign({id},'Mt Secret',{
        expiresIn:maxAge
    });
}

module.exports.signup_get =(req,res)=>{
    res.render('signup',{title:'Signup'});
}

module.exports.login_get =(req,res)=>{
    res.render('login',{title:'Login'});
}

module.exports.signup_post = async (req,res)=>{
    const {file, fullname, email, password} = req.body;

    try{
        const user = await User.create({email, password,file, fullname});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly: true , maxAge:maxAge * 1000});
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors= handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req,res)=>{

    const {email,password} = req.body;

    try{
        const user = await User.login(email,password);
        // res.status(200).json({user:user._id})
        const token = createToken(user._id);

        res.cookie('jwt',token,{httpOnly: true , maxAge:maxAge * 1000});
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err); 
        res.status(400).json({ errors });
    }
}

module.exports.logout_get=(req, res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');   
}               

module.exports.update_put = async (req, res) => {
    const {email, password, fullname}=req.body;
    try {
   await User.findOneAndUpdate({email:email},{email, password, fullname});
  
    } catch (err) {
      res.status(400).json({ errors:"User Profile Could not be updated" });
    }
  }

