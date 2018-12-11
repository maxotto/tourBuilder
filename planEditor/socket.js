module.exports = function(server, app) {
  const io = require('socket.io')(server, {
    // path: '/socket',
    // serveClient: false,
    // below are engine.IO options
    pingInterval: 100000,
    pingTimeout: 50000,
    cookie: false
  });

  io.on('connection', function(socket){
    app.set('socket', socket);
    socket.emit('news', { hello: 'world' });
    console.log('a user connected');
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
    });
  });

  console.log(io);
  return io;
};
