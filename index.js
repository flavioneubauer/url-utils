const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/validate', (req, res) => {
	const qUrl = req.query.url;
	if(qUrl){
		console.log(`checking ${qUrl}`);
		request({method: 'GET', uri: qUrl, redirect: true}, function (error, response, body) {
			try{
				const $ = cheerio.load(response.body);
				const url = $("meta").attr().content.split(';')[1].split('=')[1].trim();
				if(url){
					console.log(`checking ${qUrl}`);
					res.status(200);
					res.send(url);
				}else{
					throw new Error('url not found on meta tag');
				}

			}catch(e){
				console.error(e);
				res.status(500);
				res.send('Url not found on meta tag. ' + e.message);
			}
		});
	}else{
		res.status(400);
		res.send('Url Utils usage: /validate?url=http://me.site.com:9292');
	}
});

app.listen(port, () => console.log(`Url Utils ready on port ${port}!`));
