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

server.listen(8080, ()=>{
  console.log('http://localhost:8080');
});    


app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.get('/', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
		if (err) {
			return next(err)
		}
		res.set('content-type', 'text/html')
		res.send(result)
		res.end()
  })
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
	console.log('Подключился пользователь ' + socket.id);
	// Добавление нового соединения в массив
	socket.on('change-username', function(name, callback) {
		//поменять ник можно однажды, это конвенционально 
		if( Boolean(socket.username) ) return
		if( connections.find( el => el.username === name) === undefined ) {
			connections.push(socket);

			console.log('Пользователь (id) ' + socket.id + ' изменил ник на ' + name) 

			socket.username = name;
			socket.join('Living room', function(){
				console.log('Пользователь (id) '+ socket.id + ' вошел в Living room')
				GetRoom('Living room').history.push({mess: 'Пользователь ' + name + ' вошел в комнату', date: new Date()});
				socket.broadcast.to('Living room').emit('JoinRoom', socket.username );
			});
			callback({res: true, mess: 'Имя изменено'});
		} else callback({ res: false, mess: 'Имя уже занято' });
	});

	socket.on('create-room', ( RoomName, callback ) => { 
		//проверка на ник нейм 
		if( !Boolean(socket.username) ) return
		if( GetRoom(RoomName) === undefined ) {
			CreateRoom(RoomName, socket.username)
			//не хватает всяких обработок ошибок и сообщний , но мне лень 
			socket.join(RoomName, function(){
				console.log('Пользователь (id) ' + socket.id + ' создал комнату ' + RoomName)
				callback({ res: true, mess: 'Комната успешно создана' })
			});
		}
		else callback({ res: false, mess: 'Комната с таким именем уже существует' });
	});

	socket.on('join-room', ( RoomName, callback ) => {
		//проверка на ник нейм 
		if( !Boolean(socket.username) ) return
		let room = GetRoom(RoomName);
		if( room !== undefined){
			socket.join(RoomName, function(){
				let date = new Date();
				room.history.push({mess: 'Пользователь ' + socket.username + ' вошел в комнату', date });
				socket.broadcast.to(RoomName).emit('JoinRoom', {mess: socket.username + ' вошел в комнату', date  });
			});
		} else callback({ res: false, mess: 'Не удалось присоединиться к комнате' })
	});

	socket.on('leave-room', ( RoomName ) => {
		//проверка на ник нейм 
		if( !Boolean(socket.username) ) return
		let room = GetRoom(RoomName); 
		if( room ){
			socket.leave(RoomName, function(){
				room.history.push({mess: 'Пользователь ' + socket.username + ' покинул комнату:' + new Date()});
				socket.broadcast.to(RoomName).emit('LeaveRoom', socket.username + ' покинул комнату');
			});
		}
	});
	
	socket.on('mess', function({ RoomName, mess }, callback) {
		//проверка на ник нейм 
		if( !Boolean(socket.username) ) return;

		callback({ mess: 'Сообщение доставлено', res: true, date: new Date() })
		socket.broadcast.to(RoomName).emit('new-mess', {mess: mess, author: socket.username});
		//сами сообщения не будем хранить на сервере
		// и ответы отправителю тоже отправлять не станем 
	});
	// Функция, которая срабатывает при отключении от сервера
	socket.on('disconnect', function() {
		// Удаления пользователя из массива
		socket.broadcast.emit('LeaveRoom', 'Пользователь ' + socket.username + ' вышел из комнаты');
		connections.splice(connections.indexOf(socket), 1);
		console.log("Пользователь " + socket.id + ' отключился от чата' );
	});

});