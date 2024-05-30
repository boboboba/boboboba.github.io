'use strict'

window.onload = () => {

let		canvas = document.createElement('canvas'), //Создание холста
		ctx = canvas.getContext('2d'), //создание переменной контекста. Через обращение к ней будет выводиться все изображение

// Ширина и высота экрана и холста
		w		= canvas.width  = window.innerWidth,
		h 		= canvas.height = window.innerHeight;

		document.querySelector('body').appendChild(canvas);

// game set
let		tile		= 64, 
		fov			= 70   * Math.PI/180,
		num_rays	= w/3,
		max_dist	= tile*16,
		delta_angle		= fov/num_rays,
		surface_dist= (num_rays/2) / Math.tan(fov/2),
		coef = 16/tile,


//Карта
		text_map = [
		'1111111111111111',
		'1......1....1..1',
		'1..1........1..1',
		'1..............1',
		'1..2........2..1',
		'1......3.......1',
		'1..............1',
		'1..............1',	
		'1.....3...22...1',	
		'1....2.3....3..1',	
		'2.3.......3....1',	
		'3......333...2.1',	
		'1....2.........1',	
		'1..2....2...2..1',	
		'1......2...2...1',	
		'1111111111111111',	
		];
const textures = {
	a:new Image(),
	b:new Image(),
	c:new Image(),
	
}
textures.a.src = 'https://cdn.vectorstock.com/i/preview-1x/18/88/brick-wall-seamless-pattern-vector-18671888.jpg';//'';
textures.b.src = 'https://cdn.vectorstock.com/i/preview-1x/18/88/brick-wall-seamless-pattern-vector-18671888.jpg';
textures.c.src = 'https://cdn.vectorstock.com/i/preview-1x/18/88/brick-wall-seamless-pattern-vector-18671888.jpg';

const sky = new Image();
sky.src = 'data:image/jpeg;base64,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'



		

//Цвета
let		black	= 'rgb(0,0,0)',
		white	= 'rgb(255,255,255)',
		red		= 'rgb(255, 0, 0)',
		yellow	= 'rgb(255, 255, 0)',
		green	= 'rgb(0, 128, 0)',
		blue	= 'rgb(0, 0, 255)',
		brown 	= 'rgb(150, 75, 0)',
		lightblue = '	rgb(128,128,255)',

		bgcolor = black;

//player set
let		player_set	= {
			x		:tile+1,
			y 		:tile+1,
			speed	:tile/16,
		},
		scale		= Math.ceil(w/num_rays),
		rays		= [];

		
window.onresize = function(){
		w			= canvas.width 	= innerWidth,
		h			= canvas.height = innerHeight;   
		scale		= Math.ceil(w/num_rays);   
		surface_dist= (num_rays/2) / Math.tan(fov/2);
		};



let keys = [false,false,false,false,false,false,false,false];

//Класс игрок
class Player{
	constructor(){
		//Координаты игрока
		this.x = player_set.x;
		this.y = player_set.y;
		//Горизонтальный угол
		this.angle = 0;
		//Вертикальный угол
		this.vangle = 0; //Math.atan(2/4);
	}
//Передвижение игрока
	movement(){		
		let cos = Math.cos(this.angle),
			sin = Math.sin(this.angle);		
		// if (keys[4]) {
		// 	this.angle -= 0.02;
		// }  
		// if (keys[5]) {    
		// 	this.angle += 0.02;
		// }
		let nextX = this.x,
			nextY = this.y,
			dx,dy;
		if (keys[0]) {
			nextX += player_set.speed*cos;
			nextY += player_set.speed*sin;
		}
		if (keys[1]) {
			nextX += player_set.speed*sin;
			nextY -= player_set.speed*cos;
		}
		if (keys[2]) {
			nextX -= player_set.speed*cos;
			nextY -= player_set.speed*sin;
		}
		if (keys[3]) {
			nextX -= player_set.speed*sin;
			nextY += player_set.speed*cos;
		}

		if (!getWall(nextX,this.y)){
			this.x = nextX
		}

		if (!getWall(this.x, nextY)){
			this.y = nextY
		}
		
	}
};

// class Enemy(){
// 	constructor(x,y){
// 		this.x = x;
// 		this.y = y;
// 	}
// }

class Ray{
	constructor(dist,wall,orient){
		this.dist = dist;
		this.wall = wall;
		this.orient = orient;
	}
}

let player = new Player();

//Импорт текстовой карты в моножество с координатами каждой
let map = {
	a:new Set(),
	b:new Set(),
	c:new Set()
	}
text_map.forEach((row, y) => {
	Array.from(row).forEach((cell, x) => {
		
		if (cell == '1') {
			map.a.add(String(x*tile)+','+String(y*tile));
			
		}
		else if (cell == '2') {
			map.b.add(String(x*tile)+','+String(y*tile));
			
		}
		if (cell == '3') {
			map.c.add(String(x*tile)+','+String(y*tile));
			
		}

	});
});

console.log(Boolean(0));

function getWall(x,y){
	let z = String(x-x%tile)+','+String(y-y%tile);
	if (map.a.has(z)){
		return '1';
	}
	else if (map.b.has(z)){
		return '2';
	}
	else if (map.c.has(z)){
		return '3';
	}
	else return false;
}

function getVerticalCollision(Px,Py,angle){
	const sin = Math.sin(angle),
		  cos = Math.cos(angle),
		  tan = Math.tan(angle);
	let x,xa,y,ya,dist,da;

	
	if (cos > 0){
		xa = tile;
		x = Math.floor(Px / tile) * tile;
	}
	else{
		xa = - tile;
		x = Math.floor(Px / tile) * tile + tile - 1;
	}
	ya = xa*tan;
	y = Py - (Px - x) * tan;

	for (let j = 0; j < text_map[0].length; j++){
		x += xa;
		y += ya;
		if (['1','2','3'].includes( getWall(x,y)) ){
			dist = Math.sqrt((x - Px)*(x - Px) + (y - Py)*(y - Py))+1;
			break
		}
	}
	let t = getWall(x,y);
	return{
		t,
		dist,
		x,
		y,
		vertical: true,
	}

}

function getHorizontalCollision(Px,Py,angle){
	const sin = Math.sin(angle),
		  cos = Math.cos(angle),
		  tan = Math.tan(angle);
	let x,xa,y,ya,dist,da;

	if (sin > 0){
		ya = tile;
		y = Math.floor(Py / tile) * tile;
	}
	else{
		ya = - tile;
		y = Math.floor(Py / tile) * tile + tile - 1;
	}

	xa = ya/tan;
	x = Px - (Py - y) / tan;
	dist = -Math.sqrt((Px - x)*(Px - x) + (Py - y)*(Py - y));
	da = Math.sqrt(xa*xa + ya*ya);
	
	for (let j = 0; j < text_map.length; j++){
		x += xa;
		y += ya;
		if (['1','2','3'].includes( getWall(x,y)) ){
			dist = Math.sqrt((x - Px)*(x - Px) + (y - Py)*(y - Py))+1;
			break
		}
	}
	let t = getWall(x,y);
	return{
		t,
		dist,
		x,
		y,
		vertical: false,
	}

}

function getCollision(Px,Py,cur_angle){
	if ( (getHorizontalCollision(Px,Py,cur_angle).dist > 1) &  (getVerticalCollision(Px,Py,cur_angle).dist > 1)){
		if (getHorizontalCollision(Px,Py,cur_angle).dist>getVerticalCollision(Px,Py,cur_angle).dist){
			return getVerticalCollision(Px,Py,cur_angle);
		}
		else{
			return getHorizontalCollision(Px,Py,cur_angle);
	 }
	}
	else {
		if (getHorizontalCollision(Px,Py,cur_angle).dist<getVerticalCollision(Px,Py,cur_angle).dist){
			return getVerticalCollision(Px,Py,cur_angle);
		}
		else{
			return getHorizontalCollision(Px,Py,cur_angle);
		}
	}
	
}

function rayCast(Px,Py,angle){
	let cur_angle = angle - fov/2;
	
	for (let i = 0; i<num_rays;i++){

		let ray = getCollision(Px,Py,cur_angle);
		let dist = ray.dist;
		let offset;
		// ctx.moveTo(player.x * coef,player.y * coef);
		// ctx.lineTo(player.x * coef+dist*Math.cos(cur_angle) * coef,player.y * coef+dist*Math.sin(cur_angle) * coef);
		// ctx.stroke();
		dist *= Math.cos(cur_angle - angle);
		
		if (ray.vertical){
			offset = ray.y % tile; 
		}
		if (!ray.vertical){
			offset = ray.x % tile;
		}
		// if (offset < 1 || offset > tile - 1){
		// 	offset = Math.floor(offset)
		// }
		let c = dist/max_dist;
		let proj_height = scale*surface_dist*tile/dist;
		let texture;

		if (ray.t == '1'){
			texture = textures.a;
		}
		if (ray.t == '2'){
			texture = textures.b;
		}
		if (ray.t == '3'){
			texture = textures.c;
		}
		ctx.drawImage(texture, Math.floor(texture.width * offset / tile), 0,  1,texture.height,
						i*scale,  h*player.vangle+(h - proj_height)/2, scale,proj_height);
		ctx.fillStyle = 'rgba(0,0,0,' + c + ')';
		ctx.fillRect(i*scale,  h*player.vangle+(h - proj_height)/2, scale,proj_height);		
		ctx.fill();
	
		
		cur_angle += delta_angle;
	
	}
}

let lastCalledTime,
	fps,
	sec = Date.now(),
	delta;
function getFPS() {
	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
		return;
	}
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1/delta;
	if (Date.now() - sec>1000){
		sec = Date.now();
	}


} 





