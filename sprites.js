var sprites = {
	//there is the possibility that the game is running slowly enough that more than
	//one frame of animation should have passed. These functions do not take that
	//into account.
	//if a sprite has no animation, set speed to 0
	// a sprite has tag: a name
	//		strip: the name of an image resource
	//		width: in pixels
	//		height: in pixels
	//		speed: in frames per second
	//		direction: 1 is forward -1 is reverse
	//		numFrames: how many frames in the animation
	//		timeSinceLastFrame: used to calculate when we need a new frame
	//		frame: the frame we are currently showing
	testFunc: function() {cole.log(this)},
	make: function(type,xOffset,yOffset) {
		var sprite= Object.create(sprites.types[type]);
		sprite.timeSinceLastFrame= 0;
		sprite.frame= 0;
		if (xOffset === undefined) {
		    sprite.xOffset = 0;
		} else {
		    sprite.xOffset=xOffset;
		};
	
		if (yOffset === undefined) {
		    sprite.yOffset = 0;
		} else {
		    sprite.yOffset=yOffset;
		};
		sprite.render = sprites.render;
		return sprite;
	},
	render: function(x,y) {
			if (this.tag !="dummy") {
				//if sprite is animated
				if (this.speed > 0) {
				//check to see if it's time to change frames
					var newTime = game.delta + this.timeSinceLastFrame;
					this.timeSinceLastFrame = newTime;
					if (newTime >= 1/this.speed) {
						this.timeSinceLastFrame=0;
						//if it is, get the frame number
						this.frame  += this.direction;
						if (this.frame > (this.numFrames-1)){
						    if (this.loop === "no"){
						        this.frame = this.numFrames - 1;
						    } else {
						        this.frame = 0;
						    };
						};
						if (this.frame < 0) {
							this.frame = (this.numFrames-1)
						};
					};
				};
				x= Math.round(x - game.camera.x);
				y= Math.round(y - game.camera.y);
				ctx.drawImage(images[this.strip],this.frame*this.width+this.sheetX,this.sheetY,this.width,this.height,x + this.xOffset,y+ this. yOffset,this.width,this.height);
				
			};
	},
	types: []

};
sprites.types["dummy"]= {
		tag: "dummy",
		strip: "none",
		sheetX: 0,
		sheety: 0,
		width: 36,
		height:36,
		speed: 10,
		timeSinceLastFrame: 0,
		numFrames: 8,
		frame: 0,
		direction: 1
		};
sprites.types["box"]= {
    tag: "box",
    strip: "tileSet1",
    width: 16,
    height: 16,
    sheetX: 0,
    sheetY: 32,
    speed: 0,
    numFrames: 1,
    direction: 1
};
sprites.types["newVetStandDown"]= {
		tag: "newVetStandDown",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 0,
		sheetY: 0,
		speed: 12,
		numFrames: 1,
		direction: 1
		};
sprites.types["newVetStandUp"]= {
		tag: "newVetStandUp",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 12,
		sheetY: 0,
		speed: 12,
		numFrames: 1,
		direction: 1
		};
sprites.types["newVetStandRight"]= {
		tag: "newVetStandRight",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 24,
		sheetY: 0,
		speed: 12,
		numFrames: 1,
		direction: 1
		};
sprites.types["newVetStandLeft"]= {
		tag: "newVetStandLeft",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 36,
		sheetY: 0,
		speed: 12,
		numFrames: 1,
		direction: 1
		};
sprites.types["newVetRunDown"]= {
		tag: "newVetRunDown",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 0,
		sheetY: 16,
		speed: 16,
		numFrames: 8,
		direction: 1
		};
sprites.types["newVetRunUp"]= {
		tag: "newVetRunUp",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 0,
		sheetY: 32,
		speed: 16,
		numFrames: 8,
		direction: 1
		};
sprites.types["newVetRunRight"]= {
		tag: "newVetRunRight",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 0,
		sheetY: 48,
		speed: 16,
		numFrames: 8,
		direction: 1
		};
sprites.types["newVetRunLeft"]= {
		tag: "newVetRunLeft",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 0,
		sheetY: 64,
		speed: 16,
		numFrames: 8,
		direction: 1
		};
sprites.types["newVetPunchDown1"]= {
		tag: "newVetPunchDown1",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 0,
		sheetY: 80,
		speed: 12,
		numFrames: 3,
		direction: 1,
		loop: "no"
		};
sprites.types["newVetPunchDown2"]= {
		tag: "newVetPunchDown2",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 36,
		sheetY: 80,
		speed: 12,
		numFrames: 3,
		direction: 1,
		loop: "no"
		};
