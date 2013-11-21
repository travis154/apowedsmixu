$(function(){
	var socket = io.connect('http://apowedsmixu.iulogy.com:4567');
	socket.on('pic', function (data) {
		$("#p").attr("src", data.pic);
	});	
});
