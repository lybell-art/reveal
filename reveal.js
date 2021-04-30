let myCam;

function setup()
{
	createCanvas(windowWidth,windowHeight,WEBGL);
	myCam=new lybellP5Camera(0, -400, 800, 0,0,0);
	myCam.initialize();
	noStroke();
}
function draw()
{
	background(0);
	//control
	if (keyIsDown(UP_ARROW) || keyIsDown(87) ) myCam.rotate(0,1); //W
	if (keyIsDown(DOWN_ARROW) || keyIsDown(83) ) myCam.rotate(0,-1); //S
	if (keyIsDown(LEFT_ARROW) || keyIsDown(65) ) myCam.rotate(-1,0); //A
	if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) ) myCam.rotate(1,0); //D	
	
	lights();
	fill(200);
	box(100,100,50);
}

function windowResized()
{
	resizeCanvas(windowWidth, windowHeight, false);
	myCam.apply();
}
function mouseWheel(event) { //zoom
	let e = event.delta;
	myCam.zoom(e);
}
