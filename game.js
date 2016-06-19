
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 256; //game native resolution
canvas.height = 192;
var scaleFactor = Math.floor(window.innerHeight/canvas.height); //only scale to multiple of native resolution
var newWidth = canvas.width * scaleFactor;
var newHeight = canvas.height * scaleFactor;
canvas.style.width = newWidth + 'px';
canvas.style.height = newHeight + 'px';

//detect browser and set image-rendering based on their arbitrary choices
var user = detect.parse(navigator.userAgent);
if (user.browser.family === "Firefox") {
    canvas.style.imageRendering = "-moz-crisp-edges";
};
if (user.browser.family === "Chrome") {
    canvas.style.imageRendering = "pixelated";
};
// set up cavas scaling to fit window size
var leftMargin =  Math.floor((window.innerWidth/2)-(newWidth/2))
canvas.style.left = leftMargin + "px";
canvas.style.position = "absolute";
document.body.appendChild(canvas);
window.addEventListener("resize", function() {
        var scaleFactor = Math.floor(window.innerHeight/canvas.height); //only scale to multiple of native resolution
        var newWidth = canvas.width * scaleFactor;
        var newHeight = canvas.height * scaleFactor;
        canvas.style.width = newWidth + 'px';
        canvas.style.height = newHeight + 'px';
        var leftMargin =  Math.floor((window.innerWidth/2)-(newWidth/2))
        canvas.style.left = leftMargin + "px";
        canvas.style.position = "absolute";
});
//create background layer for scrolling. we will draw the background on to this
//and clip out the cameras view
//var game.backGround =  document.createElement("canvas");
//var game.backGroundCtx = backGround1.getContext("2d");
//
// set up keys
var keysDown = {};
var keysUp = {};
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
	keysUp[e.keyCode] = false;
}, false);
addEventListener("keyup", function (e) {
	keysDown[e.keyCode]= false;
	keysUp[e.keyCode]= true;
}, false);
//initialize keysUp to true for keys we care about
for(i = 0; i < 42 ; i++) {
    keysUp[i] = true;
    keysDown[i] = false;
};
var leftKey = 37;
var upKey = 38;
var rightKey = 39;
var downKey = 40;
var punchKey = 32;
//
//
var game = {
    delta: .016, // if browser != firefox. ha ha.
	state: "not initialized",
	renderable: [],
	updateable:[],
	collidable:[],
	checksCollisions:[],
	newObjects:[],
	deadObjects:[],
	allObjects: [],
	player: {},
	currentRoom: {},
	camera: {
	    x: 0,
	    y: 0,
	    width: 256,
	    height:192,
	    border: 90,
	    scrollSpeed:96,
	    move: function(){
	        var ySpeed = 0;
	        var xSpeed = 0;
	        if (this.x > -1 && this.x + this.width < game.currentRoom.widthPixels + 1){
	            if (game.player.x - this.x < this.border){
	                if (game.player.xSpeed <0) {
	                    xSpeed = game.player.xSpeed;
	                }
	            }
                if (game.player.x - this.x > this.width - this.border){
	                if (game.player.xSpeed > 0) {
	                    xSpeed = game.player.xSpeed;
	                }
                }
	        }
	        if (this.y > -1 && this.y + this.height < game.currentRoom.heightPixels + 1){
	                if (game.player.y - this.y < this.border) {
	                    if (game.player.ySpeed <0) {
	                        ySpeed = game.player.ySpeed;
	                    }
	                }
	                if (game.player.y - this.y > this.height - this.border) {
	                    if (game.player.ySpeed > 0) {
	                        ySpeed = game.player.ySpeed;
	                    }
	                }
	        }
	        this.x += xSpeed * game.delta;
	        this.y += ySpeed * game.delta;
	       
	        if (this.x < 0) {
	            this.x = 0;
	        };
	        if (this.x > game.currentRoom.widthPixels - this.width) {
	            this.x = game.currentRoom.widthPixels - this.width;
	        };
	        if (this.y < 0) {
	            this.y = 0;
	        };
	        if (this.y > game.currentRoom.heightPixels - this.height) {
	            this.y = game.currentRoom.heightPixels - this.height;
	        };
	    }
	},
	renderBackgrounds: function(layer) {
	    var x = this.camera.x;
	    var y = this.camera.y;
	    var w = this.camera.width;
	    var h = this.camera.height;
	    game.currentRoom.renderScroll(x,y,w,h);
	    
	},
	renderSprites: function() { //iterate through sprites in the render list
	    game.renderable.sort(function(a, b){ //sort sprites by y value
	            return a.bottomRight().y-b.bottomRight().y
                });
		function renderIt(objectId,index) {
		    objectId.sprite.render(objectId.x,objectId.y);
		}
		function removeNonVisible(objectId,index) {
		    if (objectId.visible === "no") {
		        game.renderable.splice(index,1);
		    } 
		}
		game.renderable.forEach(renderIt);
		game.renderable.forEach(removeNonVisible);
	},
	update: function() {//for each gameObject in the updateable array run its update method
		function updateIt(objectId){
		    objectId.update();
		};
		game.updateable.forEach(updateIt);
	},
	checkCollisions: function() { // check for collision, return x and y overlap//change this to use array.forEach
	    function overlap(object1,object2) {
	        var xReturnValue = 16;
	        var yReturnValue = 16;
	        var collisionDirection = "left";
	        if (object1.topLeft().x <= object2.bottomRight().x && 
	            object1.bottomRight().x > object2.topLeft().x &&
	            object1.topLeft().y <= object2.bottomRight().y &&
	            object1.bottomRight().y > object2.topLeft().y) {
	                if (object1.topLeft().x <= object2.topLeft().x) {
	                    xReturnValue = object1.bottomRight().x - object2.topLeft().x;
	                 } else if (object1.bottomRight().x >= object2.bottomRight().x) {
	                     xReturnValue = object1.topLeft().x - object2.bottomRight().x;
	                 };
	                 if (object1.topLeft().y <= object2.topLeft().y) {
	                    yReturnValue = object1.bottomRight().y - object2.topLeft().y;
	                 } else if (object1.bottomRight().y >= object2.bottomRight().y) {
	                     yReturnValue = object1.topLeft().y - object2.bottomRight().y;
	                 };
	                 if (Math.abs(xReturnValue) < Math.abs(yReturnValue)) {//horizontal collision, negative means object to our left
	                     if (xReturnValue > 0) {
	                         collisionDirection = "right";
	                     };
	                     if (xReturnValue <= 0) {
	                         collisionDirection = "left";
	                     };
	                 } else {
	                     if (yReturnValue > 0) {
	                         collisionDirection = "down";
	                     };
	                     if (yReturnValue <= 0) {
	                         collisionDirection = "up";
	                     };
	                 };
	                return {
	                    x: xReturnValue,
	                    y: yReturnValue,
	                    direction: collisionDirection
	                }
	         } else {
	             return false
	         };
	     };
	    var collisionData = 0;
	    var object1Id;
	    var object2Id;
	    for (object1Id = 0; object1Id < game.checksCollisions.length; object1Id++) {//for each item in list of collision handlers
	        for (object2Id = 0; object2Id < game.collidable.length; object2Id++) { // check it against each game object in the room
	            if (game.collidable[object2Id].ID != game.checksCollisions[object1Id].ID) { //dont check against self
	                collisionData = overlap(game.checksCollisions[object1Id],game.collidable[object2Id]);
	                if (collisionData) {
	                    game.checksCollisions[object1Id].collisionResolve(game.collidable[object2Id],collisionData)
	                };
	            };
	        };
	    };
	},
	init: function(){
	    game.loadRoom("room02");
	    game.player.initialize();
		game.state = "initialized";
//test enemies here
		gameObjects.make("laserSkull",50,16)


	},
	loadRoom: function(newRoom) {
	    game.currentRoom = rooms.make(newRoom);
	    game.camera.x = game.currentRoom.cameraStartX;
	    game.camera.y = game.currentRoom.cameraStartY;
	    game.currentRoom.populateObjects();
	},
	removeDeadObjects: function() {
	    function removeIt(objectId) {
	        if (objectId.componentList.checksCollisions) {
	            game.checksCollisions.splice(game.checksCollisions.indexOf(objectId),1);
	        };
	         if (objectId.componentList.collidable) {
	            game.collidable.splice(game.collidable.indexOf(objectId),1);
	        };
	          if (objectId.componentList.updateable) {
	            game.updateable.splice(game.updateable.indexOf(objectId),1);
	        };
	          if (objectId.visible === "yes") {
	              objectId.setVisible("no");
	          };
	        game.allObjects.splice(objectId.ID,1);
	    };
	    game.deadObjects.forEach(removeIt);
	    game.deadObjects = [];
	},
	addNewObject: function(){
	}
};

// game loop
var mainGameLoop = function () {
	var now = Date.now();
	game.delta = (now - then)/1000;
	if (game.delta > .05) { //slow down rather than skip too many frames
	    game.delta = .05;
	};
	if (resourcesLoaded===numResources) {
		if (game.state==="not initialized"){
			game.init();		
		};
		if (game.state==="initialized"){
		        game.update();
		        game.checkCollisions();
		        game.camera.move();
		        game.renderBackgrounds(0);
		        game.renderSprites();
		        game.removeDeadObjects();
		};
	};
	then = now;
	requestAnimationFrame(mainGameLoop);
};

var then = Date.now();
loadImages();
mainGameLoop();

