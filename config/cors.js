const cors = require('cors');

const acceptedOrigins = ['https://panopdevweather.onrender.com']

const corsOptions = {
    origin: function(origin,callback){
        if(acceptedOrigins.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }

    },
    optionsSuccessStatus:200
}

module.exports = corsOptions