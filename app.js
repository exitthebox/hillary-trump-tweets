var express = require('express'),
  twitter = require('ntwitter'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  hillary = 0,
  trump = 0,
  total = 0;


app.set('port', process.env.PORT || 3000);

var twit = new twitter({
  consumer_key: 'n7meVKlu7sp3ggX3aC1Jka2VL',
  consumer_secret: 'mnmz9GyAgM5UDhsjMwLoF8wr3YR6rFH9wSXPAkYZFM9e4gRTYb',
  access_token_key: '3229401132-mwIuO1kfYAFkYNAkUEEF3HM6f9iYsUc1pdtQIlJ',
  access_token_secret: 'PGIduJYXalhDGWyVA8oLlB2a34VlAL7HeQWRZ2iUNyyfc'
});

twit.stream('statuses/filter', { track: ['hillary', 'trump'] }, function(stream) {
  stream.on('data', function (data) {
    if (data.text) { 
      var text = data.text.toLowerCase();
      if (text.indexOf('hillary') != -1) {
        hillary++
        total++
        if ((hillary % 50) == 0){
          io.sockets.volatile.emit('hillary', { 
            user: data.user.screen_name, 
            text: data.text,
            avatar: data.user.profile_image_url_https
          });
        }
      }
      if (text.indexOf('trump') != -1) {
        trump++
        total++
        if ((trump % 50) == 0){
          io.sockets.volatile.emit('trump', { 
            user: data.user.screen_name, 
            text: data.text,
            avatar: data.user.profile_image_url_https
          });
        }
      }
      io.sockets.volatile.emit('percentages', { 
        hillary: (hillary/total)*100,
        trump: (trump/total)*100
      });
    }
  });
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
