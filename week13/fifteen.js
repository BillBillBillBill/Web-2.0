"use strict";
//通过JSlint检测, 用上周的改的, 人生苦短啊, 好累不想改了- -, 从两百多行到...按Shuffle或restart后才能算开始 胜利后按restart重来 基本功能完成 额外功能:结束游戏提示 游戏记录(最佳时间,步数) 动画 更改背景
var emptyblock = 16;
var best_move = 0;
var best_time = 0;
var start = false;
var backgroundimg = "background.jpg";
var backgroundfile = ["background.jpg","background2.jpg","background3.jpg","background4.jpg"];
var start_time;
var movestep;

function load() {
    var empty = document.createElement("div");
    $("#puzzlearea").append(empty);
    var nodes = $("#puzzlearea > div");
    nodes.css({"float":"left","position":"relative"}).addClass("puzzlepiece");
    for (var i = 0; i < nodes.length; i++) {
        var x = -(i%4)*100;
        var y = parseInt(i/4)*100;
        if (y > 0) {y = 400-y;}
        $(nodes[i]).css("backgroundPosition", x+"px "+y+"px").attr("id",i+1).html(i+1).click(function() {if(can_move(this.id)){move(this.id);}}).mouseover(function() {can_move(this.id);}).mouseout(function() {$(this).removeClass("movablepiece");});
    }
    $("#16").html("");
}
function changeBackground(filename) {
    $("#puzzlearea > div").css("backgroundImage","url('"+filename+"')");
    $(".puzzlepiece:empty").css("backgroundImage","url()");
}
function shuffle() {
    start = true;
    $("#winmsg").remove();
    $("body").css("color","");
    var i = 0;
    var moveonestep = function() {
        while (1) {
          var rand = Math.floor(Math.random() * 16);
          if (can_move(rand)) {
            move(rand);
            i++;
            break;
          }
        }
        if (i > Math.floor(Math.random() * 10) + 15) {
            clearInterval(t);
            start_time = new Date();
            movestep = 0;
        }
    };
    var t = setInterval(moveonestep, 200);
}
function restart() {
    $("#16").remove();
    load();
    emptyblock = 16;
    shuffle();
}
function can_move(id) {
    var derection = [-1,1,-4,4];
    for (var i = 0; i < 4; i++) {
        if (emptyblock == (parseInt(id) + derection[i]) && !(parseInt(id)%4 == 0 && derection[i] == 1) && !(parseInt(id)%4 == 1 && derection[i] == -1)) {$("#"+id).addClass("movablepiece");return true;}
    }
    return false;
}
function move(id) {
    var nodes = $("#puzzlearea > div");
    movestep++;
    var order = $(nodes[id-1]).html();
    var tem = nodes[id-1].style.background;
    $(nodes[id-1]).html($(nodes[emptyblock-1]).html()).css("background",nodes[emptyblock-1].style.background);
    $(nodes[emptyblock-1]).html(order).css("background",tem);
    emptyblock = id;
    for (var i = 0; i < nodes.length-1; i++) {if (i+1 != nodes[i].innerHTML || start === false) {return;}}
    if (emptyblock == 16) {win();}
}
function win() {
    $("body").append($(document.createElement("h1")).addClass("explanation").attr("id","winmsg"));
    var run = function() {
      $("#winmsg").html($("#winmsg").html() + "You Win!!!!") ;
      changeBackground(backgroundfile[Math.floor(Math.random() * 4)]);
      $("body").css("color",'#'+(Math.random()*0xffffff<<0).toString(16));
    };
    var t = setInterval(run, 150);
    var timespend = (new Date().getTime() - start_time.getTime()) / 1000;
    best_move = best_move == 0 || best_move > movestep? movestep : best_move;
    best_time = best_time == 0 || best_time > timespend? timespend : best_time;
    $("#best_move").html("Best move:" + best_move);
    $("#best_time").html("Best time:" + best_time);
    $("#restart").click(function() {restart();clearTimeout(t);});
}
$(document).ready(function() {
    load();
    $("#shufflebutton").click(function() {shuffle();});
    $("#overall").append($(document.createElement("h1")).attr("id","best_time").addClass("explanation").html("Best time:" + best_time)).append($(document.createElement("h1")).attr("id","best_move").addClass("explanation").html("Best move:" + best_move));
    for(var i = 0; i < backgroundfile.length; i++) {
        $("#puzzlearea").before($(document.createElement('button')).html(backgroundfile[i]).click(function() { backgroundimg = this.innerHTML;changeBackground(this.innerHTML);}));
    }
    $("#controls").append($(document.createElement("button")).attr("id","restart").html("restart").click(function() {restart();}));
    changeBackground(backgroundimg);
});