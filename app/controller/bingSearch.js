const dotenv = require('dotenv');
const express = require('express');
const https = require('https');
const router = express.Router();
dotenv.config()


router.get("/getData", async (req, response) => {
    const searchedData = req.query.query;
    const count = req.query.count?req.query.count:10;
    const offset = req.query.offset?req.query.offset:0;
    const SUBSCRIPTION_KEY = process.env.AZURE_SUBSCRIPTION_KEY;
    const CONFIG_ID = process.env.CONFIG_ID;
    https.get({
        hostname: 'api.cognitive.microsoft.com',
        path:     '/bingcustomsearch/v7.0/search?q=' + encodeURIComponent(searchedData) + '&customconfig='+ CONFIG_ID +'&mkt=en-US&safesearch=Off&count='+count+'&offset='+offset,
        headers:  { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY},
      }, res => {
        let body = ''
        res.on('data', part => body += part)
        res.on('end', () => {
          response.status(200).send(JSON.parse(body));
        })
        res.on('error', e => {
            console.log(e);
            response.status(401).send("Please try again");
            throw e
        })
      })
});
module.exports = router;
