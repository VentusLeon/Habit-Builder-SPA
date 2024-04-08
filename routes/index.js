const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

//User & Habit models
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
            habit.content = habit.content + " #2"
        } else {
            const newHabit = new Habit({ content, email })
            newHabit.save().then(habit => {
                console.log(habit)
                res.send(habit)
            }).catch(err => console.log(err))
        }
    })
})

//API: delete habit from database
router.post("/DeleteHabit", async (req, res) => {
    try {
        var id = req.query._id
        
        await Habit.deleteOne({ _id: new mongoose.Types.ObjectId(id)})
    } catch (error) {
        console.error(error)
    }
})

//API: toggle status of 'favorite' for given habit
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

router.post("/ToggleComplete", async (req, res) => {
    try {
        var id = req.query._id
        var complete;
        await Habit.findOne({_id: id }).then(habit => {
            complete = habit.complete
        })
        await Habit.findOneAndUpdate(
            { _id: id },
            { $set: {complete: !complete}}
        )
    } catch (err) {console.error(err)}
})

//API: delete habits older than 24 hrs upon page load
router.post("/DeleteOutdated", async (req, res) => {
    try {
        //Establishing time 24 hours ago from page load
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

        //Delete documents with timestampe over 24 hours old
        const result = await Habit.deleteMany({ createdAt: { $lt: twentyFourHoursAgo } })
        res.json({ deletedCount: result.deletedCount })
    } catch (err) { console.error(err) }
})





module.exports = router