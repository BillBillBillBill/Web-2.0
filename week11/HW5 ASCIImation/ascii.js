"use strict";

function $(id) {return document.getElementById(id);}

//Unobtrusive JavaScript
window.onload = function() {
    var run = playControls();
    $("Start").onclick = run;
    $("Stop").onclick = run;
    var sizeselect = document.getElementsByName("Size");
    for (var i = 0; i < sizeselect.length; i++) {
        sizeselect[i].onclick = changeFontSize;
    }
};

//控制动画播放
function playControls() {
    var t = 0;
    var timeid = 0;
    var act;
    var play;
    function b() {
    var start = $("Start");
    var stop = $("Stop");
    var dpa = $("displayarea");
    play = function() {
        var Delay = $("Turbo").checked? 50: 200;
        dpa.value = act[t%act.length];
        t+=1;
        console.log(t);
        timeid = setTimeout(play, Delay);};

    if (!start.disabled) {
        console.log("start!");
        act = getAnimation().split("=====\n");
        stop.disabled = "";
        start.disabled = "disabled";
        $('Animation').disabled="disabled";
        play();
    }
    else if (!stop.disabled) {
        console.log("stop!");
        start.disabled = "";
        stop.disabled = "disabled";
        $('Animation').disabled="";
        clearTimeout(timeid);
        t = 0;
    }

    }
    return b;
}

//获得字符画
function getAnimation() {
    var Animation = $('Animation').value;
    return ANIMATIONS[Animation];
}

//改变字体大小
function changeFontSize() {
    var dpa = $("displayarea");
    var sizeselect = document.getElementsByName("Size");
    for (var i = 0; i < sizeselect.length; i++) {
        if (sizeselect[i].checked) {
            switch(sizeselect[i].value){
                case "Small":
                    dpa.style.fontSize = "7pt";
                    break;
                case "Medium":
                    dpa.style.fontSize = "12pt";
                    break;
                default:
                    dpa.style.fontSize = "24pt";
                    break;
            }
        }
    }
}


ANIMATIONS["Custom"] =
"           __....__\n" + 
"      .-~~/  \\__/  \\~~-.\n" + 
"     /_/``\\__/  \\__/``\\_\\.--.\n" + 
"    /  \\__/  \\__/  \\__/  \\   o`.\n" + 
"`==/\\__/__\\__/__\\__/__\\__/\\`\'--\'\n" + 
"   ~/__/__/^^^^^^^^\\__\\__\\~\n" + 
"=====\n" + 
"              __....__\n" + 
"         .-~~/  \\__/  \\~~-.\n" + 
"        /_/``\\__/  \\__/``\\_\\.--.\n" + 
"       /  \\__/  \\__/  \\__/  \\   o`.\n" + 
"   `==/\\__/__\\__/__\\__/__\\__/\\`\'--\'\n" + 
"      ~/__/__/^^^^^^^^\\__\\__\\~\n" + 
"=====\n" + 
"                 __....__\n" + 
"            .-~~/  \\__/  \\~~-.\n" + 
"           /_/``\\__/  \\__/``\\_\\.--.\n" + 
"          /  \\__/  \\__/  \\__/  \\   o`.\n" + 
"      `==/\\__/__\\__/__\\__/__\\__/\\`\'--\'\n" + 
"         ~/__/__/^^^^^^^^\\__\\__\\~\n" + 
"=====\n" + 
"                    __....__\n" + 
"               .-~~/  \\__/  \\~~-.\n" + 
"              /_/``\\__/  \\__/``\\_\\.--.\n" + 
"             /  \\__/  \\__/  \\__/  \\   o`.\n" + 
"         `==/\\__/__\\__/__\\__/__\\__/\\`\'--\'\n" + 
"            ~/__/__/^^^^^^^^\\__\\__\\~\n" + 
"=====\n" + 
"                       __....__\n" + 
"                  .-~~/  \\__/  \\~~-.\n" + 
"                 /_/``\\__/  \\__/``\\_\\.--.\n" + 
"                /  \\__/  \\__/  \\__/  \\   o`.\n" + 
"            `==/\\__/__\\__/__\\__/__\\__/\\`\'--\'\n" + 
"               ~/__/__/^^^^^^^^\\__\\__\\~\n" + 
"=====\n" + 
"                          __....__\n" + 
"                     .-~~/  \\__/  \\~~-.\n" + 
"                    /_/``\\__/  \\__/``\\_\\.--.\n" + 
"                   /  \\__/  \\__/  \\__/  \\   o`.\n" + 
"               `==/\\__/__\\__/__\\__/__\\__/\\`\'--\'\n" + 
"                  ~/__/__/^^^^^^^^\\__\\__\\~\n";