const mongoose = require("mongoose")

const HabitSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    favorite: {
        type: Boolean,
        default: false
    },
    complete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Habit = mongoose.model("Habit", HabitSchema)

module.exports = Habit