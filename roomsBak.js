var rooms = {
    make: function(type) { //called by game. loads a room into game.current room
        var room = Object.create(rooms.types[type]);
        room.widthPixels = room.tileWidth * room.width;
        room.heightPixels = room.tileHeight * room.height;
        room.tileSet.width = images[room.tileSet.set].width/room.tileWidth;
        room.tileSet.height = images[room.tileSet.set].height/room.tileHeight;
        room.renderNoScroll = rooms.renderNoScroll;
        room.renderScroll = rooms.renderScroll;
        room.populateObjects = rooms.populateObjects;
        room.mapImage = rooms.drawMap(room,0);
        return room;
        },
    renderNoScroll: function(){
        ctx.drawImage(this.mapImage,0,0);
    },
    /*
    populateObjects: function() {
        for (row = 0; row < this.height; row ++) {
            for (column = 0; column < this.width; column ++) {
                var objValue = this.objectList[(row*this.width)+column];
                if (objValue != -1) {
                    gameObjects.make(gameObjects.objectIndex[objValue],column * this.tileWidth,row * this.tileHeight);
                };
            };
        };
    },
    */
    populateObjects: function() {
        function makeIt(objectId) {
            gameObject = gameObjects.make(objectId.type,objectId.x,objectId.y);
        };
        game.currentRoom.objects.forEach(makeIt);
    },
    
    drawMap: function(room,layer) {
        var backGround =  document.createElement("canvas");
        var backGroundCtx = backGround.getContext("2d");
        backGround.width = room.tileWidth * room.width;
        backGround.height = room.tileHeight * room.height;
        for (row = 0; row < room.height; row ++) {
            for (column = 0; column < room.width; column ++) {
                var tileValue = room.tileMap[layer][(row*room.width)+column];
                if (tileValue != -1) { // 0 means no tile
                    var setXOffset = (tileValue % room.tileSet.width) * room.tileWidth;
                    var setYOffset = (Math.floor(tileValue/room.tileSet.width)) * room.tileHeight;
                    backGroundCtx.drawImage(images[room.tileSet.set],setXOffset,setYOffset,room.tileWidth,room.tileHeight,column * room.tileWidth,row * room.tileHeight,room.tileWidth,room.tileHeight); 
                };
            };
        };
        return backGround;
    },
    
    renderScroll: function(viewX,viewY,viewWidth,viewHeight) {
       // ctx.drawImage(this.mapImage,0,0);
        var x = Math.round(viewX);
        var y = Math.round(viewY);
        ctx.drawImage(this.mapImage,x,y,viewWidth,viewHeight,0,0,viewWidth,viewHeight);
    },
    types: []
};
rooms.types["room0"] = {
    tag: "room0",
    tileWidth: 16,
    tileHeight: 16,
    width: 16,
    height: 12,
    backGround: "none",
    numLayers: 2,
    tileSet: {
            set: "tileSet1",
            width: 0,
            height: 0,
    },
    tileMap: [[1,3,3,3,3,5,38,38,6,3,3,3,3,3,3,2,
20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
16,16,16,16,16,16,16,-1,-1,16,16,16,16,16,16,16,
1,3,3,3,3,3,3,5,6,3,3,3,3,3,3,2,
20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
              [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,16,16,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
      ],
     objectList:[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
-1,2,2,2,2,2,2,-1,-1,2,2,2,2,2,2,2,
2,2,2,2,2,2,2,-1,-1,2,2,2,2,2,2,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
};
rooms.types["room1"] = {
    tag: "room0",
    tileWidth: 16,
    tileHeight: 16,
    width: 16,
    height: 12,
    backGround: "none",
    numLayers: 2,
    tileSet: {
            set: "tileSet1",
            width: 0,
            height: 0,
    },
    tileMap: [[16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,
                1,3,3,3,9,3,5,38,38,6,3,9,3,3,3,2,
                20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
                20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
                20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
                20,0,0,0,11,0,0,0,0,0,0,11,0,0,0,4,
                20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
                20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
                20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
                20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
                20,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,
                16,16,16,16,16,20,0,0,0,0,4,16,16,16,16,16],
                [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
               -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
      ],
     objectList:[2,2,2,2,2,2,-1,-1,-1,-1,2,2,2,2,2,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,2,-1,-1,-1,-1,-1,-1,2,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,2,
2,2,2,2,2,2,-1,-1,-1,-1,2,2,2,2,2,2]
};
	
