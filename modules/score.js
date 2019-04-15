'use strict'

const fs = require ( 'fs' )

class Score {

    constructor ( scoreFilePath ) {

        this.scores = { frames: [] }
        this.scoreFilePath = scoreFilePath;
         
        if ( !fs.existsSync( scoreFilePath )) {
            try {
                fs.writeFileSync( scoreFilePath, JSON.stringify ( this.scores, false, "\t" ) )
            } catch ( e ) {
                throw e
            }
        }
    }

    getScores () {
        try {
            return JSON.parse( fs.readFileSync ( this.scoreFilePath ) )
        } catch ( e ) {
            return { err: e }
        } 
    }

    calcTotal ( frames ) {
        let total = frames.reduce ( ( prev, curr ) => {
                    let count = 0
                    for ( let i in curr ){
                        count += curr[i]
                    }
                    return prev + count
                }, 0 )
        return total
    }

    setScores ( score ) {
        try {

            let scores = this.getScores ()
            
            if( !scores.err ) {

                if ( scores.frames.length < 10 ) {
                    if ( score.first !== "undefined" && score.second !== "undefined") {

                        if ( !scores.frames ) scores.frames = []
                        scores.frames.push( score )
                        scores.total = this.calcTotal(scores.frames)
                                        
                        try {
                            fs.writeFileSync ( this.scoreFilePath, JSON.stringify( scores, false, "\t" ) )
                            return true

                        } catch ( e ) {
                            return { err: e }
                        }
                    } else {
                        return { err: 'Not enough required parameters "first" or "second"' }
                    }
                } else { 
                    return { err: 'Game is over' }
                }
            } else { 
                return { err: scores.err }
            }

        } catch ( e ) {
            return { err: e }
        } 
    }

    newGame () {
        try {
            fs.writeFileSync( this.scoreFilePath, JSON.stringify ( this.scores, false, "\t" ) )
            return true
        } catch ( e ) {
            return { err: e }
        }
    }

}

module.exports = Score