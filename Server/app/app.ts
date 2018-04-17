/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import * as express from 'express';

import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import * as indexRoute from './routes';

import * as cors from 'cors';

const fileUpload = require('express-fileupload');

export class Application {

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this this.app.
   */
  public static bootstrap(): Application {
    return new Application();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {

    // Application instantiation
    this.app = express();

    //configure this.application
    this.config();

    //configure routes
    this.routes();
    
  }

  /**
   * The config function.
   *
   * @class Server
   * @method config
   */
  private config() {
    // Middlewares configuration
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(express.static(path.join(__dirname, '../client')));

     /**
     * 2018.4.14 by mohd
     */
    //File Uploading
    this.app.use(fileUpload());
    // CORS
    this.app.use(cors());
  }

  /**
   * The routes function.
   *
   * @class Server
   * @method routes
   */
  public routes() {
    let router: express.Router;
    router = express.Router();

    //create routes
    const index: indexRoute.Index = new indexRoute.Index();

    //home page
    router.get('/api/users', index.getAllusers.bind(index.getAllusers));
    router.get(/\/api\/users\/\d+$/, index.getUserbyId.bind(index.getUserbyId));
    router.post('/api/authenticate', index.authenticate.bind(index.authenticate));
    router.post('/api/users', index.createUser.bind(index.createUser));
    router.post('/api/imgupload', index.imageUpload.bind(index.imageUpload));

    //use router middleware
    this.app.use(router);

    // Gestion des erreurs
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        let err = new Error('Not Found');
        next(err);
    });

    // development error handler
    // will print stacktrace
    if (this.app.get('env') === 'development') {
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user (in production env only)
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
  }
}
