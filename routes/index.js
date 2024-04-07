const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

//User & Model
const User = require("../models/User")
const Habit = require("../models/Habit")

//Welcome Page GET
router.get("/", (req, res) => res.render("welcome"))

/* Not sure how to incorporate existing remembered habits with new dynamically added ones
* but probably going to make a temporary array with new habit objects to add after
* page is closed, or periodically make ajax requests to update database so that initial load
* will handle it
*/

//Dashboard GET
var email=""
router.get("/dashboard", async (req, res) => {
    try {
        email=req.query.user
        const user = await User.findOne({ email: req.query.user })
        const habits = await Habit.find({ email: req.query.user })
        

        //can also put data here for weekly tracking if added

        res.redirect("/new-dashboard.html")

    } catch (err) {
        console.error(err)
        res.status(500).send("Internal Server Error")
    }
})

//API: get user information
router.get("/GetUser", async (req, res) => {

    const user = await User.findOne({ email: email})

    const userJSON = JSON.stringify(user)
    res.send(userJSON)
})

//API: get values of user's habits' information
router.get("/GetHabits", async (req, res) => {

    const habits = await Habit.find({ email: email })

    const habitsJSON = JSON.stringify(habits)
    res.send(habitsJSON)
})

//API: add new habit to database
router.post("/AddHabit", async (req, res) => {
    var content = req.query.content
    var email = req.query.email
    Habit.findOne({ content: content, email: content }).then(habit => {
        if(habit) {
            //what to do if habit already exists
        } else {
            const newHabit = new Habit({ content, email })
            newHabit.save().then(habit => {
                console.log(habit)
            }).catch(err => console.log(err))
        }
    })
})

module.exports = router