const LocalStrategy = require("passport-local").Strategy;
const helper = require('./helper')
const bcrypt = require("bcrypt");
const passport = require('passport')

function initialize(passport) {
    console.log("Initialized");

    const authenticateUser = (username, password, done) => {
        console.log(username, password);
        helper.pool.query(
            'SELECT * FROM users WHERE username = $1', [username],
            (err, results) => {
                if (err) {
                    throw err;
                }
                // console.log(results.rows);

                if (results.rows.length > 0) {
                    // parsing the user to the user const
                    const user = results.rows[0];

                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            console.log(err);
                        }
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            //incorrect password
                            //response.send("error");
                            return done(null, false, { message: "Incorrect password." });
                        }
                    });
                } else {
                    // User doesnt exist
                    return done(null, false, {
                        message: "This username doesnt match any user."
                    });
                }
            }
        );
    };

    passport.use(
        new LocalStrategy({ usernameField: "username", passwordField: "password" },
            authenticateUser
        )
    );
    // Stores user details inside session. serializeUser determines which data of the user
    // object should be stored in the session. The result of the serializeUser method is attached
    // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
    //   the user username as the key) req.session.passport.user = {username: 'kati'}
    passport.serializeUser((user, done) => {
        console.log("Session");
        done(null, user.username);
    });

    // In deserializeUser that key is matched with the in memory array / database or any data resource.
    // The fetched object is attached to the request object as req.user

    passport.deserializeUser((username, done) => {
        helper.pool.query('SELECT * FROM users WHERE username = $1', [username], (err, results) => {
            if (err) {
                return done(err);
            }
            console.log(results.rows[0].username)
            return done(null, results.rows[0]);
        });
    });

}


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

const login = (req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { res.status(403).send("Wrong username or password"); }
        else {
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                res.redirect("./dashboard");
            });
        }
    })(req, res, next);

}


async function register(req, res){
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
                        //req.flash('success_msg', 'Registered!!!! Log in now!');
                        res.redirect("./login")

                    }
                );
            }
        }


    );

}

module.exports = {
    initialize,
    Authenticated,
    NotAuthenticated,
    login,
    register,
}