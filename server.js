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





app.get("/register", Authenticated, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/signup.html"));

})

app.get("/login", Authenticated, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/login.html"));
})

app.get("/admin", isAdmin, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/dashboard-admin.html"));
})


app.get("/dashboard", NotAuthenticated, function(req, res) {
    // Is he really authenticated? True is yes.
    console.log(req.isAuthenticated());
    res.sendFile(path.join(__dirname + "/frontend/dashboard-user.html"));
})

app.get('/logout', function(req, res) {
    req.logOut();

    res.redirect('./login')

})
app.get("/updateuser", NotAuthenticated, function(req, res) {
    console.log('geia')
    res.sendFile(path.join(__dirname + "/frontend/userprofile.html"));

})

app.get("/basicInfos", isAdmin, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/basicInfos.html"));
})

app.get("/responseTimes", isAdmin, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/responseTimes.html"));
})

app.get("/httpHeaders", isAdmin, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/httpHeaders.html"));
})

app.get("/flowmap", isAdmin, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/flowmap.html"));
})


app.get("/userprofile1", NotAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/userprofile1.html"));
})



app.get("/heatmap", NotAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/heatmap.html"));
})




app.post('/uploadHar', NotAuthenticated, apis.uploadHar);
app.post('/login', authentication.login);
app.post("/register", authentication.register);
app.post("/userprofile", NotAuthenticated, apis.updateUser);
app.get("/getadmindata", isAdmin, apis.getAdminData);
app.get("/getresponsetimes", isAdmin, apis.getResponseTimes);
app.get("/getserverips", isAdmin, apis.getServerIPs);
app.get("/headeranalysis", isAdmin, apis.headerAnalysis);
app.get("/visitedips", NotAuthenticated, apis.getUserAddresses);
app.get("/getuserstats", NotAuthenticated, apis.getUserStats);
app.listen(port, '0.0.0.0') //To run on all available interfaces