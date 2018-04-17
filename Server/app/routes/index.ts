import { Injectable } from '@angular/core';
import * as express from 'express';

import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as mongoose from 'mongoose';
import { User } from '../_models/user';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/dematerialize';
import * as fs from 'fs';


module Route {

    export class Index {

    private urldb = 'mongodb://saad:1234@ds127129.mlab.com:27129/log3900-13';
    private db: mongoose.Connection;

    private imgSchema = new mongoose.Schema({
      username: String,
      id: String,
      title : String,
      password: String,
      type : String,
      privacy: Number,
      img: [Buffer],
    });

    private imgdb = mongoose.model('imgAsPng', this.imgSchema);

    private userSchema = new mongoose.Schema({
      userName: String,
      password: String,
      firstName: String,
      lastName: String,
      id: Number
    });

    private usersFromDB = mongoose.model('usersFromDB', this.userSchema);

    constructor() {
      mongoose.connect(this.urldb).then(connection => {
        this.db = mongoose.connection;
      })
      .catch(error => {
        console.log(error.message)
     })
      
    }

    getUsersFromDB(): Promise<User[]> {      
      console.log("salut");
      let prom = new Promise<User[]>((resolve, reject) => {
        console.log("penis");

        this.db.on('error', () => {
          console.log("Fetch impossible");
          reject();
        });
        console.log("Fetch en cours ...");
        
            /*let promise = */ this.usersFromDB.find().exec((err, users: User[]) => {
          if (err) { return console.error(err); }
          console.log(users);
          resolve(users);
        });
      });

      return prom;
    }

    putUsersInDB(user: User): boolean {
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


    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
      res.send('Hello world');
    }
    public glComponent(req: express.Request, res: express.Response, next: express.NextFunction): void {
      res.redirect('/glcomp');
    }

    public getAllusers(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let users: any[];
      this.getUsersFromDB().then((usersDB: User[]) => {
        users = usersDB;
      });
      if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
        return Observable.of(new HttpResponse({ status: 200, body: users }));
      } else {
        // return 401 not authorised if token is null or invalid
        return Observable.throw('Unauthorised');
      }
    }

    public getUserbyId(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      let users: any[];
      this.getUsersFromDB().then((usersDB: User[]) => {
        users = usersDB;
      });

      if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
        // find user by id in users array
        let urlParts = request.url.split('/');
        let id = parseInt(urlParts[urlParts.length - 1]);
        let matchedUsers = users.filter(user => { return user.id === id; });
        let user = matchedUsers.length ? matchedUsers[0] : null;

        return Observable.of(new HttpResponse({ status: 200, body: user }));
      } else {
        // return 401 not authorised if token is null or invalid
        return Observable.throw('Unauthorised');
      }
    }
   
    public imageUpload(req:express.Request, res:express.Response, next: express.NextFunction): any {

      let auth = req.get("authorization");
      let id = 0;
      if (!auth) {
        res.set("WWW-Authenticate", "Basic realm=\"Authorization Required\"");
        return res.status(401).send("Authorization Required");
      } else {
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
      imgdbInsertObj.save(function(err,a){
        if(err){
          console.log(err);
        }else{
          console.log("saved");
        }
      });
    }

    public authenticate(req: express.Request, res: express.Response, next: express.NextFunction): void {
      // get new user object from post body
      let newUser = req.body;

      let users: any[];
      console.log(newUser);
      let prom = new Promise<User[]>((resolve, reject) => {
        mongoose.connect(this.urldb);
        this.db = mongoose.connection;
        this.db.on('error', () => {
          console.log("Fetch impossible");
          reject();
        });
        let usersFromDB = mongoose.model('usersFromDB', this.userSchema);

        console.log("Fetch en cours ...");
        let promise = usersFromDB.find().exec((err, users: User[]) => {
          
          console.log("2");
          if (err) { 
            console.log('2sdf');
            return console.error(err); }
          resolve(users);
        });
      }).then((usersDB: User[]) => {
        //console.log(usersDB);
        users = usersDB;
        console.log(users);
        let retur  = false;
        let index = 0;
        for (let i = 0 ; i < users.length; i++) {
          if (users[i].Username === req.body.userName && users[i].password === req.body.password  )
            retur = true;
            index = i ;
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
          
        } else {
          // else return 400 bad request
          //res.status(400);
          res.send("Username or password is incorrect");
        }
      });
    }

    public createUser(req: express.Request, res: express.Response, next: express.NextFunction): any {

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
      let users: any[];
      console.log(newUser); console.log("salut");
      let prom = new Promise<User[]>((resolve, reject) => {
        console.log("penis");
        mongoose.connect(this.urldb);
        this.db = mongoose.connection;
        this.db.on('error', () => {
          console.log("Fetch impossible");
          reject();
        });

        console.log("Fetch en cours ...");
        let promise = usersFromDB.find().exec((err, users: User[]) => {
          console.log("2");

          if (err) { return console.error("err ici " + err); }
          resolve(users);
        });
      }).then((usersDB: User[]) => {
        users = usersDB;
        // validation
        let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
        if (duplicateUser) {
          return Observable.throw('Username "' + newUser.username + '" is already taken');
        }

        // save new user
        newUser.id = users.length + 1;
        console.log(users);

        let prom2 = new Promise<boolean>((resolve, reject) => {

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
        }).then((ret: boolean) => {
          console.log('4');
          // respond 200 OK
          res.status(200);
          res.send();
        }
          )
      });
    }
  }
}

export = Route;
