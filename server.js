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



/*
*                 Next thing to work on is to watch the client side portion of Art of Engineer video
*                 and then figure out from that how to connect node.js backend to front end vue.js.
*                 
*
*
*                 ALSO need to implement testing after basic project structure is setup. 
*                 Then, watch rest of Vue.js Course by freeCodeCamp and then implement final features.
*
*                 GOOD JOB ANOTHA GRIND AWAITS
*/


app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))

app.listen(3000, () => {
    console.log("Listening on port %s", 3000)
})