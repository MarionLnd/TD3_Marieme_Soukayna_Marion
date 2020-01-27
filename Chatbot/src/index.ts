import * as express from "express";
import * as path from "path";
const app = express();
const port = 8080; // default port to listen

// Configure Express to use EJS
app.set( "vues", path.join( __dirname, "vues" ) );
app.set( "view engine", "ejs" );

// define a route handler for the default home page
app.get( "/", ( req: any, res: { render: (arg0: string) => void; } ) => {
    // render the index template
    res.render( "index" );
} );

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );