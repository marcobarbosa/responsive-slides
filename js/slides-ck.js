/**
 *
 * Responsive Slides
 *
 * @author Marco Barbosa
 *
 */var SLIDE=SLIDE||{},SLIDES=function(a,b){var c={},d={context:b.getElementById("viewport"),progressBar:b.querySelector("#progress-bar div")},e=d.context.querySelectorAll("#viewport section"),f={fingerCount:0,moved:!1,startX:0,startY:0,curX:0,curY:0,deltaX:0,deltaY:0,horzDiff:0,vertDiff:0,minLength:72,swipeLength:0,swipeAngle:null,swipeDirection:null},g=!1,h=e.length,i=0,j=function(a){var b=[13,32,34,39],d=[8,33,37];a.preventDefault();b.indexOf(a.keyCode)>-1&&c.doSlide(1);d.indexOf(a.keyCode)>-1&&c.doSlide(-1)},k=function(a){f.fingerCount=0;f.startX=0;f.startY=0;f.curX=0;f.curY=0;f.deltaX=0;f.deltaY=0;f.horzDiff=0;f.vertDiff=0;f.swipeLength=0;f.swipeAngle=null;f.swipeDirection=null},l=function(a){f.fingerCount=a.touches.length;if(f.fingerCount===1){f.startX=a.touches[0].pageX;f.startY=a.touches[0].pageY}else k(a)},m=function(a){a.preventDefault();if(a.touches.length===1){f.curX=a.touches[0].pageX;f.curY=a.touches[0].pageY}else k(a)},n=function(){var a=f.startX-f.curX,b=f.curY-f.startY,c=Math.round(Math.sqrt(Math.pow(a,2)+Math.pow(b,2))),d=Math.atan2(b,a);f.swipeAngle=Math.round(d*180/Math.PI);f.swipeAngle<0&&(f.swipeAngle=360-Math.abs(f.swipeAngle))},o=function(){f.swipeAngle<=45&&f.swipeAngle>=0?f.swipeDirection=1:f.swipeAngle<=360&&f.swipeAngle>=315?f.swipeDirection=1:f.swipeAngle>=135&&f.swipeAngle<=225&&(f.swipeDirection=-1)},p=function(a){a.preventDefault();if(f.fingerCount===1&&f.curX!==0){f.swipeLength=Math.round(Math.sqrt(Math.pow(f.curX-f.startX,2)+Math.pow(f.curY-f.startY,2)));if(f.swipeLength>=f.minLength){n();o();c.doSlide(f.swipeDirection);k(a)}else k(a)}else k(a)},q=function(){var a=parseInt(location.hash.substr(1),10),b=1;i-a<0?b=1:b=-1;c.doSlide(b,a)},r=function(){location.replace("#"+i)};c.doSlide=function(a,b){var d=null,f=null,j=null,k=a>0?"right":"left";b?d=b:d=i+a;if(!a||d<0||d>h-1||g)return;f=e[d];j=e[i];g=!0;j.classList.add("previous");f.classList.add(k);f.classList.add("current");setTimeout(function(){c.resetSlide();i=d;g=!1;c.updateProgressBar();r()},400)};c.updateProgressBar=function(){d.progressBar.style.width=Math.floor((i+1)/h*100)+"%"};c.resetSlide=function(){var a=["current","left","right","previous"];for(var b=0,c=a.length;b<c;b++)e[i].classList.remove(a[b])};var s=function(){b.addEventListener("keydown",j,!0);b.addEventListener("touchstart",l,!0);b.addEventListener("touchmove",m,!0);b.addEventListener("touchend",p,!0);b.addEventListener("touchcancel",k,!0)},t=function(){d.context.webkitRequestFullScreen()};c.init=function(){q();s();b.body.classList.add("ready")};a.onload=function(){c.init()};return c}(window,document);