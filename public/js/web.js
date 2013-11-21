$(function(){
	var socket = io.connect('http://localhost');
	socket.on('pic', function (data) {
		$("#p").attr("src", data.pic);
	});	
});
