//完成所有练习
$ = function(id) {
	return document.getElementById(id);
}

$$ = function(id) {
	return document.querySelectorAll(id);
}

var gameStart = false;

function start() {
	gameStart = true;
	var nodes = $$("#maze .boundary");
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].className = "boundary";
	};
	$("status").textContent = "Move your mouse over the \"S\" to begin.";
}

//判断出框
function checkIn(e){
  var x=window.event.clientX;
  var y=window.event.clientY;
  var obj= $("maze");
   if (!(x> obj.offsetLeft && x <(obj.offsetLeft+obj.clientWidth)
      && y> obj.offsetTop && y <(obj.offsetTop+obj.clientHeight)))
     lose();
 
}
document.onmousemove=checkIn 

function lose() {
	if (!gameStart)
		return;
	var nodes = $$("#maze .boundary");
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].className.match("youlose") == null)
			nodes[i].className += " youlose";
	};
	$("status").textContent = "You lose!";
	gameStart = false;
}

function win() {
	if (gameStart && $("boundary1").className.match("youlose") == null)
	    $("status").textContent = "You win!";
	gameStart = false;
}

window.onload = function() {
	var nodes = $$("#maze .boundary");
	$("start").onclick = function() {start();};
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].onmouseover = function() {lose();};
	};
	$("end").onmouseover = function() {win();};
};

