const hapi = require ( 'hapi' )
const fs = require ( 'fs' )
const Score = require ( './modules/score' )
const argv = require ( 'optimist' ).argv

const host = argv.host || argv.h || "localhost"
const port = argv.port || argv.p || "2020"
const dbFile = argv.file || argv.f || "score.json"

console.log(port, dbFile)

const score = new Score ( dbFile )

const server = hapi.server({
            host:host,
            port:port
        });

server.route({
    method:'GET',
    path:'/scores',
    handler: ( request, h ) => {

        try { 
            let result = score.getScores()
            if ( result.err ) {
                return h.response( result.err ).code( 500 )
            } else {
                 return h.response(result).code( 200 )
            }
         } catch ( e ) {
            return h.response( ).code( 500 )
         }
                        
    }
});

server.route({
    method:'PUT',
    path:'/scores',
    handler: ( request, h ) => {

        try {
            let result = score.setScores( request.payload ) 
            console.log( result.err )
            if ( result.err ) {
                return h.response( result.err ).code( 500 )
            } else {
                return h.response().code( 200 )
            }
        } catch ( e ) {
            return h.response().code( 500 )
        }
    }
});

server.route({
    method:'POST',
    path:'/game',
    handler: ( request, h ) => {

        let result = score.newGame()
        if(result.err) {
            return h.response().code( 500 ) 
        } else {
            return h.response().code( 204 )
        }
    }
});

server.start()
