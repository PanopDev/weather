const express = require('express');
const app = express();
const PORT = process.env.PORT||4000
const path = require('path')
const cors = require('cors')

require('dotenv').config()
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use('/',express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes/root'))
app.use('/weather',require('./routes/weather'))

app.listen(PORT,()=>{console.log(`listening on ${PORT}`)})