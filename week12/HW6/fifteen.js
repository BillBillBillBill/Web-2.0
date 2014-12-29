"use strict";
//通过JSlint检测
//按Shuffle或restart后才能算开始 胜利后按restart重来
//基本功能完成
//额外功能:结束游戏提示 游戏记录(最佳时间,步数) 动画 更改背景
var $ = function(id) {
    return document.getElementById(id);
};

var $$ = function(id) {
    return document.querySelectorAll(id);
};

var emptyblock = 16;
var best_move = 0;
var best_time = 0;
var start = false;
var backgroundimg = "background.jpg";
var start_time;
var movestep;

function load() {
    var empty = document.createElement("div");
    $("puzzlearea").appendChild(empty);
    var nodes = $$("#puzzlearea div");
    for (var i = 0; i < nodes.length; i++) {
        var x = -(i%4)*100;
        var y = parseInt(i/4)*100;
        if (y > 0) {
            y = 400-y;
        }
        var pos = x + "px " + y + "px";
        nodes[i].className = "puzzlepiece";
        nodes[i].style.backgroundPosition = pos;
        nodes[i].style.float = "left";
        nodes[i].style.position = "relative";
        nodes[i].id = i+1;
        nodes[i].innerHTML = i+1;
        nodes[i].onclick = function() {move(this);};
        nodes[i].onmouseover = function() {focus(this);};
        nodes[i].onmouseout = function() {this.className = "puzzlepiece";};
    }
    changeBackground(backgroundimg);
    $("16").innerHTML = "";
    $("16").style.backgroundImage = "url()";
}

function changeBackground(filename) {
    backgroundimg = filename;
    var nodes = $$("#puzzlearea div");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].style.backgroundImage = "url('"+backgroundimg+"')";
      if (!nodes[i].innerHTML) {
        nodes[i].style.backgroundImage = "url()";
      }
    }
}

function shuffle() {
    start = true;
    while ($("winmsg")) {
        $$("body")[0].removeChild($("winmsg"));
    }
    $$("body")[0].style.color = "";
    var i = 0;
    var times = Math.floor(Math.random() * 10)+15;
    var moveonestep = function() {
        while (1) {
            var rand = Math.floor(Math.random() * 16);
            if (can_move(rand)) {
            move($(rand));
            i++;
            break;
            }
        }
        if (i > times) {
            clearInterval(t);
            start_time = new Date();
            movestep = 0;
        }
    };
    var t = setInterval(moveonestep, 200);
}


function restart() {
    
    $("puzzlearea").removeChild($("16"));
    load();
    shuffle();
    emptyblock = 16;
}

function can_move(id) {
    var pos = parseInt(id);
    var derection = [-1,1,-4,4];
    for (var i = 0; i < 4; i++) {
        if (emptyblock == (pos + derection[i]) && !(pos%4 == 0 && derection[i] == 1) && !(pos%4 == 1 && derection[i] == -1)) {
            return true;
        }
    }
    return false;
}

function focus(block) {
    console.log(block + can_move(block.id));
    if (can_move(block.id)) {
        block.className += " movablepiece";
        }
}

function move(block) {
    var id = parseInt(block.id);
    console.log('click id:'+id);
    if (can_move(id)) {
            movestep++;
            exchange(id-1, emptyblock-1);
            console.log('exchange'+id+","+emptyblock);
            emptyblock = id;
            console.log('emptyblock:'+emptyblock);
            if (emptyblock == 16 && checkfinish()) {
                console.log("hehe");
                win();
            }
        }

}

function exchange(a, b) {
    var nodes = $$("#puzzlearea div");
    var order = nodes[a].innerHTML;
    var tem = nodes[a].style.background;
    nodes[a].innerHTML = nodes[b].innerHTML;
    nodes[b].innerHTML = order;
    nodes[a].style.background = nodes[b].style.background;
    nodes[b].style.background = tem;
}

function checkfinish() {
    var nodes = $$("#puzzlearea div");
    for (var i = 0; i < nodes.length-1; i++) {
        console.log(i+1);
        console.log(nodes[i].innerHTML);
        if (i+1 != nodes[i].innerHTML || start === false) {
            return false;
        }
    }
    return true;
}

function win() {
    if (!start) {
        return;
    }
    var t = 0;
    var winmsg = document.createElement("h1");
    winmsg.className = "explanation";
    winmsg.id = "winmsg";
    $$("body")[0].appendChild(winmsg);
    var run = function() {
      var backgroundfile = ["background.jpg","background2.jpg","background3.jpg","background4.jpg"];
      winmsg.innerHTML += "You Win!!!!";
      changeBackground(backgroundfile[Math.floor(Math.random() * 16)%4]);
      $$("body")[0].style.color = '#'+(Math.random()*0xffffff<<0).toString(16);
      t = setTimeout(run, 150);
      if (!checkfinish()) {
        clearTimeout(t);
      }
    };
    run();
    var timespend = (new Date().getTime() - start_time.getTime()) / 1000;
    if (best_move == 0 || best_move > movestep) {
        winmsg.innerHTML += "Record Break!!!!";
        best_move = movestep;
    }
    $("best_move").innerHTML = "Best move:" + best_move;
    if (best_time == 0 || best_time > timespend) {
        winmsg.innerHTML += "Record Break!!!!";
        best_time = timespend;
    }
    $("best_time").innerHTML = "Best time:" + best_time;
    $("restart").onclick = function() {restart();clearTimeout(t);};

}

window.onload = function() {
    load();
    $("shufflebutton").onclick = function() {shuffle();};
    var best_t = document.createElement("h1");
    best_t.className = "explanation";
    best_t.id = "best_time";
    best_t.innerHTML = "Best time:" + best_time;
    var best_m = document.createElement("h1");
    best_m.className = "explanation";
    best_m.id = "best_move";
    best_m.innerHTML = "Best time:" + best_move;
    $("overall").appendChild(best_t);
    $("overall").appendChild(best_m);
    var backgroundfile = ["background.jpg","background2.jpg","background3.jpg","background4.jpg"];
    for(var i = 0; i < backgroundfile.length; i++){
        var bnt = document.createElement("button");
        bnt.innerHTML = backgroundfile[i];
        bnt.onclick = function() {changeBackground(this.innerHTML);};
        $("overall").insertBefore(bnt,$("puzzlearea"));
    }
    var restart_bt = document.createElement("button");
    restart_bt.innerHTML = "restart";
    restart_bt.id = "restart";
    restart_bt.onclick = function() {restart();};
    $("controls").appendChild(restart_bt);
    changeBackground(backgroundimg);
};