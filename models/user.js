const mongoose = require('mongoose');
const {isEmail} =require('validator');
const bcrypt =  require('bcrypt');


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true, 'Please Enter an Email'],
        unique:true,
        lowercase:true,
        validate:[isEmail, 'Please Enter a valid email']
    },
    password:{
        type: String,
        required:[true, 'Please Enter an Password'],
        minlength:[6,'Enter Minimum 6 characters']
    },
    file:{
        type: String,
        required:true,
    },
    fullname:{
        type: String,
        required:true,
    },
})

// userSchema.post('save',function(doc, next) {
//     console.log('new User was created & Saved',doc);
//     next();
// });

userSchema.pre('save',  async function(next) {
    const salt = await bcrypt.genSalt();
    // this.file = await bcrypt.hash(this.file, salt);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}

const User = mongoose.model('user',userSchema);

module.exports= User;