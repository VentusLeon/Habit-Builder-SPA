const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

//User & Model
const User = require("../models/User")
const Habit = require("../models/Habit")

//Welcome Page GET
router.get("/", (req, res) => res.render("welcome"))

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
            //still needs logic here---------------
        } else {
            const newHabit = new Habit({ content, email })
            newHabit.save().then(habit => {
                console.log(habit)
                res.send(habit)
            }).catch(err => console.log(err))
        }
    })
})

router.post("/DeleteHabit", async (req, res) => {
    try {
        var id = req.query._id
        
        await Habit.deleteOne({ _id: new mongoose.Types.ObjectId(id)})
    } catch (error) {
        console.error(error)
    }
})

router.post("/FavoriteHabit", async (req, res) => {
    try {
        var id = req.query._id
        var favorite;
        await Habit.findOne({ _id: id }).then(habit => {
            favorite = habit.favorite
        })
        await Habit.findOneAndUpdate(
            { _id: id },
            { $set: {favorite: !favorite}}
        )
    } catch (error) {console.error(error)}
})

module.exports = router