sprites.types["newVetPunchRight1"]= {
		tag: "newVetPunchRight1",
		strip: "newVetSheet",
		width: 13,
		height:16,
		sheetX: 0,
		sheetY: 112,
		speed: 12,
		numFrames: 3,
		direction: 1,
		loop: "no"
		};
sprites.types["newVetPunchRight2"]= {
		tag: "newVetPunchRight12",
		strip: "newVetSheet",
		width: 13,
		height:16,
		sheetX: 39,
		sheetY: 112,
		speed: 12,
		numFrames: 3,
		direction: 1,
		loop: "no"
		};
sprites.types["newVetPunchLeft1"]= {
		tag: "newVetPunchLeft1",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 0,
		sheetY: 128,
		speed: 12,
		numFrames: 3,
		direction: 1,
		loop: "no"
		};
sprites.types["newVetPunchLeft2"]= {
		tag: "newVetPunchLeft2",
		strip: "newVetSheet",
		width: 12,
		height:16,
		sheetX: 36,
		sheetY: 128,
		speed: 12,
		numFrames: 3,
		direction: 1,
		loop: "no"
		};			
sprites.types["newVetPunchUp1"]= {
		tag: "newVetPunchUp1",
		strip: "newVetSheet",
		width: 12,
		height:16,
		yOffset: 1, 
		sheetX: 0,
		sheetY: 96,
		speed: 12,
		numFrames: 3,
		direction: 1,
		loop: "no"
		};
sprites.types["newVetPunchUp2"]= {   
		tag: "newVetPunchUp2",
		strip: "newVetSheet",
		width: 12,
		height: 16,
		yOffset: 1,
		sheetX: 36,
		sheetY: 96,
		speed: 12,
		numFrames: 3,
		direction: 1,
		loop: "no"
		};
sprites.types["playerDie"] = {
    tag: "playerDie",
    strip: "newVetSheet",
    width: 24,
    height: 24,
    sheetX: 0,
    sheetY: 144,
    speed: 16,
    numFrames: 2,
    direction: 1
};
sprites.types["mineArmed"]= {
    tag: "mineArmed",
    strip: "enemySheet",
    width: 8,
    height:8,
    sheetX: 0,
    sheetY: 0,
    speed: 4,
    numFrames: 4,
    direction:1
};
sprites.types["skullWaiting"] = {
    tag: "skullWaiting",
    strip: "enemySheet",
    width: 16,
    height:16,
    sheetX: 0,
    sheetY: 16,
    speed: 1,
    numFrames: 1,
    direction:1

};
sprites.types["skullOpening"] = {
    tag: "skullOpening",
    strip: "enemySheet",
    width: 16,
    height:16,
    sheetX: 0,
    sheetY: 16,
    speed: 4,
    numFrames: 4,
    direction:1,
    loop: "no"

    
};
sprites.types["skullShooting"] = {
    tag: "skullShooting",
    strip: "enemySheet",
    width: 16,
    height:16,
    sheetX: 64,
    sheetY: 16,
    speed: 1,
    numFrames: 1,
    direction:1

};
sprites.types["skullClosing"] = {
    tag: "skullClosing",
    strip: "enemySheet",
    width: 16,
    height:16,
    sheetX: 64,
    sheetY: 16,
    speed: 4,
    numFrames: 4,
    direction: 1,
    loop: "no"

};
sprites.types["skullHit"] = {
    tag: "skullHit",
    strip: "enemySheet",
    width: 16,
    height:14,
    sheetX: 0,
    sheetY: 32,
    speed: 30,
    numFrames: 4,
    direction: 1,

};
sprites.types["skullBack"] = {
    tag: "skullBack",
    strip: "enemySheet",
    width: 32,
    height:24,
    sheetX: 128,
    sheetY: 16,
    speed: 30,
    numFrames: 1,
    direction: 1,
    loop: "no"
};

