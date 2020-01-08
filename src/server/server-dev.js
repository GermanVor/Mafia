import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'

const app = express(),
      DIST_DIR = __dirname,
      HTML_FILE = path.join(DIST_DIR, 'index.html'),
      compiler = webpack(config)
      
const server = require('http').createServer(app);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.get('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
  if (err) {
    return next(err)
  }
  res.set('content-type', 'text/html')
  res.send(result)
  res.end()
  })
})

//const PORT = process.env.PORT || 8080;

//const io = require('socket.io').listen(PORT);

// app.listen(PORT, () => {
//     console.log(`App listening to ${PORT}....`)
//     console.log('Press Ctrl+C to quit.')
// })
// Отслеживание порта
server.listen(8080, ()=>{
  console.log('http://localhost:8080');
});    

const io = require('socket.io').listen(server);

let connections = [];

let rooms = [];

function GetRoom( name ){
	return 	rooms.find((e) => {
		return e.RoomName === name;
	});
}

function CreateRoom({name, author}){
	//проверяем на существование комнаты
	if( GetRoom(name) !== undefined ) 
		return { state : false, mess: 'Комната с таким именем уже существует' }

	// по уму нужно хранить все в бд, но в данном примере подразумевается,
	// что приложение работает в основном синхронно
	rooms.push(
		{
			RoomName : name,
			history : [
				{	mess : 'Комната создана: ' + (new Date).toLocaleTimeString() },
				{ mess : 'Автор комнаты: ' + author}
			] 
		}
	);

	return { state: true, mess: 'Комната успешно создана'}
};


CreateRoom({ name: 'Living room', author: 'ROOT ADMIN' });

// Функция, которая сработает при подключении к странице
// Считается как новый пользователь
io.sockets.on('connection', function(socket) {
	socket.username = undefined;
	// Добавление нового соединения в массив
	socket.on('change-username', function(name) {
		if( connections.find( el => el.username === name) === undefined ) {
			connections.push(socket);
			socket.username = name;
		}
	})
	socket.on('create-room', ( RoomName ) => { 
		if( GetRoom(RoomName) === undefined ) {
			CreateRoom(RoomName, socket.username)
			//не хватает всяких обраюоток ошибок и сообщний , но мне лень 
			socket.join(RoomName, 
				()=> socket.emit('create-room-res', { res: false, mess: 'Комната с таким именем уже существует' })
			);
		}
		else socket.emit('create-room-res', { res: false, mess: 'Комната с таким именем уже существует' });
	})

	socket.on('join-room', ( RoomName ) => {
		let room = GetRoom(RoomName)

		socket.join(RoomName, function(){
			room.history.push({mess: 'Пользователь ' + socket.username + ' вошел в комнату:' + new Date()});
			socket.broadcast.to(RoomName).emit('JoinRoom', socket.username + ' вошел в комнату');
		});
		
	});

	socket.on('leave-room', ( RoomName ) => {
		let room = GetRoom(RoomName)

		socket.leave(RoomName, function(){
			room.history.push({mess: 'Пользователь ' + socket.username + ' покинул комнату:' + new Date()});
			socket.broadcast.to(RoomName).emit('LeaveRoom', socket.username + ' покинул комнату');
		});
		
	});
	
	socket.on('mess', function(id, mess) {
		socket.broadcast.to(id).emit('new-mess', mess);
		//сами сообщения не будем хранить на сервере
	});
	// Функция, которая срабатывает при отключении от сервера
	socket.on('disconnect', function() {
		// Удаления пользователя из массива
		socket.broadcast.emit('LeaveRoom', 'Пользователь ' + socket.username + ' вышел из комнаты');
		connections.splice(connections.indexOf(socket), 1);
		console.log("Пользователь " + ' отключился от чата' );
	});

});