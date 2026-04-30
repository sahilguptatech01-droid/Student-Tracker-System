const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URL = process.env.MONGO_URL ;

mongoose.connect(MONGO_URL);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone_no: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, // basic 10-digit validation
    },
    admin_id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Admin",
    

    }
    
    
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const adminSchema=new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone_no: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, // basic 10-digit validation
    },
    password:{
      type:String,
      required:true,
      unique:true
    }
  },
  {
  timestamps:true,
  }
);




const feeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name:{
      type:String,
    },

    month: {
      type: String,
      enum: [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
      ],
      required: true,
    },

    year: {
      type:Number,
      default:()=>new Date().getFullYear()    
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [ "paid"],
      default: "paid",
    },

    paymentDate: {
      type: Date,
      default:Date()
    },



  },
 
);



const feeModel = mongoose.model("Fee", feeSchema)
const userModel=mongoose.model("User", userSchema);
const adminModel=mongoose.model("Admin",adminSchema)

module.exports = {
    userModel:userModel,
    adminModel:adminModel,
    feeModel:feeModel,
}