var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'Ie2UIZI6LzDVz7O3Qi9fMKhO1',
  consumer_secret: 'u0uL7svxDU6vB8Wr31RUB3P8g2kgcwPavj0SxCvQzIfIREHqzk',
  access_token_key: '1274191327-5g5g2zbhTSTAFRQzznhyhzY6zosm2iZA1C7kwba',
  access_token_secret: 'Yt3VUKXXJYXjFpaeU4aEbSgGR3236St8Qk7zPYJtj03Gu'
});

/* Request GET method API */
client.get('statuses/home_timeline', function(error, body, response){
   if(error) console.log(error);

   console.log(body);   
});

/* Request GET method with parameters */
client.get('statuses/home_timeline', { count: 2 }, function(error, body, response){
   if(error) console.log(error);

   console.log(body);   
});

/* Request POST method API */
var status = "Should not longer than 140 characters.";
client.post('statuses/update', {status: status}, function(error, body, response){
	if(error) console.log(error);

	console.log(body);
});