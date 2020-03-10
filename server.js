const express = require('express');
const bodyParser = require('body-parser');
const app = express();
      
const server = require('http').createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const io = require('socket.io').listen(server);
require('./routes/socket')(io);
// const io = require('socket.io').listen(server);

// let connections = [];
// let rooms = [];

// function GetRoom( name ){
// 	return rooms.find((e) => e.RoomName === name );
// }

// function CreateRoom({name, author}){
// 	//проверяем на существование комнаты
// 	if( GetRoom(name) !== undefined ) 
// 		return { state : false, mess: 'Комната с таким именем уже существует' }

// 	rooms.push(
// 		{
// 			RoomName : name,
// 			history : [
// 				{	mess : 'Комната создана: ' + (new Date).toLocaleTimeString() },
// 				{ mess : 'Автор комнаты: ' + author}
// 			] 
// 		}
// 	);

// 	return { state: true, mess: 'Комната успешно создана'}
// };

// CreateRoom({ name: 'Living room', author: 'ROOT ADMIN' });
// // Функция, которая сработает при подключении к странице
// // Считается как новый пользователь
// io.sockets.on('connection', function(socket) {
// 	//проблема в том , что используется не бд, а примитивные массивы 
// 	// из за чего обращение к массиву сразу нескольких функций дает непредсказуемый результат
// 	socket.username = undefined;
// 	socket.Rooms = [];
// 	console.log('Подключился пользователь ' + socket.id);
// 	// Добавление нового соединения в массив
// 	socket.on('change-username', function(name, callback) {
// 		//поменять ник можно однажды, это конвенционально 
// 		if( Boolean(socket.username) ) return;
// 		if( connections.find( el => el.username === name) === undefined ) {
// 			connections.push(socket);

// 			console.log('Пользователь (id) ' + socket.id + ' изменил ник на ' + name) 

// 			socket.username = name;
// 			socket.join('Living room', function(){
// 				console.log('Пользователь (id) '+ socket.id + ' вошел в Living room')
// 				socket.Rooms.push('Living room');
// 				GetRoom('Living room').history.push({mess: 'Пользователь ' + name + ' вошел в комнату', date: new Date()});
// 				socket.broadcast.to('Living room').emit('JoinRoom', socket.username );
// 			});
// 			callback({res: true, mess: 'Имя изменено'});
// 		} else callback({ res: false, mess: 'Имя уже занято' });
// 	});

// 	socket.on('create-room', ( RoomName, callback ) => { 
// 		//проверка на ник нейм 
// 		if( !Boolean(socket.username) ) return
// 		if( GetRoom(RoomName) === undefined ) {
// 			CreateRoom(RoomName, socket.username)
// 			//не хватает всяких обработок ошибок и сообщний , но мне лень 
// 			socket.join(RoomName, function(){
// 				console.log('Пользователь (id) ' + socket.id + ' создал комнату ' + RoomName);
// 				socket.Rooms.push(RoomName);
// 				callback({ res: true, mess: 'Комната успешно создана' })
// 			});
// 		}
// 		else callback({ res: false, mess: 'Комната с таким именем уже существует' });
// 	});

// 	socket.on('join-room', ( RoomName, callback ) => {
// 		//проверка на ник нейм 
// 		if( !Boolean(socket.username) ) return;
// 		//проверка на повторный вход в комнату, в которой уже состоишь 
// 		if( Boolean(socket.Rooms.find((e) => e === RoomName )) ){
// 			callback({ res: false, mess: 'Вы уже состоите в комнате: ' + RoomName});
// 			return;
// 		}
// 		let room = GetRoom(RoomName);
// 		if( room !== undefined){
// 			socket.join(RoomName, function(){
// 				let date = new Date();
// 				room.history.push({mess: 'Пользователь ' + socket.username + ' вошел в комнату', date });
// 				socket.broadcast.to(RoomName).emit('JoinRoom', {mess: socket.username + ' вошел в комнату', date  });
// 			});
// 		} else callback({ res: false, mess: 'Не удалось присоединиться к комнате: ' })
// 	});

// 	socket.on('leave-room', ( RoomName, callback ) => {
// 		//проверка на ник нейм 
// 		if( !Boolean(socket.username) ) return;
// 		//проверка на повторный выход из комнаты 
// 		if( !Boolean(socket.Rooms.find((e) => e === RoomName )) ){
// 			callback({ res: false, mess: 'Вы не состоите в комнате: ' + RoomName});
// 			return;
// 		}
// 		let room = GetRoom(RoomName); 
// 		if( room ){
// 			socket.leave(RoomName, function(){
// 				connections.splice(connections.indexOf(RoomName), 1);
// 				callback({res: true, mess:'Вы покинули комнату '+RoomName});
// 				room.history.push({mess: 'Пользователь ' + socket.username + ' покинул комнату:' + new Date()});
// 				socket.broadcast.to(RoomName).emit('LeaveRoom', socket.username );
// 			});
// 		} else callback({res: false, mess: 'Такой комнаты '+RoomName+' не существует'})
// 	});
	
// 	socket.on('get-members', function( RoomName, callback){
// 		//проверка на ник нейм 
// 		if( !Boolean(socket.username) ) return;
// 		//проверка на существовании в комнате 
// 		if( !Boolean(socket.Rooms.find((e) => e === RoomName )) ){
// 			callback({ res: false, mess: 'Вы не состоите в комнате: ' + RoomName});
// 			return;
// 		}
		
// 		let arr = [];
// 		let obj = io.sockets.adapter.rooms[RoomName].sockets;
		
// 		for( let id in obj){
// 			arr.push( io.sockets.sockets[id].username );
// 		}
		
// 		callback( arr );
// 	});
	
// 	socket.on('mess', function({ RoomName, mess }, callback){
// 		//проверка на ник нейм 
// 		if( !Boolean(socket.username) ) return;
// 		//проверка на существовании в комнате 
// 		if( !Boolean(socket.Rooms.find((e) => e === RoomName )) ){
// 			callback({ res: false, mess: 'Вы не состоите в комнате: ' + RoomName});
// 			return;
// 		}
// 		callback({ mess: 'Сообщение доставлено', res: true, date: new Date() })
// 		socket.broadcast.to(RoomName).emit('new-mess', {mess: mess, author: socket.username});
// 		//сами сообщения не будем хранить на сервере
// 		// и ответы отправителю тоже отправлять не станем 
// 	});
// 	// Функция, которая срабатывает при отключении от сервера
// 	socket.on('disconnect', function(){
// 		// Удаления пользователя из массива
// 		socket.Rooms.forEach(el => {
// 			socket.broadcast.to(el).emit('LeaveRoom', socket.username );
// 		});
// 		connections.splice(connections.indexOf(socket), 1);
// 		//connections.forEach(el => console.log(el.username))
// 	});

// });

server.listen(8080, ()=>{
  console.log('http://localhost:8080');
});    
