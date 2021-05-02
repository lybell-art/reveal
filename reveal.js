let myCam;
let village;
let skyImg;
let buildingModel=[], starModel;
let lightArr=[];
let myShader;
let hiddenVideo;
const GLOVAL_ZOOM=1000;

function randInt(m,n){return Math.floor(Math.random()*(n-m))+m;}

function drawStar(v)
{
	push();
	translate(v);
	scale(2);
	model(starModel);
	pop();
}

class villageBuilding
{
	constructor(x, y, z, size, typeNo)
	{
		this.x=x;
		this.y=y;
		this.z=z;
		this.size=size;
		this.type=typeNo;
	}
	render()
	{
		push();
		translate(this.x, this.y, this.z);
		rotateX(PI);
		scale(this.size / 50);
		model(buildingModel[this.type]);
		
//		let _height=80+this.type*20;
//		translate(this.x, this.y-_height/2, this.z);
//		box(this.size, _height, this.size);
		pop();
	}
}

class villageSystem
{
	constructor(radius, buildingSize, smallRoadPapping, largeRoadPadding, planeAltitude)
	{
		this.radius=radius;
		this.planeAltitude=planeAltitude;
		this.buildings=[];
		this.resetBuilding(buildingSize,smallRoadPapping, largeRoadPadding);
	}
	resetBuilding(buildingSize, smallRoadSize, largeRoadSize)
	{
		let xPos=[], zPos=[];
		const R=this.radius;
		const innerRadius=R - smallRoadSize - buildingSize/2;
		let xStride=-innerRadius, zStride=-innerRadius;
		let xAdjust = 0, zAdjust = 0;
		let tmpStride;
		
		const roadSize = () => Math.random() >0.8 ? largeRoadSize : smallRoadSize; //get road's width
		const inArea=function(x, z)//check building is in circle
		{
			const diagonalBuildingSize=buildingSize /2 * Math.sqrt(2);
			const rad=R-diagonalBuildingSize;
			return rad*rad >= (x*x+z*z) ;
		};
		
		this.buildings=[]; //clear data
		
		//get building's x/z grid position
		while(xStride<=innerRadius)
		{
			let padding=buildingSize + roadSize();
			tmpStride=xStride;
			xPos.push(xStride);
			xStride += padding;
		}
		xAdjust = -(tmpStride+xPos[0])/2;
		while(zStride<=innerRadius)
		{
			let padding=buildingSize + roadSize();
			tmpStride=zStride;
			zPos.push(zStride);
			zStride += padding;
		}
		zAdjust = -(tmpStride+zPos[0])/2;
		
		//get Each Building's Position
		for(let i=0;i<xPos.length;i++)
		{
			let currentX=xPos[i] + xAdjust;
			this.buildings.push([]);
			for(let j=0;j<zPos.length;j++)
			{
				let currentZ=zPos[j] + zAdjust;
				if(inArea(currentX, currentZ))
				{
					this.buildings[i].push(new villageBuilding(currentX, this.planeAltitude, currentZ, buildingSize, randInt(0,5)));
				}
			}
		}
	}
	renderFloor()
	{
		push();
		translate(0,this.planeAltitude,0);
		fill(17,17,29);
		cylinder(this.radius*2.5,1);
		pop();
	}
	renderBuildings()
	{
		fill(200);
		for(let i=0;i<this.buildings.length;i++)
		{
			for(let j=0;j<this.buildings[i].length;j++)
			{
				this.buildings[i][j].render();
			}
		}
	}
}

function getUniformLightPosition(mousePos)
{
	const MAX_LIGHTS=10;
	let res=[];
	for(let i=0;i<Math.min(lightArr.length, MAX_LIGHTS);i++)
	{
		let a=lightArr[i];
		res.push(a.x, a.y, a.z);
	}
	if(lightArr.length < MAX_LIGHTS) res.push(mousePos.x, mousePos.y, mousePos.z);
	return res;
}

function preload()
{
	skyImg = loadImage('data/images/night_sky.png');
	for(let i=0;i<5;i++)
	{
		buildingModel[i]=loadModel('data/models/building'+ (i+1) +'.obj');
	}
	starModel=loadModel('data/models/star.obj');
	myShader = loadShader("reveal.vert", "reveal.frag");
	hiddenVideo = createVideo(['data/video/reveal_vid.mp4']);
}
function setup()
{
	createCanvas(windowWidth,windowHeight,WEBGL);
	myCam=new lybellP5Camera(0, -GLOVAL_ZOOM*0.5, GLOVAL_ZOOM*1, 0,0,0);
	myCam.initialize();
	myCam.constrainZoom(0,GLOVAL_ZOOM*2.09);
	noStroke();
	village=new villageSystem(GLOVAL_ZOOM*1.2,GLOVAL_ZOOM*0.2,GLOVAL_ZOOM*0.03,GLOVAL_ZOOM*0.1,GLOVAL_ZOOM*0.3);
	
	hiddenVideo.loop();
	hiddenVideo.hide();
	hiddenVideo.volume(0);
}
function draw()
{
	background(0);
	//control
	if (keyIsDown(UP_ARROW) || keyIsDown(87) ) myCam.rotate(0,1); //W
	if (keyIsDown(DOWN_ARROW) || keyIsDown(83) ) myCam.rotate(0,-1); //S
	if (keyIsDown(LEFT_ARROW) || keyIsDown(65) ) myCam.rotate(-1,0); //A
	if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) ) myCam.rotate(1,0); //D	
	
	push();
	texture(skyImg);
	sphere(GLOVAL_ZOOM*2.1);
	pop();
	village.renderFloor();
	
	let mousePos=myCam.screenTo3DRevolveToTarget(mouseX - windowWidth/2,mouseY - windowHeight/2,0.5);
	let uLightPos=getUniformLightPosition(mousePos);
//	pointLight(255,255,255,mousePos);
	
	myShader.setUniform('uResolution', [width, height]);
	myShader.setUniform('lightPos', uLightPos);
	myShader.setUniform('lightCount', uLightPos.length / 3);
	myShader.setUniform('video', hiddenVideo);
	shader(myShader);
	village.renderBuildings();
	resetShader();
	emissiveMaterial(255, 255, 255);
	for(let i=0;i<lightArr.length;i++)
	{
		drawStar(lightArr[i]);
	}
	hiddenVideo.volume(constrain(lightArr.length / 20.0, 0.0, 1.0));
}

function mousePressed()
{
	let mousePos=myCam.screenTo3DRevolveToTarget(mouseX - windowWidth/2,mouseY - windowHeight/2,0.5);
	lightArr.push(mousePos);
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
