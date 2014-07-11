var net = require('net');
var port = 4001;
var conn;
var retryInterval = 3000;
var retriedTimes = 0;
var maxRetries = 10;
var quitting = false;

process.stdin.resume();

(function connect(){

	function reconnect(){
		if(retriedTimes >= maxRetries){
			throw new Error('Max retries have been exceeded');
		}
		retriedTimes += 1;
		setTimeout(connect, retryInterval);
	}

	conn = net.createConnection(port);

	conn.on('connect', function(){
		retriedTimes = 0;
		console.log('connected to server');
	});

	conn.on('error', function(err){
		console.log('Error in connection:', err);
	});

	conn.on('close', function(){
		console.log('Connection got closed, will try to reconnect');
		if(!quitting){
			console.log('connection got closed, will try to reconnect');
			reconnect();
		}
	});

	conn.pipe(process.stdout, {end: false});

	process.stdin.on('data', function(data){
		if(data.toString().trim().toLowerCase() === 'quit'){
			quitting = true;
			console.log('quitting...')
			conn.end();
			process.stdin.end();
		} else {
			conn.write(data);
		}
	});

})();
