//imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//config
require('dotenv').config();
const app = express();


//middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cors())


//mongodb connections
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
}).catch(e => {
    console.log(`Error: ${e}`)
})

//routes
app.use('/api/auth', require('./routes/auth.routes'));

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})