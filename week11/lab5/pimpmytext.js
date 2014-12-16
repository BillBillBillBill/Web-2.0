$=function(id) {return (typeof (id)=='object')?id:document.getElementById(id);};

function changecolor() {
    var box = $("ta").style;
    box.color="red";
    if (!box.fontSize)
        box.fontSize="24pt";
    else
    box.fontSize=parseInt(box.fontSize)+2+"pt";
}

function check(x) {
    var item = $("ta");
    if(x.checked)
    {
        item.className="bling";
        document.body.style.backgroundImage="url(\"hundred-dollar-bill.jpg\")";
    }
    else
    {
        item.className="";
        document.body.style.backgroundImage="";
    }
}

function changetext() {
    $("ta").value=$("ta").value.toUpperCase().replace(/\./g,"-izzle.");
}

function up() {
    $("ta").style.fontSize=parseInt($("ta").style.fontSize)+2+"pt";
    setTimeout("up()", 500);
}

function Malkovitch() {
    $("ta").value=$("ta").value.replace(/\w{5}/g,"Malkovich");
}

function Igpay() {
    var yuanyin = ["a","e","i","o","u"];
    var words = $("ta").value.split(/\s+/);
    for (var i = 0; i < words.length; i++) {
        if (yuanyin.indexOf(words[i][0]) == -1) {
            words[i] = words[i].slice(1)+words[i][0]+"-ay";
        }
        else {
            words[i] = words[i]+"-ay";
        }
    }
    $("ta").value=words.join(" ");
}