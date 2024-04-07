const express = require("express")
const router = express.Router()

//User Model
const User = require("../models/User")

//Login Page GET
router.get("/login", (req, res) => res.render("login"))

//Register Page GET
router.get("/register", (req, res) => res.render("register"))

//Register POST Handling
router.post("/register", (req, res) => {
    const { name, email } = req.body

    //Error Checking
    let errors = []
    if(!name || !email){
        errors.push({ msg: "please enter all fields" })
    }

    if(errors.length > 0) {
        res.render("register", {
            errors, name, email
        })
    } else {
        //Validated Successfully/No Errors in errors array
        User.findOne({ email: email}).then(user => {
            if(user) {
                //User exists already
                errors.push({ msg: "Email ID already exists" })
                res.render("register", {
                    errors, name, email
                })
            } else {
                const newUser = new User({ name, email })

                //Save User
                newUser.save().then(user => {
                    res.redirect("/users/login")
                }).catch(err => console.log(err))
            }
        })
    }
})

//Login handling
router.post("/login", (req, res) => {
    const { name, email } = req.body
    //Checking database
   
    User.findOne({ email: email }).then(user => {
        if(!user) {
            let errors = []
            errors.push({ msg: "This email is not registered"} )
            res.render("login", { errors, name, email } )
        } else {
            
           res.redirect(`/dashboard?user=${user.email}`) //This url needs to end up in Vue
        }
    })
})

router.get("/logout", (req, res) => {
    res.redirect("/users/login")
})

module.exports = router