const helper = require('./helper')
const express = require('express')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const db = require('./apis')
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const flash = require('connect-flash')
const path = require('path')
const bcrypt = require('bcrypt')
const initializePass = require('./passportCf')
const app = express()
const port = 3000

initializePass(passport);
app.use(express.static('frontend'))



app.use(session({
    secret: 'usersession',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())



app.use(flash())
app.use(function(req, res, next) {
    res.locals.message = req.flash();
    next();
});

app.use(cors())

//app.use('/', routes)
//require('./passport.js')(passport)
//app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '100mb' }));



app.get('/', function(req, res) {
    res.send('Hello World!')
})

app.get("/register", Authenticated, function(req, res) {
    res.sendFile(path.join(__dirname + "/frontend/signup.html"));

})

app.get("/login", Authenticated, function(req, res) {
    //console.log(req.session.flash.error)
    res.sendFile(path.join(__dirname + "/frontend/login.html"));
})


app.get("/dashboard", NotAuthenticated, function(req, res) {
    // Is he really authenticated? True is yes.
    console.log(req.isAuthenticated());
    res.sendFile(path.join(__dirname + "/frontend/dashboard.html"));
})

app.get('/logout', function(req, res) {
    req.logOut();
    req.flash('success_msg', "Logged Out")
    res.redirect('./login')

})


app.post("/register", async function(req, res) {
    let { username, email, password, password_conf } = req.body;
    console.log({
        username,
        email,
        password
    });

    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);


    await helper.pool.query(
        'SELECT * FROM users WHERE username = $1', [username],
        (err, results) => {
            if (err) {
                throw err;
            }

            console.log(results.rows)
                //} catch (err) {
                //  console.log('failed to connect', err);


            if (results.rows.length > 0) {
                console.log("Uparxei xristis");
                // req.flash('error', "")
                //res.redirect('./login')
                res.status(400).send('User is already registered. Proceed to log in or create new user.');
                // res.sendFile(path.join(__dirname + "/frontend/login.html"));
            } else {
                console.log("Den uparxei xristis");
                helper.pool.query(
                    'INSERT INTO  users VALUES ($1, $2, $3) RETURNING username, password', [username, email, hashedPassword],
                    (err, results) => {
                        if (err) {
                            throw err;
                        }
                        console.log(results.rows);
                        req.flash('success_msg', 'Registered!!!! Log in now!');
                        res.redirect("./login")

                    }
                );
            }
        }


    );
});

/*
app.post("/login", urlencodedParser, (req, res) =>
    passport.authenticate('local', {
        successRedirect: "/dashboard",
        failureRedirect: "/login",
        failureFlash: 'Invalide username or passsword'
    })
    (req, res)
);
*/
app.post('/login', function(req, res, next) {
  console.log(req.body);
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {res.status(403).send("Wrong username or password"); }
    else{
    req.logIn(user, function(err) {
      if (err) { return next(err); }   
      res.redirect("./dashboard");
    });
  }
  })(req, res, next);
});

function Authenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("./dashboard");        
    }
    next();
}

function NotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("./login");
}

app.post('/uploadHar', NotAuthenticated,db.uploadHar)
//app.post('/uploadHar',db.uploadHar)
app.listen(port, '0.0.0.0') //To run on all available interfaces