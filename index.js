const bingSearch = require('./app/controller/bingSearch.js');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
dotenv.config()

const app = express();
app.use(cors());

//import bingeSearch function
app.use('/bingSearch/v2', bingSearch);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
})

