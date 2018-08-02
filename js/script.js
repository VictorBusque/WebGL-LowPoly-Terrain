var cols, rows;
var scl = 65;
var cam;
var heightMap;
var triangleMesh = [];

class Triangle{
	constructor(vertices){
		this.vertices = vertices;
		this.height = map(this.getAverageZ(),-100,100,0,100) + random(-10,10);
		this.color;
		this.chooseColor();
	}

	getAverageZ(){
		let avg = 0;
		this.vertices.forEach((vertex)=>{
	  		avg += vertex.z;
		});
		avg = avg/this.vertices.length;
		return avg;
	}

	drawTriangle(){
		this.fillColor();
		this.vertices.forEach((vert)=>{
	  		vertex(vert.x,vert.y,vert.z);
		}); 
	}

	chooseColor() {
		if (this.height > 125) this.color = color(255-this.height/2, 255-this.height/2, 255-this.height/2);
		else if (this.height > 75) this.color = color(139, 190-this.height, 0);
		else if (this.height > 35) this.color = color(65,270-this.height,0);
		else this.color = color(this.height,150+this.height,200-this.height);
	}

	mutateColor() {
		if (frameCount%1==0) {
			if (this.height <= 25) this.color = color(this.height,150+this.height,200-this.height+random(5,50));
		}
	}

	fillColor() {
		this.mutateColor();
		fill(this.color);
	}
}

function setup() {
	createCanvas(windowWidth,windowHeight, WEBGL);
	cols = windowWidth*2/ scl;
	rows = windowHeight*2/ scl;
	frameRate(60);
	heightMap = arr2D();
	generateHeightMap();
	generateTriangleMesh();
}

function arr2D(){
	var arr = [];
	for (var x = 0; x < cols; x++) {
		arr[x] = [];
	}
	return arr;
}

function generateTriangleMesh(){
	triangleMesh = [];
	for (var y = 0; y < rows-1; y++) {
		for (var x = 0; x < cols-1; x++) {
			triangleMesh.push(new Triangle([
				{"x": x*scl,"y": y*scl,"z": heightMap[x][y]},
				{"x": x*scl,"y": (y+1)*scl,"z": heightMap[x][y+1]},
				{"x": (x+1)*scl,"y": (y+1)*scl,"z": heightMap[x+1][y+1]}
			]));
			triangleMesh.push(new Triangle([
				{"x": x*scl,"y": y*scl,"z": heightMap[x][y]},
				{"x": (x+1)*scl,"y": y*scl,"z": heightMap[x+1][y]},
				{"x": (x+1)*scl,"y": (y+1)*scl,"z": heightMap[x+1][y+1]},
			]));
		}
	}
}

function generateHeightMap(){
	var yoff = 0;
	for (var y = 0; y < rows; y++) {
		var xoff = 0;
		for (var x = 0; x < cols; x++) {
			heightMap[x].push(map(noise(xoff, yoff), 0, 1, -200, 300));
			xoff += 0.1;
		}
		yoff += 0.1;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	cols = windowWidth*2/ scl;
	rows = windowHeight*2/ scl;
	heightMap = arr2D();
	generateHeightMap();
	generateTriangleMesh();
}

function draw() {
	console.log(frameRate());
	background(50);
	noStroke();

	translate(-windowWidth, -windowHeight/2, -2000+sin(millis()/500)*-250);
	rotateX(PI/3)

	beginShape(TRIANGLES);
	triangleMesh.forEach((triangle)=>{
		triangle.drawTriangle();
		endShape();
	});
}