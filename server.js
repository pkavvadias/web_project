const helper = require('./helper')
const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const apis = require('./apis')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const bcrypt = require('bcrypt')
const authentication = require('./passportCf')
const app = express()
const port = 3000

authentication.initialize(passport);
const Authenticated = authentication.Authenticated;
const NotAuthenticated = authentication.NotAuthenticated;
const isAdmin = authentication.isAdmin;
app.use(express.static('frontend'))



app.use(session({
    secret: 'usersession',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '100mb' }));



app.get('/', function(req, res) {
    res.send('Hello World!')
})

app.get("/register", Authenticated, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/signup.html"));

})

app.get("/login", Authenticated, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/login.html"));
})


app.get("/dashboard", NotAuthenticated, function(req, res) {
    // Is he really authenticated? True is yes.
    console.log(req.isAuthenticated());
    res.sendFile(path.join(__dirname + "/frontend/dashboard.html"));
})

app.get('/logout', function(req, res) {
    req.logOut();
    //req.flash('success_msg', "Logged Out")
    res.redirect('./login')

})

app.get("/userprofile", NotAuthenticated, function(req, res) {
    console.log('geia')
    res.sendFile(path.join(__dirname + "/frontend/userprofile.html"));

})

app.post('/uploadHar', NotAuthenticated, apis.uploadHar);
app.post('/login', authentication.login);
app.post("/register", authentication.register);
app.post("/userprofile", NotAuthenticated, apis.updateUser);
app.get("/getadmindata",isAdmin,apis.getAdminData);
app.listen(port, '0.0.0.0') //To run on all available interfaces