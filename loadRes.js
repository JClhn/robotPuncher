var numResources=3;
var resourcesLoaded=0;
var images=[];
var loadImages = function(){
	
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
	
