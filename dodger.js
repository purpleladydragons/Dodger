//TODO: make damage based, tween animations,juice it (music, super anims, loudness of music based on proximity to square?)

var width = 1024,
 height = 640,
 gLoop,
 score = 0,
 lost = false,
 c = document.getElementById('c'),
 ctx = c.getContext('2d');

c.width = width;
c.height = height;

var clear = function(){
	ctx.fillStyle = '#26466d';                   //'#d0e7f9';

	ctx.beginPath();

	ctx.rect(0,0,width,height);

	ctx.closePath();

	ctx.fill();
}

var manyCircles = 10, circles = []; //make html slider to determine # of squares, then use that value instead of this

var Circle = function(xholderbctoolazytoremoveallcases,y,radius,transparency,speed){
	var that = this;
	that.onCollide = function(){
		player.die();
	}

	that.y = y;
	that.r = radius;
	that.x = 0 - that.r;
	that.trans = transparency;
	that.s = speed;
	return that;
}

var GenerateCircles = function(){
	for(var i =0; i < manyCircles;i++){
		circles[i] = new Circle("whocares",Math.random()*height,Math.random()*100,Math.random()/2,Math.random()*15);
	}
}

var DrawCircles = function(){
	for(var i = 0;i < manyCircles; i++){
		ctx.fillStyle = 'rgba(255,255,255,' + circles[i].trans + ')';
		ctx.beginPath();
		//ctx.arc(circles[i].x,circles[i].y,circles[i].r,0, Math.PI *2, true);
		ctx.rect(circles[i].x,circles[i].y,circles[i].r,circles[i].r);
		ctx.closePath();
		ctx.fill();
	}
};

var MoveCircles = function(dy){
	for(var i = 0;i < manyCircles;i++){
		if(circles[i].x-circles[i].r > width){
			circles[i].y = Math.random() *height;
			circles[i].r = Math.random() *100;
			circles[i].x = 0 - circles[i].r;
			circles[i].trans = Math.random()/2;
			circles[i].s = Math.random()*15;
		} else {
			circles[i].x+=circles[i].s;
		}

	}
};


var player = new (function(){
	var that = this;
	that.image = new Image();
	that.image.src = "cycle.png";
	that.width = 16;
	that.height = 16;
	
	that.x = 0;
	that.y = 0;

	that.movement = 16;

	that.interval = 0;

	that.direction = 'none';

	that.setPosition = function(x,y){
		that.x = x;
		that.y = y;
	}

	that.draw = function(){
		try{
			ctx.drawImage(that.image, 0, 0, that.width, that.height, that.x, that.y, that.width, that.height);
		} catch (e){} 
		that.interval++
	}

	that.moveLeft = function(){
		that.setPosition(that.x-that.movement,that.y)
	}

	that.moveRight = function(){
		that.setPosition(that.x+that.movement,that.y)
	}
	
	that.moveUp = function(){
		that.setPosition(that.x,that.y-that.movement)
	}

	that.moveDown = function(){
		that.setPosition(that.x,that.y+that.movement)
		
	}

	that.move = function(dir){
		if(that.interval==3){ //this might cause unexpected lag between moves
			that.interval = 0;
		if (dir == 'left'){
			that.moveLeft();
		}else if (dir == 'up'){
			that.moveUp();
		} else if (dir == 'right'){
			that.moveRight();
		} else if (dir == 'down'){
			that.moveDown();
		}
	}
	}

	that.die = function(){ //try to make loss that actually ceases gameloop!
		//lose game 
		lost = true;
		//document.write("you lose, but you scored "+score+" points");	
		ctx.font = '250pt Arial';
		ctx.fillStyle = 'rgb(0,0,0)';
		ctx.textAlign = 'center';
		ctx.fillText(score,(width/2)-20,(height/2)+85);
	}
	
})();

var Restart = function(){
	player.direction = 'none';
	player.setPosition(width/2,height/2);
	score = 0;
	lost = false;
	manyCircles = 10;
	circles = [];
	GenerateCircles();
	GameLoop();
}	


document.onkeypress = function(e){
	if(e.keyCode) keycode = e.keyCode;
	else{keycode = e.which}

	//ch = String.fromCharCode(keycode);
	ch = keycode;
	if(ch == 97){ //edit this so that keeps moveLeft()ing until alternate keypress
		player.direction = 'left';
	} else if(ch ==119){
		player.direction = 'up';
	} else if(ch ==100){
		player.direction = 'right';
	} else if(ch ==115){ 
		player.direction = 'down';
	} else if(lost && ((ch == 32)||(ch==114))){
		Restart();
	}		
}

var checkCollision = function(){
	circles.forEach(function(e,ind){
		if((player.x < e.x + e.r )&&(player.x+player.width > e.x )&& //will need -e.r if circle is described at center
		(player.y < e.y + e.r) && (player.y + player.height > e.y)){
			e.onCollide(); //superfluous, just use player.die() unless you add to onCollide
		}
	})
	if((player.x < 0)||(player.y < 0)||(player.x+player.width > width)||(player.y+player.height > height)){
		player.die();
	}
}


//Restart();

	player.setPosition(width/2,height/2);
	


	GenerateCircles();

var GameLoop = function(){
	clear();
	MoveCircles(5);
	DrawCircles();
	player.draw();
	player.move(player.direction);
	checkCollision();
	if(!lost)
	    gLoop = setTimeout(GameLoop,1000/50);
	score++;
	if(score % 100 == 0){ //every 100pts, add another square, ineptly named as a circle
		manyCircles++;
		circles.push(new Circle("whocares",Math.random()*height,Math.random()*100,Math.random()/2,Math.random()*15));
	}
}
GameLoop();
