const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const multer = require("multer")
const session = require("express-session")
const path = require("path")

const app = express()

//Cors

//DB
const db = require(path.join(__dirname, "/config/keys.js")).MongoURI

//Mongoose Connection
mongoose.connect(db).then(() => console.log("Connected to MongoDB successfully!"))
.catch(err => console.log(err))

//Expression
app.use(express.static(path.join(__dirname, "public")))
app.use("/assets", express.static("./assets"))


//EJS
app.set("view engine", "ejs")

//BodyParser
app.use(express.urlencoded( { extended: false } ))

//Express Session
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true
    })
)



app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))

app.listen(3000, () => {
    console.log("Listening on port %s", 3000)
})