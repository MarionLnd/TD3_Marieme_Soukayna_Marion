const express = require( "express" );
const app = express();
const port = 3000;

app.get( "/", ( req, res ) => {
    res.send( " Bienvenue !" );
} );

// start the Express server
app.listen( port, () => {
    console.log( `Démarrage Serveur sur le port http://localhost:${ port }` );
} );