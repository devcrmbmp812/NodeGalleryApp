"use strict";
const http_1 = require("@angular/common/http");
const Observable_1 = require("rxjs/Observable");
const mongoose = require("mongoose");
require("rxjs/add/observable/of");
require("rxjs/add/observable/throw");
require("rxjs/add/operator/delay");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/materialize");
require("rxjs/add/operator/dematerialize");
var Route;
(function (Route) {
    class Index {
        constructor() {
            this.urldb = 'mongodb://saad:1234@ds127129.mlab.com:27129/log3900-13';
            this.imgSchema = new mongoose.Schema({
                username: String,
                id: String,
                title: String,
                password: String,
                type: String,
                privacy: Number,
                img: [Buffer],
            });
            this.imgdb = mongoose.model('imgAsPng', this.imgSchema);
            this.userSchema = new mongoose.Schema({
                userName: String,
                password: String,
                firstName: String,
                lastName: String,
                id: Number
            });
            this.usersFromDB = mongoose.model('usersFromDB', this.userSchema);
            mongoose.connect(this.urldb).then(connection => {
                this.db = mongoose.connection;
            })
                .catch(error => {
                console.log(error.message);
            });
        }
        getUsersFromDB() {
            console.log("salut");
            let prom = new Promise((resolve, reject) => {
                console.log("penis");
                this.db.on('error', () => {
                    console.log("Fetch impossible");
                    reject();
                });
                console.log("Fetch en cours ...");
                /*let promise = */ this.usersFromDB.find().exec((err, users) => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(users);
                    resolve(users);
                });
            });
            return prom;
        }
        putUsersInDB(user) {
            this.db.on('error', console.error.bind(console, 'connection error:'));
            this.db.once('open', () => {
                let usager1 = new this.usersFromDB({
                    userName: user.username,
                    password: user.password, firstName: user.firstName, lastName: user.lastName, id: user.id
                });
                usager1.save((err, fluffy) => {
                    if (err) {
                        return console.error(err);
                    }
                });
            });
            return true;
        }
        index(req, res, next) {
            res.send('Hello world');
        }
        glComponent(req, res, next) {
            res.redirect('/glcomp');
        }
        getAllusers(request, next) {
            let users;
            this.getUsersFromDB().then((usersDB) => {
                users = usersDB;
            });
            if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                return Observable_1.Observable.of(new http_1.HttpResponse({ status: 200, body: users }));
            }
            else {
                // return 401 not authorised if token is null or invalid
                return Observable_1.Observable.throw('Unauthorised');
            }
        }
        getUserbyId(request, next) {
            let users;
            this.getUsersFromDB().then((usersDB) => {
                users = usersDB;
            });
            if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                // find user by id in users array
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);
                let matchedUsers = users.filter(user => { return user.id === id; });
                let user = matchedUsers.length ? matchedUsers[0] : null;
                return Observable_1.Observable.of(new http_1.HttpResponse({ status: 200, body: user }));
            }
            else {
                // return 401 not authorised if token is null or invalid
                return Observable_1.Observable.throw('Unauthorised');
            }
        }
        imageUpload(req, res, next) {
            let auth = req.get("authorization");
            let id = 0;
            if (!auth) {
                res.set("WWW-Authenticate", "Basic realm=\"Authorization Required\"");
                return res.status(401).send("Authorization Required");
            }
            else {
                var obj = JSON.parse(auth);
                id = obj.id;
            }
            console.log(req['files'].image);
            let imgdb = mongoose.model('imgAsPng', this.imgSchema);
            let imgdbInsertObj = new imgdb;
            imgdbInsertObj['img'] = req['files'].image.data;
            imgdbInsertObj['title'] = req['files'].image.name;
            imgdbInsertObj['type'] = req['files'].image.mimetype;
            imgdbInsertObj['id'] = id;
            imgdbInsertObj.save(function (err, a) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("saved");
                }
            });
        }
        authenticate(req, res, next) {
            // get new user object from post body
            let newUser = req.body;
            let users;
            console.log(newUser);
            let prom = new Promise((resolve, reject) => {
                mongoose.connect(this.urldb);
                this.db = mongoose.connection;
                this.db.on('error', () => {
                    console.log("Fetch impossible");
                    reject();
                });
                let usersFromDB = mongoose.model('usersFromDB', this.userSchema);
                console.log("Fetch en cours ...");
                let promise = usersFromDB.find().exec((err, users) => {
                    console.log("2");
                    if (err) {
                        console.log('2sdf');
                        return console.error(err);
                    }
                    resolve(users);
                });
            }).then((usersDB) => {
                //console.log(usersDB);
                users = usersDB;
                console.log(users);
                let retur = false;
                let index = 0;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].Username === req.body.userName && users[i].password === req.body.password)
                        retur = true;
                    index = i;
                }
                if (retur) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let user = JSON.parse(JSON.stringify(users[0]));
                    let body = {
                        id: user.id,
                        username: user.userName,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };
                    res.status(200);
                    res.send(body);
                }
                else {
                    // else return 400 bad request
                    //res.status(400);
                    res.send("Username or password is incorrect");
                }
            });
        }
        createUser(req, res, next) {
            // get new user object from post body
            let newUser = req.body;
            let userSchema = new mongoose.Schema({
                userName: String,
                password: String,
                firstName: String,
                lastName: String,
                id: Number
            });
            let usersFromDB = mongoose.model('imgAsPng', this.userSchema);
            let users;
            console.log(newUser);
            console.log("salut");
            let prom = new Promise((resolve, reject) => {
                console.log("penis");
                mongoose.connect(this.urldb);
                this.db = mongoose.connection;
                this.db.on('error', () => {
                    console.log("Fetch impossible");
                    reject();
                });
                console.log("Fetch en cours ...");
                let promise = usersFromDB.find().exec((err, users) => {
                    console.log("2");
                    if (err) {
                        return console.error("err ici " + err);
                    }
                    resolve(users);
                });
            }).then((usersDB) => {
                users = usersDB;
                // validation
                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                if (duplicateUser) {
                    return Observable_1.Observable.throw('Username "' + newUser.username + '" is already taken');
                }
                // save new user
                newUser.id = users.length + 1;
                console.log(users);
                let prom2 = new Promise((resolve, reject) => {
                    let usager1 = new usersFromDB({
                        userName: newUser.username,
                        password: newUser.password, firstName: newUser.firstName, lastName: newUser.lastName, id: newUser.id
                    });
                    usager1.save((err, fluffy) => {
                        console.log('3');
                        if (err) {
                            return console.error(err);
                        }
                        else
                            resolve(true);
                    });
                    //localStorage.setItem('users', JSON.stringify(users));
                }).then((ret) => {
                    console.log('4');
                    // respond 200 OK
                    res.status(200);
                    res.send();
                });
            });
        }
    }
    Route.Index = Index;
})(Route || (Route = {}));
module.exports = Route;
//# sourceMappingURL=index.js.map