function redrawBackground(){
	let skyoffset = -player.angle*w/Math.PI % w;
	ctx.drawImage(sky,skyoffset+w,h*player.vangle+(h/2 - w),w,w);
	ctx.drawImage(sky,skyoffset,h*player.vangle+(h/2 - w),w,w);
	ctx.drawImage(sky,skyoffset-w,h*player.vangle+(h/2 - w),w,w);
	ctx.beginPath();
	// ctx.fillStyle = lightblue;
	// ctx.fillRect(0,0,w, h*player.vangle+h/2);
	var gradient = ctx.createLinearGradient(0,h - h*player.vangle+h/2,0,h*player.vangle+h/2);
	gradient.addColorStop(0, brown);
	gradient.addColorStop(1, 'rgb(16,16,16');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, h*player.vangle+h/2,w,h - h*player.vangle+h/2);
	ctx.closePath();
	
	// map.forEach((row,i) => {

		
	// 	ctx.fillStyle = blue;
	// 	ctx.fillRect(row[0],row[1],tile,tile);
		
	// });
	


}

function minimap(){
	let line = getCollision(player.x,player.y,player.angle).dist
	ctx.beginPath();
	ctx.fillStyle = red;
	ctx.fillRect(0,0,text_map[0].length * tile * coef, text_map.length * tile * coef);
	ctx.fillStyle = green;
	ctx.strokeStyle = green;
	ctx.arc(player.x * coef, player.y * coef, 5, 0, Math.PI*2);
	ctx.closePath();
	ctx.fill();
	ctx.moveTo(player.x * coef,player.y * coef);
	ctx.lineTo((player.x + line * Math.cos(player.angle)) * coef,(player.y + line * Math.sin(player.angle)) * coef);
	ctx.stroke()
	text_map.forEach((row,i) => {
		Array.from(row).forEach((column,j) =>{

			if(column != '.'){

				ctx.fillStyle = blue;
				ctx.fillRect(j * tile * coef,i * tile * coef,tile* coef,tile* coef);
			}
		})	
	});
}
setInterval(function gameLoop(){
	player.movement();
	redrawBackground();
	rayCast(player.x,player.y,player.angle);
	minimap();
	// requestAnimationFrame(gameLoop);
	//getFPS();


},15);