sprites.types["lightningBall"] = {
    tag: "lightningBall",
    strip: "enemySheet",
    width: 8,
    height:8,
    sheetX: 0,
    sheetY: 8,
    speed: 12,
    numFrames: 8,
    direction:1

};
sprites.types["horizontalDoorOpening"] = {
    tag: "horizontalDoorOpening",
    strip: "enemySheet",
    width: 32,
    height:16,
    sheetX: 32,
    sheetY: 88,
    speed: 12,
    numFrames: 3,
    direction:1,
    loop: "no"
};
sprites.types["horizontalDoorClosing"] = {
    tag: "horizontalDoorClosing",
    strip: "enemySheet",
    width: 32,
    height:16,
    sheetX: 0,
    sheetY: 104,
    speed: 12,
    numFrames: 4,
    direction:1,
    loop: "no"
};
sprites.types["horizontalDoorOpen"] = {
    tag: "horizontalDoorOpen",
    strip: "enemySheet",
    width: 32,
    height:16,
    sheetX: 96,
    sheetY: 88,
    speed: 12,
    numFrames: 1,
    direction:1,
    loop: "no"
};
sprites.types["horizontalDoorClosed"] = {
    tag: "horizontalDoorClosed",
    strip: "enemySheet",
    width: 32,
    height:16,
    sheetX: 0,
    sheetY: 88,
    speed: 12,
    numFrames: 1,
    direction:1,
    loop: "no"
};

sprites.types["verticalDoorOpening"] = {
    tag: "verticalDoorOpening",
    strip: "enemySheet",
    width: 8,
    height:40,
    sheetX: 8,
    sheetY: 48,
    speed: 12,
    numFrames: 3,
    direction: 1,
    loop: "no"
};
sprites.types["verticalDoorClosing"] = {
    tag: "verticalDoorClosing",
    strip: "enemySheet",
    width: 8,
    height:40,
    sheetX: 32,
    sheetY: 48,
    speed: 12,
    numFrames: 3,
    direction: 1,
    loop: "no"
};
sprites.types["verticalDoorOpen"] = {
    tag: "verticalDoorOpen",
    strip: "enemySheet",
    width: 8,
    height:40,
    sheetX: 24,
    sheetY: 48,
    speed: 0,
    numFrames: 1,
    direction:1,
    loop: "no"
};
sprites.types["verticalDoorClosed"] = {
    tag: "verticalDoorClosed",
    strip: "enemySheet",
    width: 8,
    height: 40,
    sheetX: 0,
    sheetY: 48,
    speed: 0,
    numFrames: 1,
    direction:1,
    loop: "no"
};
sprites.types["floaterNormal"] = {
    tag: "floaterNormal",
    strip: "enemySheet",
    width: 8,
    height: 16,
    sheetX: 0,
    sheetY: 128,
    speed: 12,
    numFrames: 8,
    direction:1,
    loop: "yes"
};
sprites.types["floaterAttacking"] = {
    tag: "floaterAttacking",
    strip: "enemySheet",
    width: 12,
    height: 16,
    sheetX: 0,
    sheetY: 144,
    speed: 12,
    numFrames: 10,
    direction:1,
    loop: "no"
};
sprites.types["bigExplosion"] = {
    tag: "bigExplosion",
    strip: "enemySheet",
    width: 32,
    height: 32,
    sheetX: 0,
    sheetY: 160,
    speed: 12,
    numFrames: 6,
    direction:1,
    loop: "no"
};
sprites.types["smallBlueExplosion"] = {
    tag: "smallBlueExplosion",
    strip: "enemySheet",
    width: 16,
    height: 16,
    sheetX: 0,
    sheetY: 192,
    speed: 12,
    numFrames: 6,
    direction:1,
    loop: "no"
};
sprites.types["smallRoundExplosion"] = {
    tag: "smallRoundExplosion",
    strip: "enemySheet",
    width: 16,
    height: 16,
    sheetX: 0,
    sheetY: 208,
    speed: 12,
    numFrames: 8,
    direction:1,
    loop: "no"
};
sprites.types["fistSwooshRight"] = {
    tag: "fistSwooshRight",
    strip: "newVetSheet",
    width: 12,
    height: 10,
    sheetX: 0,
    sheetY: 168,
    speed: 1,
    numFrames: 1,
    direction:1,
    loop: "no"
};
sprites.types["fistSwooshLeft"] = {
    tag: "fistSwooshLeft",
    strip: "newVetSheet",
    width: 12,
    height: 10,
    sheetX: 12,
    sheetY: 168,
    speed: 1,
    numFrames: 1,
    direction:1,
    loop: "no"
};
sprites.types["fistSwooshUp"] = {
    tag: "fistSwooshUp",
    strip: "newVetSheet",
    width: 12,
    height: 10,
    sheetX: 24,
    sheetY: 168,
    speed: 1,
    numFrames: 1,
    direction:1,
    loop: "no"
};
sprites.types["fistSwooshDown"] = {
    tag: "fistSwooshDown",
    strip: "newVetSheet",
    width: 12,
    height: 10,
    sheetX: 36,
    sheetY: 168,
    speed: 1,
    numFrames: 1,
    direction:1,
    loop: "no"
};
















