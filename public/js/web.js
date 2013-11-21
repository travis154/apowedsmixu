$(function(){
	var socket = io.connect('apowedsmixu.iulogy.com');
	socket.on('pic', function (data) {
		$("#by").fadeOut();
		$("#p").addClass("b");
		setTimeout(function(){
			$("#p").remove();
			var el = $("<img />");
			el.attr("src", data.pic);
			el.attr("id", "p");
			$("#disp").append(el);
			$("#p").on('load', function(){
				el.addClass("a");
				$("#by").html(data.user);
				$("#by").fadeIn();
			});
		},650);
	});	
});
