var fb = require('fbgraph');

/* Setup Access Token*/
var access_token = 'CAACEdEose0cBAPYHxZAiMNSduuKEe0qNQ70tTZC7RWsFEOB2hA8m9v5XxBZB9bcvUItypPYq5vhlG5VIw515jZCCfUSfE2fu7dtXjQcfXxUjpLMqzBaqu9ZCbeiNiBS6iYcW0ZCyFDndAQRrrtPvKfKBUwFN6RXPeZBoLmwyZCHjNksOZCL5YUZABSpW371KjO7eA9dA7n9gQq5eYliqn169wX';
fb.setAccessToken(access_token);

/* Request GET method API */
fb.get("100000217340334/feed", function(err, res){ console.log(res); });

var postWall = {
   message: "This is a test of publish data to feed.",	// set message to be post
   privacy: { value: "SELF"}		// set privacy
};
/* Request POST method API*/
fb.post("100000217340334/feed", postWall , function(err, res){ console.log(res); });
