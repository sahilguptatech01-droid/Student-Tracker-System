const express = require('express');

const cors = require('cors');

const mongoose = require('mongoose');

const z = require('zod');

const jwt = require('jsonwebtoken');

const app = express();
const dotenv = require("dotenv");

dotenv.config();

const SECRET_KEY=process.env.SECRET_KEY ;

app.use(express.json());

app.use(cors())

const { userModel, adminModel, feeModel } = require('./models');

const { authMiddleware } = require('./middleware')


// Create sdmin

app.post('/api/create_admin',async(req,res)=>{

    const name=req.body.name;
    const phone_no=req.body.phone_no;
    const password=req.body.password;
    const existingAdmin = await adminModel.findOne({ phone_no });

    console.log(existingAdmin)
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const newAdmin = await adminModel.create({
      phone_no,
      password,
    });


    res.status(201).json({
      message: "Admin created successfully",

    });

})


// Admin login

app.post('/api/admin_login', async (req, res) => {
    const LoginSchema = z.object({
        name: z.string(),
        phone_no: z.string().length(10, "Number must be exactlys 10 digits"),
        password: z.string().length(6)
    })
    const data = LoginSchema.safeParse(req.body);
    if (!data.success) {
        return res.json({
            message: "Fill Detail correctly"
        })
    }


    const name = data.data.name;
    const phone_no = data.data.phone_no;
    const password = data.data.password;
    const adminExists = await adminModel.findOne({
        phone_no: phone_no,
        password: password
    })


    if (adminExists) {

        const userId = adminExists._id


        const token = jwt.sign({
            userId: userId
        }, SECRET_KEY)

        return res.json({

            token: token

        })

    } else {
        return res.json({
            message: "User Not exists"
        })
    }





})


// Add student

app.post('/api/add_student', authMiddleware, async (req, res) => {
    const StudentSchema = z.object({
        name: z.string(),
        phone_no: z.string().length(10)

    })
    const data = StudentSchema.safeParse(req.body)
    if (!data.success) {
        return res.status(400).json({
            message: "Invalid input"
        });
    }


    const name = data.data.name;
    const phone_no = data.data.phone_no;
    const existingUser = await userModel.findOne({

        phone_no: phone_no,

    })


    if (existingUser) {
        return res.status(403).json({
            message: "User with this name already exists"
        })

    } else {

        const newUser = await userModel.create({
            name: name,
            phone_no: phone_no,
            admin_id: new mongoose.Types.ObjectId(req.id)

        })
        return res.status(200).json({
            message: "Student added successfully"
        })
    }
})


// Get all Students related admin_id

app.get('/api/students', authMiddleware, async (req, res) => {
    const admin_id = req.id
    const students = await userModel.find({
        admin_id: admin_id
    })
    return res.json({
        data: students

    })
})



app.post('/api/fees', authMiddleware, async (req, res) => {
    const feeSchema = z.object({
        phone_no: z.string().length(10),
        amount: z.coerce.number().positive(),
        month: z.enum([
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ])

    })
    const data = feeSchema.safeParse(req.body);
    if (!data.success) {
        return res.json({
            message: "Invalid Schema"
        })
    }

    const phone_no = data.data.phone_no;
    const amount = data.data.amount;
    const month = data.data.month;
    const student = await userModel.findOne({
        phone_no
    })
    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }
    const studentId = student._id;
    const name = student.name;
    const feePaid = await feeModel.exists({
        phone_no,
        month
    })
    if (feePaid) {
        return res.json({
            message: "fees already paid for this month"
        })
    }

    const fees = await feeModel.create({
        studentId,
        name,
        month,
        amount,


    })

    return res.json({
        message: `Month ${month} student ${student.name} fees successfully paid`
    })

})

app.get('/api/fees_detail/:year', authMiddleware, async (req, res) => {
    try {
        // ✅ Convert year to number (important)
        const year = Number(req.params.year);


        const detail = await feeModel.find({
            year: year,

        });


        return res.json({
            data: detail
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server error"
        });
    }
});





app.listen(3000, () => {
    console.log("Server is running on port 3000")
})