document.addEventListener("keydown", (e) => {
	if (e.keyCode=== 87) {
		keys[0] = true;
	}
	if (e.keyCode === 65) {
		keys[1] = true;
	}
	if (e.keyCode === 83) {
		keys[2] = true;
	}
	if (e.keyCode === 68) {
		keys[3] = true;
	}
	// if (e.keyCode === 37) {
	// 	keys[4] = true;
	// }
	// if (e.keyCode === 39) {
	// 	keys[5] = true;
	// }

		})
document.addEventListener("keyup", (e) => {
	if (e.keyCode === 87) {
		keys[0] = false;
	}
	if (e.keyCode === 65) {
		keys[1] = false;
	}
	if (e.keyCode === 83) {
		keys[2] = false;
	}
	if (e.keyCode === 68) {
		keys[3] = false;
	}
	// if (e.keyCode === 37) {
	// 	keys[4] = false;
	// }
	// if (e.keyCode === 39) {
	// 	keys[5] = false;
	// }
 });

document.addEventListener("mousemove", function (event) {
  player.angle += event.movementX*fov/w;
  if (Math.abs(player.vangle - event.movementY*fov*16/9/w) < Math.PI/8)
  player.vangle -= event.movementY*fov*16/9/w/2;
});

canvas.addEventListener("click", () => {
  canvas.requestPointerLock();
});
}
