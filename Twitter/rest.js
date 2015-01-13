var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'Ie2UIZI6LzDVz7O3Qi9fMKhO1',
  consumer_secret: 'u0uL7svxDU6vB8Wr31RUB3P8g2kgcwPavj0SxCvQzIfIREHqzk',
  access_token_key: '1274191327-4PwCPZvbxJiqXcLtJgsvQ4c8VEZcuFHSWbBZDPO',
  access_token_secret: 'y9xda1FvVjD1cWxZzJsgoqfZWwgeDBEYr4HaozA1ooZ6m'
});


client.get('statuses/home_timeline', function(error, body, response){
   if(error) throw error;

   console.log(body);   
});
