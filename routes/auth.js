const express = require('express')

const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")   //user er user auth er user needs to be same 
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requireLogin = require('../middleware/requireLogin')



// router.get('/', (req, res) => {
//     res.send("hello")
// })

//testing purpose
// router.get('/protected',requireLogin,(req,res) =>{
//     res.send("hello user")
// })

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please add all the fields " })
    }
    // res.json({message:"successfuly posted"})
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "user already exists with that email" })
            }
            bcrypt.hash(password, 12) //hash 12 means more secure than 10 deafult 
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password:hashedpassword,
                        name
                    })

                    user.save()
                        .then(user => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(error => {
            console.log(err)
        })
})

router.post('/signin',(req,res)=>{
    const {email,password} =req.body
    if(!email || !password){
        res.status(422).json({error:"please add eamil or password"})
    }
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Credential Email or Password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // res.json({message:"successfully signed in "})
                //by token the user can access the protective resources 
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const{_id,name,email,followers,following} = savedUser
                res.json({token,user:{_id,name,email,followers,following}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"})

            }
        })
        .catch(err =>{
            console.log(err)
        })
    })
})

module.exports = router 