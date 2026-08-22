const mongoose =require("mongoose");
const userschema =mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is Required"],
        trim:true,
        
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
        trim:true,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user",
    },
    confirmPassword:{
        type:String,
        required:[true,"Confirm Password is Required"],
        trim:true,
    },
    isActive:{
        type:Boolean,
        default:false,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    updatedAt:{
        type:Date,
        default:Date.now(),
    },
    image: {
    type: String,
    default: null
},
}, 
{
timestamps: true,
versionKey: false
}    
)
const User = mongoose.model("user",userschema)
module.exports = User;