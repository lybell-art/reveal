let myCam;
let village;
let skyImg;
let lightArr=[];

function randInt(m,n){return Math.floor(Math.random()*(n-m))+m;}


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
//		translate(this.x, this.y, this.z);
		let _height=80+this.type*20;
		translate(this.x, this.y-_height/2, this.z);
		box(this.size, _height, this.size);
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
		fill(42,34,39);
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
	let res=[];
	for(let i=0;i<lightArr.length;i++)
	{
		let a=lightArr[i];
		res.push(a.x, a.y, a.z);
	}
	res.push(mousePos.x, mousePos.y, mousePos.z);
	return res;
}

function preload()
{
	skyImg = loadImage('data/images/night_sky.jpg');
}
function setup()
{
	createCanvas(windowWidth,windowHeight,WEBGL);
	myCam=new lybellP5Camera(0, -400, 800, 0,0,0);
	myCam.initialize();
	myCam.constrainZoom(0,2099);
	noStroke();
	village=new villageSystem(1000,100,20,60,250);
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
	sphere(2100);
	pop();
	village.renderFloor();
	
	ambientLight(50);
	directionalLight(200,200,200,-1,1,-1);
	let mousePos=myCam.screenTo3DRevolve(mouseX - windowWidth/2,mouseY - windowHeight/2,0.7,0.2);
//	pointLight(255,255,255,mousePos);
	
	for(let i=0;i<lightArr.length;i++)
	{
		push();
		translate(lightArr[i]);
		sphere(30);
		pop();
	}
	push();
	translate(mousePos);
	sphere(30);
	pop();
	let uLightPos=getUniformLightPosition(mousePos);
	
	village.renderBuildings();
}

function mousePressed()
{
	let mousePos=myCam.screenTo3DRevolve(mouseX - windowWidth/2,mouseY - windowHeight/2,0.7,0.2);
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
