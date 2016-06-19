var numResources=5;
var resourcesLoaded=0;
var images=[];
var loadImages = function(){
	
	images["testRoom"]= new Image();
	images["testRoom"].onload = function () {
	resourcesLoaded++;
	};
	images["testRoom"].src = "images/testRoom.png";
	images["tileSet1"]= new Image();
	images["tileSet1"].onload = function () {
	resourcesLoaded++;
	};
	images["tileSet1"].src = "images/tileSet1.png";
	images["newVetSheet"]= new Image();
	images["newVetSheet"].onload = function () {
	resourcesLoaded++;
	};
	images["newVetSheet"].src = "images/tinyVetSheet.png";
	images["enemySheet"]= new Image();
	images["enemySheet"].onload = function () {
	resourcesLoaded++;
	};
	images["enemySheet"].src = "images/enemySheet.png";
	images["tinyTileSet1"]= new Image();
	images["tinyTileSet1"].onload = function () {
	resourcesLoaded++;
	};
	images["tinyTileSet1"].src = "images/tinyTiles.png";
	
};
	
