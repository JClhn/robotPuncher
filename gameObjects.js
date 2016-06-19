//all changes to sprites are communicated through gameObject
//any object can be collided with, the collidable property means this object handles collisions
var gameObjects = {
	make: function(type,x,y,properties) {  // creates an instance of a game object and pushes it to the allObjects list
		gameObject= Object.create(this.types[type]);
		gameObject.collideBox = Object.create(this.types[type].collideBox);
		gameObject.x=x;                              
		gameObject.y=y;
		if (properties) {
		    gameObject.properties = Object.assign({},properties);
		};
		if (gameObject.sprite === undefined) {
		    gameObject.sprite = "none";
		};
		if (gameObject.sprite != "none") {
		    gameObject.sprite = sprites.make(this.types[type].sprite);
		};
		gameObject.center = function() {
		    var xCenter = this.x + this.collideBox.xOffset + (this.collideBox.width *.5);
		    var yCenter = this.y + this.collideBox.yOffset + (this.collideBox.height *.5);
		    return { 
		            x: xCenter,
		            y: yCenter
		    };
		};
		gameObject.topLeft = function() {
		    var xLeft = this.x + this.collideBox.xOffset;
		    var yTop = this.y + this.collideBox.yOffset;
		    return {
		        x: xLeft,
		        y: yTop
		    };
		};
		gameObject.bottomRight = function() {
		    var xRight = this.x + this.collideBox.xOffset + this.collideBox.width;
		    var yBottom = this.y + this.collideBox.yOffset + this.collideBox.height;
		    return {
		        x: xRight,
		        y: yBottom
		    };
		};
		if (gameObject.componentList.movement) {
		    gameObject.moveOut = function(collisionData) {
		         if (Math.abs(collisionData.x) < Math.abs(collisionData.y)) { //horizontal collision
		             this.x -= collisionData.x;
		             if (collisionData.x <= 0) {
	                    this.x = Math.ceil(this.x);
	                 };
	             } else {
	                 this.y -= collisionData.y;
	                 if (collisionData.y <= 0) {
	                     this.y = Math.ceil(this.y);
	                 };
	             };
	        };
	        gameObject.applyMovement = function(xSpeed,ySpeed) {
	            this.y += this.ySpeed*game.delta;
	            this.x += this.xSpeed*game.delta;
	        };
	        gameObject.applyFriction = function(amount) {
	            if (this.ySpeed > 0) {
	                this.ySpeed -= amount;
	                if (this.ySpeed < 0) {
	                    this.ySpeed = 0;
	                };
	            };
	            if (this.ySpeed < 0) {
	                this.ySpeed += amount;
	                if (this.ySpeed > 0) {
	                    this.ySpeed = 0;
	                };
	            };
	            if (this.xSpeed > 0) {
	                this.xSpeed -= amount;
	                if (this.xSpeed < 0) {
	                    this.xSpeed = 0;
	                };
	            };
	            if (this.xSpeed < 0) {
	                this.xSpeed += amount;
	                if (this.xSpeed > 0) {
	                    this.xSpeed = 0;
	                };
	            };
	        }
	        gameObject.accelerate = function(direction,force){
	            if (direction === "up") {
	                if (-this.ySpeed < this.maxSpeed) {
	                    this.ySpeed -= force;
	                }
	            }
	            if (direction === "down") {
	                if (this.ySpeed < this.maxSpeed) {
	                    this.ySpeed += force;
	                }
	            }
	            if (direction === "left") {
	                if (-this.xSpeed < this.maxSpeed) {
	                    this.xSpeed -= force;
	                }
	            }
	            if (direction === "right") {
	                if (this.xSpeed < this.maxSpeed) {
	                    this.xSpeed += force;
	                }
	            }

	        }
	        if (!gameObject.maxSpeed) {
	            gameObject.maxSpeed = 128;
	        }
	        if (!gameObject.xSpeed) {
	            gameObject.xSpeed = 0;
	        }
	        if (!gameObject.ySpeed) {
	            gameObject.ySpeed = 0;
	        }
	    };
	    gameObject.setVisible = function(visibility) {
	        if (visibility === "no") {
	            this.visible = "no";
	        };
	        if (visibility === "yes") {
	            this.visible = "yes";
	            game.renderable.push(this);
	        };
	    };
	    gameObject.setSprite = function(spriteName,xOffset,yOffset) {
	        if (this.sprite.tag != spriteName) {
	            this.sprite = sprites.make(spriteName,xOffset,yOffset);
	        };
	    };
	    gameObject.destroyed = 0;
	    gameObject.destroy = function(objectId) {
	        if (this.destroyed != "yes") {
	        this.destroyed = "yes";
	        game.deadObjects.push(this);
	        };
	    };
		game.allObjects.push(gameObject);
		gameObject.ID = game.allObjects.length -1;
		if (gameObject.componentList.renderable === "yes") {
	            game.renderable.push(gameObject);
	    };
	    if (gameObject.componentList.updateable === "yes") {
	            game.updateable.push(gameObject);        
	    };
	    if (gameObject.componentList.collidable === "yes") {
	            game.collidable.push(gameObject); 
	    };
	    if (gameObject.componentList.checksCollisions === "yes") {
	            game.checksCollisions.push(gameObject);
	    };
	    if (gameObject.tag === "player") {
	            game.player = gameObject;
	    };
	    if (gameObject.initialize) {
	        gameObject.initialize();
	    };

		return gameObject;
	},
	objectIndex: [],
	types: []
		
};
gameObjects.types["generic"]= {  //generic
	tag: "generic",
	x: 0,
	y:0,
	visible: "no",
	collideBox: {
	    xOffset: 0,
	    yOffset: 0,
	    width: 0,
	    height: 0
	},
	componentList: {},
	properties: {}
};
gameObjects.types["player"]= { //player
	tag: "player",
	family: "player",
	visible: "yes",
	x: 0,
	y: 0,
	xSpeed: 0,
	ySpeed: 0,
	componentList: {
	    movement: "yes",
	    checksCollisions: "yes",
	    collidable: "yes",
	    updateable: "yes",
	    renderable:"yes"
	},
	collideBox: {
	    xOffset:3,
	    yOffset:8,
	    width: 7,
	    height:8
	},
	collidesWith: ["wall","enemy"],
	maxSpeed: 96,
	acceleration: 32,
	friction: 16,
	deathTime: .5,
	deathTimer: .5,
	punchTime: 0.3,
	punchTimer: 0,
	punchState: 0,
	superPunchTime: .5,
	superPunchForce: 128,
	regularPunchForce: 0,
	state: "stand",
	direction: "down",
	sprite: "newVetStandDown",
    initialize: function() {
        this.fists = [];
        this.fists.up = gameObjects.make("fist",0,0);
        this.fists.down = gameObjects.make("fist",0,0);
        this.fists.left = gameObjects.make("fist",0,0);
        this.fists.right = gameObjects.make("fist",0,0);
        this.fists.up.direction = "up";
        this.fists.down.direction = "down";
        this.fists.left.direction = "left";
        this.fists.right.direction = "right";
        this.fists.up.collideBox = {
            xOffset: 0,
            yOffset: 0,
            width:8,
            height:6
        };
        this.fists.down.collideBox = {
            xOffset: 1,
            yOffset: 12,
            width:8,
            height:6
        };
        this.fists.left.collideBox = {
            xOffset: -2,
            yOffset: 4,
            width:6,
            height:8
        };
        this.fists.right.collideBox = {
            xOffset: 7,
            yOffset: 4,
            width:6,
            height:8
        };
        this.fists.up.sprite = sprites.make("fistSwooshUp",this.fists.up.collideBox.xOffset,this.fists.up.collideBox.yOffset);
        this.fists.down.sprite = sprites.make("fistSwooshDown",this.fists.down.collideBox.xOffset,this.fists.down.collideBox.yOffset);
        this.fists.left.sprite = sprites.make("fistSwooshLeft",this.fists.left.collideBox.xOffset,this.fists.left.collideBox.yOffset);
        this.fists.right.sprite = sprites.make("fistSwooshRight",this.fists.right.collideBox.xOffset,this.fists.right.collideBox.yOffset);

    },

	punchMove: function(power) {
	        if (this.direction === "down") {
	            this.ySpeed += power;
			};
			if (this.direction === "up") {
			    this.ySpeed -= power;
			 };
			 if (this.direction === "right") {
			     this.xSpeed += power;
			 };
			 if (this.direction === "left") {
			     this.xSpeed -= power;
			 };
	},
	getDirection: function(oldDirection) {
	    var direction;
	    if (keysDown[upKey]) { 
				direction = "up";
			} else if (keysDown[downKey]) { 
				    direction = "down";
			} else if (keysDown[rightKey]) { 
				    direction = "right";
			} else if (keysDown[leftKey]) { 
				    direction = "left"
			} else{
			    direction = oldDirection;
			};
			return direction
	},
	update: function() {
	        if (this.state === "die") {
	            this.deathTimer -= game.delta;
	            if (this.deathTimer <= 0) {
	                this.deathTimer = this. deathTime;
	                this.state = "stand";
	            };
	            if (this.direction === "down") {
	                this.ySpeed = -40;
	            };
	            if (this.direction === "up") {
	                this.ySpeed = 40;
	            };
	            if (this.direction === "left") {
	                this.xSpeed = 40;
	            };
	            if (this.direction === "right") {
	                this.xSpeed = -40;
	            };
	                
	        };
	       if (this.state === "stand") {
			    if (keysDown[leftKey] || keysDown[rightKey] || keysDown[upKey] || keysDown[downKey]) {
			        this.state = "run"
			    };
			    if (keysDown[punchKey]) {
			        
			         this.state = "punch";
			     };
			 };
			 if (this.state === "run") {
			     this.direction = this.getDirection(this.direction);
			     if (this.direction === "up") {
			         if (Math.abs(this.ySpeed) < this.maxSpeed) {
			             this.ySpeed -= this.acceleration;
			         };
			     };
			     if (this.direction === "down") {
			         if (Math.abs(this.ySpeed) < this.maxSpeed) {
			             this.ySpeed += this.acceleration;
			         };
			     };
			     if (this.direction === "left") {
			         if (Math.abs(this.xSpeed) < this.maxSpeed) {
			             this.xSpeed -= this.acceleration;
			         };
			     };
			     if (this.direction === "right") {
			         if (Math.abs(this.xSpeed) < this.maxSpeed) {
			             this.xSpeed += this.acceleration;
			         };
			     };
			     if (keysUp[upKey] && keysUp[downKey] && keysUp[leftKey] && keysUp[rightKey]) {
			         this.state = "stand" ;
			     };
			     if (keysDown[punchKey]) {
			         
			         this.state = "punch";
			     };
			 };
			 //punch handling
			 if (this.state === "punch") {
			     this.direction = this.getDirection(this.direction);
			     if (this.direction === "up") {
			         if (Math.abs(this.ySpeed) < this.maxSpeed) {
			             this.ySpeed -= this.acceleration;
			         };
			     };
			     if (this.direction === "down") {
			         if (Math.abs(this.ySpeed) < this.maxSpeed) {
			             this.ySpeed += this.acceleration;
			         };
			     };
			     if (this.direction === "left") {
			         if (Math.abs(this.xSpeed) < this.maxSpeed) {
			             this.xSpeed -= this.acceleration;
			         };
			     };
			     if (this.direction === "right") {
			         if (Math.abs(this.xSpeed) < this.maxSpeed) {
			             this.xSpeed += this.acceleration;
			         };
			     };
			     if (keysUp[upKey] && keysUp[downKey] && keysUp[leftKey] && keysUp[rightKey]) {
			         this.xSpeed = 0 ;
			         this.ySpeed = 0;
			     };


			  
			     if (this.punchState === 0) { // first key press
			         this.fists[this.direction].on();
			         this.punchMove(this.regularPunchForce);
			         this.punchTimer = this.punchTime; 
			         
			         this.punchState = 1; 			         
			     }; 
			     if (this.punchState ===1) { // first key held 
			         this.punchTimer -= game.delta; 
			         if (this.punchTimer < 0) {
			             this.punchTimer = 0;
			         };
			         if (this.punchTimer === 0) { 
			             this.punchState = 8; 
			         };
			         if (keysUp[punchKey]) {  
			             this.punchState = 2; 
			         };
			     };
			     if (this.punchState === 2) { // first key up
			         this.punchTimer -= game.delta; 
			         if (this.punchTimer < 0) {
			             this.punchTimer = 0;
			         };
			         if (this.punchTimer === 0) { 
			             this.punchState = 8; 
			         };
			         if (keysDown[punchKey]) {
			             this.punchState = 3;
			         };
			     };
			     if (this.punchState === 3) { //second key press
			         this.fists[this.direction].on();
			         this.punchMove(this.regularPunchForce);
			         this.punchTimer = this.punchTime; 
			         this.punchState = 4;
			     };
			     if (this.punchState === 4) { // second key held
			         this.punchTimer -= game.delta; 
			         if (this.punchTimer < 0) {
			             this.punchTimer = 0;
			         };
			         if (this.punchTimer === 0) { 
			             this.punchState = 8; 
			         };
			         if (keysUp[punchKey]) {
			             this.punchState = 5;
			         };
			     };
			     if (this.punchState === 5) { //second key up
			         this.punchTimer -= game.delta; 
			         if (this.punchTimer < 0) {
			             this.punchTimer = 0;
			         };
			         if (this.punchTimer === 0) { 
			             this.punchState = 8; 
			         };
			         if (keysDown[punchKey]) {
			             this.punchState = 0;
			         };
			     };
			     if (this.punchState === 6) { //third key press
			         this.punchMove(this.superPunchForce);
			         this.punchTimer = this.superPunchTime; 
			         this.punchState = 7;
			     };
			     if (this.punchState === 7) { //third key held
			         this.punchTimer -= game.delta; 
			         if (this.punchTimer < 0) {
			             this.punchTimer = 0;
			         };
			         if (this.punchTimer === 0) { 
			             this.punchState = 8; 
			         };
			     };
			     if (this.punchState === 8) { //key held timer out
			         if (keysUp[punchKey]) {
			             this.punchState = 0;
			             this.state = "stand"
			         };
			     };
			 };
			 //friction 
			 if (this.ySpeed > 0) {
			    this.ySpeed -= this.friction;
			    if (this.ySpeed < 0) {
			        this.ySpeed = 0;
			    };
			};
			if (this.ySpeed < 0) {
			    this.ySpeed += this.friction;
			    if (this.ySpeed > 0) {
			        this.ySpeed = 0;
			    };
			};
			if (this.xSpeed > 0) {
			    this.xSpeed -= this.friction;
			    if (this.xSpeed < 0) {
			        this.xSpeed = 0;
			    };
			};
			if (this.xSpeed < 0) {
			    this.xSpeed += this.friction;
			    if (this.xSpeed > 0) {
			        this.xSpeed = 0;
			    };
			 };
			this.applyMovement(this.xSpeed,this.ySpeed);
			//this.y += this.ySpeed*game.delta;
			//this.x += this.xSpeed*game.delta;
      
			 
			         
			         
			     
			
			//sprite chooser
			if (this.state === "die" && this.sprite.tag != "playerDie") {
			    this.sprite = sprites.make("playerDie",-8,-8);
			};
			if (this.direction === "down" && this.state === "punch") { 
			    if (this.punchState === 1 && this.sprite.tag != "newVetPunchDown1") {
			        this.sprite = sprites.make("newVetPunchDown1");
			    };
			    if (this.punchState === 4 && this.sprite.tag != "newVetPunchDown2") {
			        this.sprite = sprites.make("newVetPunchDown2");
			    };
			    if (this.punchState === 7 && this.sprite.tag != "newVetPunchDown1") {
			        this.sprite = sprites.make("newVetPunchDown1");
			    };
			    if (this.punchState === 8 && this.sprite.tag != "newVetStandDown") {
			        this.sprite = sprites.make("newVetStandDown");
			    };
			};
			if (this.direction === "right" && this.state === "punch") { 
			    if (this.punchState === 1 && this.sprite.tag != "newVetPunchRight1") {
			        this.sprite = sprites.make("newVetPunchRight1");
			    };
			    if (this.punchState === 4 && this.sprite.tag != "newVetPunchRight2") {
			        this.sprite = sprites.make("newVetPunchRight2");
			    };
			    if (this.punchState === 7 && this.sprite.tag != "newVetPunchRight1") {
			        this.sprite = sprites.make("newVetPunchRight1");
			    };
			    if (this.punchState === 8 && this.sprite.tag != "newVetStandRight") {
			        this.sprite = sprites.make("newVetStandRight");
			    };
			};
			if (this.direction === "left" && this.state === "punch") { 
			    if (this.punchState === 1 && this.sprite.tag != "newVetPunchLeft1") {
			        this.sprite = sprites.make("newVetPunchLeft1",0,0);
			    };
			    if (this.punchState === 4 && this.sprite.tag != "newVetPunchLeft2") {
			        this.sprite = sprites.make("newVetPunchLeft2",0,0);
			    };
			    if (this.punchState === 7 && this.sprite.tag != "newVetPunchLeft1") {
			        this.sprite = sprites.make("newVetPunchLeft1",0,0);
			    };
			    if (this.punchState === 8 && this.sprite.tag != "newVetStandLeft") {
			        this.sprite = sprites.make("newVetStandLeft");
			    };
			};
			if (this.direction === "up" && this.state === "punch") { 
			    if (this.punchState === 1 && this.sprite.tag != "newVetPunchUp1") {
			        this.sprite = sprites.make("newVetPunchUp1",0,0);
			    };
			    if (this.punchState === 4 && this.sprite.tag != "newVetPunchUp2") {
			        this.sprite = sprites.make("newVetPunchUp2",0,0);
			    };
			    if (this.punchState === 7 && this.sprite.tag != "newVetPunchUp1") {
			        this.sprite = sprites.make("newVetPunchUp1",0,0);
			    };
			    if (this.punchState === 8 && this.sprite.tag != "newVetStandUp") {
			        this.sprite = sprites.make("newVetStandUp");
			    };
			};
            if (this.direction === "up" && this.state === "run" && this.sprite.tag != "newVetRunUp"){
                this.sprite = sprites.make("newVetRunUp"); //set sprite to up
            }; 
            if (this.direction === "down" && this.state === "run" && this.sprite.tag != "newVetRunDown"){
                this.sprite = sprites.make("newVetRunDown");
            }; 
            if (this.direction === "left" && this.state === "run" && this.sprite.tag != "newVetRunLeft"){
                this.sprite = sprites.make("newVetRunLeft");
            };
            if (this.direction === "right" && this.state === "run" && this.sprite.tag != "newVetRunRight"){
                this.sprite = sprites.make("newVetRunRight");
            };
            if (this.direction === "up" && this.state === "stand" && this.sprite.tag != "newVetStandUp"){
                this.sprite = sprites.make("newVetStandUp"); //set sprite to up
            }; 
            if (this.direction === "down" && this.state === "stand" && this.sprite.tag != "newVetStandDown"){
                this.sprite = sprites.make("newVetStandDown");
            }; 
            if (this.direction === "left" && this.state === "stand" && this.sprite.tag != "newVetStandLeft"){
                this.sprite = sprites.make("newVetStandLeft");
            };
            if (this.direction === "right" && this.state === "stand" && this.sprite.tag != "newVetStandRight"){
                this.sprite = sprites.make("newVetStandRight");
            };
	},
	collisionResolve: function(objectId,collisionData) {//positive xOverlap means move left, positive y Overlap move up
	    var xOverlap = collisionData.x;
	    var yOverlap = collisionData.y;
	    if (objectId.tag === "wall") {
	        this.moveOut(collisionData);
	    };
	    if (objectId.tag === "mine") {
	        this.state = "die";
	        gameObjects.make("smallBlueExplosion",objectId.x -4,objectId.y-4);
	        objectId.destroy();
	    };
	    if (objectId.tag === "lightningBall") {
	        this.state = "die";
	        objectId.destroy();
	    };
	    if (objectId.tag === "floater") {
	        if (objectId.damaging === "yes") {
	            this.state = "die";
	        }
	    };

	    if (objectId.tag === "zone") {
	        objectId.trigger();
	    };
	    if (objectId.tag === "door") {
	        if (objectId.state != "open") {
	            this.moveOut(collisionData);
	            objectId.trigger();
	        };
	    };



	}
};//end player obj
gameObjects.types["wall"] = { //wall
    tag: "wall",
    sprite: "box",
    visible: "no",
    componentList: {
        collidable: "yes",
    },
    collideBox: {
        xOffset:0,
        yOffset:0,
        width: 8,
        height:8,
    }
    
};
gameObjects.types["mine"] = { //mine
    tag:"mine",
    sprite: "mineArmed",
    visible: "yes",
    componentList: {
        collidable: "yes",
        renderable: "yes"
    },
    collideBox: {
        xOffset: 0,
        yOffset: 1,
        width: 8,
        height: 6
    },
    properties: {
        "property" : "original value"
    },
    state: "armed"
};
gameObjects.types["laserSkull"] = { //laserSkull
    tag:"laserSkull",
    sprite:"skullWaiting",
    visible: "yes",
    direction: "right",
    maxSpeed: 10,
    xSpeed: 0,
    ySpeed: 0,
    componentList: {
        collidable: "yes",
        renderable: "yes",
        updateable: "yes",
        punchable: "yes",
        checksCollisions: "yes",
        movement: "yes",
    },
    collideBox: {
        xOffset: -4,
        yOffset: 1,
        width: 24,
        height: 24
    },
    timer1: 4,
    life: 3,
    triggerDistance: 80,
    state: "waiting",
    initialize: function() {
        this.back = gameObjects.make("skullBack",this.x -8,this.y -8);
    },
    takeDamage: function(damage) {
        if (this.state != "hit") {
            this.life -= damage;
            if (this.life <= 0) {
                this.state = "dying";
                gameObjects.make("bigExplosion",this.x -8,this.y-8);
                this.destroy();
                //gameObjects.make("bigExplosion",this.x,this.y);
            } else {
            this.state = "hit";
            this.sprite = sprites.make("skullHit");
            this.hitTimer = .2;
            };
        };
    },
    update: function() {
        this.accelerate(this.direction,10);
        this.applyMovement(this.xSpeed,this.ySpeed);
        this.back.x = this.x -8;
        this.back.y = this.y -8;
        if (this.state ==="hit") {
            this.hitTimer -= game.delta;
            if (this.hitTimer <= 0) {
                this.state = "waiting";
            };
        };
        if (this.state === "waiting") {
                this.state = "opening";
                this.timer1 = 1;
        };
        if (this.state === "opening") {
            this.timer1 -= game.delta;
            if (this.timer1 <= 0) {
                this.state = "shooting";
                this.timer1 = .5;
            };
        };
        if (this.state === "shooting") {
            var shot = {};
            shot = gameObjects.make("lightningBall",this.x + 4,this.y + 8);
            shot.ySpeed = 8;
            shot.xSpeed = 0;
            shot = gameObjects.make("lightningBall",this.x + 4,this.y + 8);
            shot.ySpeed = 8;
            shot.xSpeed = -8;
            shot = gameObjects.make("lightningBall",this.x + 4,this.y + 8);
            shot.ySpeed = 16;
            shot.xSpeed = 0;
            var shot = gameObjects.make("lightningBall",this.x + 4,this.y + 8);
            shot.ySpeed = 8;
            shot.xSpeed = 8;
            this.state = "doneShooting";
        };
        if (this.state === "doneShooting") {
            this.timer1 -= game.delta;
            if (this.timer1 <= 0) {
                this.state = "closing";
                this.timer1 = 1;
            };
        };
        if (this.state === "closing") {
            this.timer1 -= game.delta;
            if (this.timer1 <= 0) {
                this.state = "waiting";
            };
        };
        //sprite chooser
        if (this.state === "waiting" && this.sprite.tag != "skullWaiting"){
            this.sprite = sprites.make("skullWaiting");
        };
        if (this.state === "opening" && this.sprite.tag != "skullOpening") {
            this.sprite = sprites.make("skullOpening");
        };
        if (this.state === "doneShooting" && this.sprite.tag != "skullShooting") {
            this.sprite = sprites.make("skullShooting");
        };
        if (this.state === "closing" && this.sprite.tag != "skullClosing") {
            this.sprite = sprites.make("skullClosing");
        };
    },
    collisionResolve: function(objectId,collisionData) {
        if (objectId.tag === "wall") {
            if (collisionData.direction === "right") {
                this.direction = "left";
            }
            if (collisionData.direction === "left") {
                this.direction = "right";
            }
        }
    }
};
gameObjects.types["lightningBall"] = { //lightningBall
    tag:"lightningBall",
    sprite:"lightningBall",
    visible: "yes",
    ySpeed: 0,
    xSpeed: 0,
    componentList: {
        movement: "yes",
        renderable: "yes",
        collidable: "yes",
        updateable: "yes",
        checksCollisions: "yes"
    },
    collideBox: {
        xOffset: 2,
        yOffset: 2,
        width: 4,
        height:4
    },
    timer1: 5,
    state: "normal",
    update: function() {
        this.timer1 -= game.delta;
        if (this.timer1 <= 0) {
            this.destroy(this);
        };
        this.applyMovement(this.xSpeed,this.ySpeed);
        
    },
    collisionResolve: function(objectId,collisionData){
        	if (objectId.tag === "wall") {
        	    this.moveOut(collisionData);
	    };

        
    }
};
gameObjects.types["zone"] = {
    tag: "zone",
    visible: "no",
    triggered: "no",
    componentList: {
        collidable: "yes"
    },
    collideBox: {
        xOffset: 0,
        yOffset: 0,
    },
    makeObjects: function() {
        var name = this.name
        function makeIt(objectId) {
            gameObject = gameObjects.make(objectId.type,objectId.x,objectId.y,objectId.properties);
        };
        function findObjLayer(layerElement) {
            return layerElement.name === name;
        };
        var objectLayer = game.currentRoom.layers.find(findObjLayer);
        objectLayer.objects.forEach(makeIt);
    },
    trigger: function() {
        if (this.triggered === "no") {
            this.makeObjects();
            this.triggered = "yes";
        };
    }
            
};
gameObjects.types["fist"] = {
    tag: "fist",
    visible: "no",
    state: "off",
    timer: 0,
    maxSpeed: 128,
    componentList: {
        movement: "yes"
    },
    collideBox: {
    },
    on: function() {
        if (this.state === "off") { 
            //this.xSpeed += game.player.xSpeed;
            //this.ySpeed += game.player.ySpeed;
            this.accelerate(this.direction,128);
            this.accelerate(game.player.direction,game.player.maxSpeed);
            this.timer = .1;
            this.x = game.player.x;
            this.y = game.player.y;
            game.checksCollisions.push(this);
            game.updateable.push(this);
            this.setVisible("yes");
            
            this.state = "on";
        };
    },
    off: function() {
        if (this.state === "on");
            this.xSpeed =0;
            this.ySpeed =0;
            game.checksCollisions.splice(game.checksCollisions.indexOf(this),1);
            game.updateable.splice(game.updateable.indexOf(this),1);
            this.setVisible("no");
            this.state = "off";
    },
    update: function() {
        this.x += game.player.xSpeed * game.delta;
        this.y += game.player.ySpeed * game.delta;
        this.applyMovement();
        this.timer -= game.delta;
        if (this.timer <= 0) {
            this.timer = 0;
            this.off();
        };
    },
    collisionResolve: function(objectId,collisionData) {
        if (objectId.componentList.punchable) {
            objectId.takeDamage(1,this.direction);
        };
    }
};
gameObjects.types["door"] = {
	tag: "door",
	x: 0,
	y:0,
	visible: "yes",
	state: "closed",
	collideBox: {
	    xOffset: 0,
	    yOffset: 0,
	    width: 32,
	    height: 16,
	    
	},
	timer: .5,
	componentList: {
	    renderable: "yes",
	    collidable: "yes",
	    updateable: "yes"
	},
	properties: {
	    orientation: "horizontal"
	},
	initialize: function() {
	    if (this.properties.orientation === "vertical") {
	        //this.setSprite("verticalDoorClosed");
	        this.collideBox.width = 8;
	        this.collideBox.height = 40;
	        console.log(this.y);
	    };
	},
	trigger: function() {
	    if (this.state === "closed") {
	        this.state = "opening";
	    };
	},
	update: function() {
	    if (this.properties.orientation === "vertical") {
	        if (this.state === "opening") {
	            this.setSprite("verticalDoorOpening");
	        };
	        if (this.state === "closing") {
	            this.setSprite("verticalDoorClosing");
	        };
	        if (this.state === "open") {
	            this.setSprite("verticalDoorOpen");
	        };
	        if (this.state === "closed") {
	            this.setSprite("verticalDoorClosed");
	        };

	    };
	    if (this.properties.orientation === "horizontal") {
	        if (this.state === "opening") {
	            this.setSprite("horizontalDoorOpening");
	        };
	        if (this.state === "closing") {
	            this.setSprite("horizontalDoorClosing");
	        };
	        if (this.state === "open") {
	            this.setSprite("horizontalDoorOpen");
	        };
	        if (this.state === "closed") {
	            this.setSprite("horizontalDoorClosed");
	        };

	    };
	    if (this.state === "opening") {
	        this.timer -= game.delta;
	        if (this.timer <= 0) {
	            this.state = "open";
	            this.timer = 3;
	        };
	    };
	    if (this.state === "open") {
	        this.timer -= game.delta;
	        if (this.timer <= 0) {
	            this.state = "closing";
	            this.timer = .5;
	        };
	    };
	    if (this.state === "closing") {
	        this.timer -= game.delta;
	        if (this.timer <= 0) {
	            this.state = "closed";
	            this.timer = .5;
	        };
	    };
	        

	}
    
};
gameObjects.types["floater"]= {  //generic
	tag: "floater",
	x: 0,
	y:0,
	visible: "yes",
	sprite: "floaterNormal",
	speed:32,
	xSpeed: 0,
	ySpeed: 0,
	maxSpeed: 48,
	acceleration: 4,
	collisionDirection: "up", // for instance
	life: 2,
	damaging: "no",
	state: "following",
	recovering: false,
	recoveryTime: .2,
	recoveryTimer: .2,
	collideBox: {
	    xOffset: 1,
	    yOffset: 12,
	    width: 6,
	    height: 4
	},
	componentList: {
	    renderable: "yes",
	    collidable: "yes",
	    checksCollisions: "yes",
	    updateable: "yes",
	    movement: "yes",
	    punchable: "yes"
	},
	properties: {
	    triggered: "no"
	},
	initialize: function() {
	    this.xSpeed = Math.random()*64;
	    this.ySpeed = Math.random()*64;
	},
	follow: function(objectId) {
	    	if (objectId.center().x > this.center().x) {
	    	    this.accelerate("right",this.acceleration);
	    	};
	    	if (objectId.center().x < this.center().x) {
	    	    this.accelerate("left",this.acceleration);
	    	};
	    	if (objectId.center().y > this.center().y) {
	    	    this.accelerate("down",this.acceleration);
	    	};
	    	if (objectId.center().y < this.center().y) {
	    	    this.accelerate("up",this.acceleration);
	    	};
	    	
	    	if (this.center().x > objectId.topLeft().x && this.center().x < objectId.bottomRight().x) {
	    	};
	    	if (this.center().y > objectId.topLeft().y && this.center().y < objectId.bottomRight().y) {
	    	};
	},
	update: function() {
	    if (this.recovering) {
	        this.recoveryTimer -= game.delta;
	        if (this.recoveryTimer <= 0) {
	            this.recoveryTimer = this.recoveryTime;
	            this.recovering = false;
	        }
	    }
	    if (this.life <= 0) {
	        this.destroy();
            gameObjects.make("smallRoundExplosion",this.x - 4,this.y);
	    }
	    if (this.state === "following") {
	        this.follow(game.player);
	    }
	    if (this.state === "attacking") {
	        if (this.sprite.frame === 9) {
	            this.state = "following"
	            this.damaging = "no";
	            this.setSprite("floaterNormal");
	        }
	        if (this.sprite.frame === 2) {
	            this.damaging = "yes";
	        }
	    }
	    /*
	    if (this.state === "recovering") {
	        this.timer -= game.delta;
	        if (this.timer <= 0) {
	            this.state = "following";
	            this.setSprite("floaterNormal");

	        }
	    }
	    */
	    if (this.state === "backingOff") {
	        this.timer -= game.delta;
	        if (this.timer <= 0) {
	            this.state = "following";
	        }
	        if (this.collisionDirection === "up") {
	            this.accelerate("down",this.acceleration)
	        }
	        if (this.collisionDirection === "down") {
	            this.accelerate("up",this.acceleration)
	        }
	        if (this.collisionDirection === "left") {
	            this.accelerate("right",this.acceleration)
	        }
	        if (this.collisionDirection === "right") {
	            this.accelerate("left",this.acceleration)
	        }

	    }
	    this.applyFriction(1);
	    this.applyMovement(this.xSpeed,this.ySpeed);

	},
	collisionResolve: function(objectId,collisionData) {
	    if (objectId.tag === "wall") {
	        this.moveOut(collisionData);
	        this.collisionDirection = collisionData.direction;
	        if (this.state != "attacking") {
	            this.state = "backingOff";
	            this.timer = .2;
	        }
	    }
	    if (objectId.tag === "floater") {
	        this.moveOut(collisionData);
	        if (this.state != "attacking") {
	            this.collisionDirection = collisionData.direction;
	            this.state = "backingOff";
	            this.timer = .5;
	        }
	    }

	    if (objectId.tag === "door") {
	        if (objectId.state != "open") {
	            this.moveOut(collisionData);
	            this.collisionDirection = collisionData.direction;
	        if (this.state != "attacking") {
	            this.state = "backingOff";
	            this.timer = .2;
	        }
	        }
	    }

	    if (objectId.tag === "player") {
	        if (this.state = "following") {
	            this.state = "attacking";
	            //this.xSpeed = 0;
	            //this.ySpeed = 0;
	            this.setSprite("floaterAttacking",-2,0);
	        }
	    }
	},
	takeDamage: function(damage,direction){
	    if ( !this.recovering) {
	        this.life -= 1;
	        this.recovering = true;
	        this.recoveryTimer = .2;
	        this.accelerate(direction,160);
	    }
	}
};
gameObjects.types["skullBack"]= {  //generic
	tag: "skullBack",
	x: 0,
	y:0,
	visible: "yes",
	sprite: "skullBack",
	collideBox: {
	    xOffset: 0,
	    yOffset: 0,
	    width: 0,
	    height: 0
	},
	componentList: {
	    renderable: "yes"},
	properties: {}
};
gameObjects.types["bigExplosion"]= {  //generic
	tag: "bigExplosion",
	x: 0,
	y:0,
	visible: "yes",
	sprite: "bigExplosion",
	collideBox: {
	    xOffset: 0,
	    yOffset: 0,
	    width: 0,
	    height: 0
	},
	componentList: {
	    renderable: "yes",
	    updateable: "yes"
	},
	properties: {},
	update: function() {
	    if (this.sprite.frame === 5) {
	        this.destroy();
	    }
	}
};
gameObjects.types["smallBlueExplosion"]= {  //generic
	tag: "smallBlueExplosion",
	x: 0,
	y:0,
	visible: "yes",
	sprite: "smallBlueExplosion",
	collideBox: {
	    xOffset: 0,
	    yOffset: 0,
	    width: 0,
	    height: 0
	},
	componentList: {
	    renderable: "yes",
	    updateable: "yes"
	},
	properties: {},
	update: function() {
	    if (this.sprite.frame === 5) {
	        this.destroy();
	    }
	}
};
gameObjects.types["smallRoundExplosion"]= {  //generic
	tag: "smallRoundExplosion",
	x: 0,
	y:0,
	visible: "yes",
	sprite: "smallRoundExplosion",
	collideBox: {
	    xOffset: 0,
	    yOffset: 0,
	    width: 0,
	    height: 0
	},
	componentList: {
	    renderable: "yes",
	    updateable: "yes"
	},
	properties: {},
	update: function() {
	    if (this.sprite.frame === 7) {
	        this.destroy();
	    }
	}
};







    
        
gameObjects.objectIndex[1]="player"
gameObjects.objectIndex[2]="wall"
gameObjects.objectIndex[4]="mine"
gameObjects.objectIndex[5]="laserSkull"
gameObjects.objectIndex[6]="lightningBall"
    

    


