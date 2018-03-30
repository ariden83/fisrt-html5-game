/**
 * Copyright (c) 2009, Benjamin Joffe
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE AUTHOR AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var map;
var canvas;
var overlay;
var changement;
var refreshIntervalId;
var perdu;
var audio;
var img 		= 	new Image();
var img2 		= 	new Image();
var imgb 		= 	new Image();
var imgc2 		= 	new Image();
var imgd1		= 	new Image();
var imgd2 		= 	new Image();
var hautVision 	= 	150;
var begin 		= 	0;
var windowHauteur	= 400;
var windowLargeur	= 300;
var tsWallEnCours 	=	[];
//-- pour compter le nombre de hit
var nbrHit 		= 	20;
var numTextures = 	4;
//variables initiated at the bottom of the code...
var pi			=	Math.PI;
var total		=	0;
Number.prototype.range=function(){
	return (this+2*pi)%(2*pi);
}
Number.prototype.roundC=function(){
	return Math.round(this*100)/100;
}
var total		=	0;
//-- perspective
var samples		=	200;
//-- composition du niveau
var arena		=	[];
arena[0]= [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
arena[1]= [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,2,1,0,1,0,0,0,1];
arena[2]= [1,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,3,0,1];
arena[3]= [1,0,0,0,0,3,0,0,1,1,0,2,0,1,1,1,1,0,1,1,1,0,1,1,0,0,0,0,0,3,0,1];
arena[4]= [1,0,0,3,0,3,0,0,0,0,0,2,0,0,0,0,1,0,0,0,1,0,1,0,0,0,3,0,0,0,0,1];
arena[5]= [1,0,0,0,0,3,0,0,0,0,0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,0,3,0,0,0,0,1];
arena[6]= [1,0,0,0,0,3,0,0,0,1,0,2,0,1,1,1,1,0,0,0,1,0,1,0,0,0,3,0,1,1,1,1];
arena[7]= [1,0,0,3,0,3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,1];
arena[8]= [1,0,0,3,0,3,0,0,0,0,0,0,0,0,1,0,2,2,2,0,1,0,1,0,0,0,0,0,0,0,0,2];
arena[9]= [1,0,0,3,0,3,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1];
arena[10]=[1,0,0,3,3,3,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
arena[11]=[1,0,0,0,1,0,2,2,2,0,0,0,0,1]
arena[12]=[1,0,0,0,1,0,0,0,0,0,0,0,0,1]
arena[13]=[1,0,0,0,1,0,2,2,2,2,0,1,0,1]
arena[14]=[1,0,0,0,0,0,0,0,0,0,0,1,0,1]
arena[15]=[1,0,0,0,1,0,2,2,2,2,0,1,0,1]
arena[16]=[1,0,0,0,1,0,0,0,0,0,0,0,0,1]
arena[17]=[1,0,0,1,1,0,1,1,1,1,0,1,0,1]
arena[18]=[1,0,0,0,1,0,1,0,0,0,0,1,0,1]
arena[19]=[1,0,0,0,1,0,1,0,0,0,0,1,0,1]
arena[20]=[1,0,0,0,1,0,1,0,0,0,0,0,0,1]
arena[21]=[1,0,0,0,1,0,1,0,3,3,3,0,0,1]
arena[22]=[1,0,0,0,0,0,0,0,0,0,0,0,0,1]
arena[23]=[1,1,1,1,1,1,1,1,1,1,1,1,1,1]

//-- position du joueur dans le niveau
var playerPos		=	[12,2]; // x,y (from top left)
//-- direction dans laquelle le jouer regarde
var playerDir		=	0.4; // theta, facing right=0=2pi
//-- position en hauteur
var playerPosZ		= 	1;
//-- definir les touches
var key=[0,0,0,0,0,0,0]; // left, right, up, down
var playerVelY		=	0;
var face=[];
//-- pour faire apparaitre les murs
function wallDistance(theta){
	var data		=	[];
	face			=	[];
	tsWallEnCours	=	[];
	//-- position du personnage
	var x 			= playerPos[0], y = playerPos[1];
	var deltaX, deltaY;
	var distX, distY;
	var stepX, stepY;
	var mapX, mapY
	//--
	var atX			=	Math.floor(x), atY=Math.floor(y);
	var thisRow		=	-1;
	var thisSide	=	-1;
	var lastHeight	=	0;
	//--
	for (var i=0; i<samples; i++) {
		
		theta		+=	pi/(3*samples)+2*pi;
		theta		%=	2*pi;

		mapX 		=	atX, mapY = atY;

		deltaX		=	1/Math.cos(theta);
		deltaY		=	1/Math.sin(theta);

		if (deltaX > 0) {
			stepX 	= 1;
			distX 	= (mapX + 1 - x) * deltaX;
		}
		else {
			stepX 	= -1;
			distX 	= (x - mapX) * (deltaX*=-1);		
		}
		if (deltaY >0) {
			stepY 	= 1;
			distY 	= (mapY + 1 - y) * deltaY;
		}
		else {
			stepY 	= -1;
			distY 	= (y - mapY) * (deltaY*=-1);
		}
		
		for (var j=0; j<20; j++) {
			if (distX < distY) {
				mapX += stepX;
				//-- si la case de la map == 1 ou plus
				if (arena[mapX][mapY]) {
					if (thisRow	!= mapX || thisSide	!=	0) {
						if (i	>	0) {
							data.push(i);
							data.push(lastHeight);
						}
						data.push(i);
						data.push(distX);
						thisSide	=	0;
						thisRow		=	mapX;
						face.push(1+stepX);
						tsWallEnCours.push(arena[mapX][mapY]);
					}
					lastHeight=distX;
					break;
				}
				distX += deltaX;
			}else {
				mapY += stepY;
				if (arena[mapX][mapY]) {
					if (thisRow	!=	mapY || thisSide	!=	1) {
						if (i>0) {
							data.push(i);
							data.push(lastHeight);
						}	
						data.push(i);
						data.push(distY);
						
						thisSide	=	1;
						thisRow		=	mapY;
						face.push(2+stepY);
						tsWallEnCours.push(arena[mapX][mapY]);
					}
					lastHeight=distY;
					break;
				}
				distY += deltaY;
			}
		}
	}
	data.push(i);
	data.push(lastHeight);
	return data;
}
//-- fonction pour cr�er la mini map et la carte � chaque mouvement et pour cr�er le perso
function drawCanvas(){
	//-- on efface dans un premier temps tous les graphismes
	//-- efface les rectangles de la map 
	canvas.clearRect(0,0,windowLargeur, windowHauteur);
	var theta 		= 	playerDir - pi / 6;
	var wall		=	wallDistance(theta);
	//map.save();
	map.beginPath();
	//-- efface les rectangles de la mini cartes
	map.clearRect(0,0,800,80);
	//-- on choisit une couleur ici le bleu
	map.fillStyle	=	"#3F8F39";
	map.arc(playerPos[0]*8, playerPos[1]*8, 3, 0, 2*pi, true);
	map.fill();
	map.beginPath();
	map.moveTo(8*playerPos[0], 8*playerPos[1]);
	canvas.clearRect(0,0,400,300);
	canvas.restore();
	//--
	var linGrad;
	var tl,tr,bl,br;
	var theta1,theta2,fix1,fix2;
	//var wallpresent		=	tsWallEnCours[01];
	for (var i = 0; i < wall.length; i	+= 4) {
		var wallpresent	=	tsWallEnCours[i/4];
		theta1			=	playerDir-pi/6 + pi*wall[i]/(3*samples);
		theta2			=	playerDir-pi/6 + pi*wall[i+2]/(3*samples);
		
		fix1 			= 	Math.cos(theta1-playerDir);
		fix2 			= 	Math.cos(theta2-playerDir);

		var h			=	2-playerPosZ;

		var wallH1		=	100/(wall[i+1]*fix1);
		var wallH2		=	100/(wall[i+3]*fix2);
		//-- hautVision d�finit la hauteur de ma vision
		tl				=	[wall[i]*2, 	hautVision-wallH1*h];
		tr				=	[wall[i+2]*2, 	hautVision-wallH2*h]
		br				=	[wall[i+2]*2, 	tr[1]+wallH2*2];
		bl				=	[wall[i]*2, 	tl[1]+wallH1*2]

		var shade1		=	Math.floor(wallH1*2+20); if (shade1>255) shade1=255;
		var shade2		=	Math.floor(wallH2*2+20); if (shade2>255) shade2=255;
		//-- pour chaque carr� on cr�� la couleur correspondant � sa direction
		//linGradb		= 	canvas.createPattern("media/part2.png", repeat);
		//--version avec les d�cors
		linGradb		= 	canvas.createLinearGradient(tl[0],0,tr[0],0);
		linGrad 		= 	canvas.createLinearGradient(tl[0],0,tr[0],0);
		linGradc 		= 	canvas.createLinearGradient(tl[0],0,tr[0],0);
		linGradb.addColorStop(0, '#000');
		linGradb.addColorStop(1, '#000');	
		linGrad.addColorStop(0, 'rgba('+shade1+','+shade1+','+shade1+',0.3)');
		linGrad.addColorStop(1, 'rgba('+shade2+','+shade2+','+shade2+',0.3)');
		//-- version sans les d�cors
		linGradc.addColorStop(0, 'rgba('+(face[i/4]%2==0 ? shade1 : 0)+','+(face[i/4]==1 ? shade1 : 0)+','+(face[i/4]==2 ? 0 : shade1)+',1.0)');
		linGradc.addColorStop(1, 'rgba('+(face[i/4]%2==0 ? shade2 : 0)+','+(face[i/4]==1 ? shade2 : 0)+','+(face[i/4]==2 ? 0 : shade2)+',1.0)');
		//-- version avec les d�cors
		//-- pour importer texture sur un canvas
		canvas.restore();
		canvas.beginPath();
		canvas.setTransform(1, 0, 0, 1, 0, 0);
		canvas.moveTo(tl[0], tl[1]); // point du haut gauche
		canvas.lineTo(tr[0], tr[1]); // point du haut droit
		canvas.lineTo(br[0], br[1]); // point du bas droit
		canvas.lineTo(bl[0], bl[1]); // point du bas gauche
		canvas.fillStyle = linGradb;
		canvas.fill();
		canvas.closePath();
		canvas.beginPath();
		hauteur 	= 	bl[1]-tl[1]; //-- hauteur du triangle
		largeur 	= 	tr[0]-tl[0]; //-- largeur du triangle
		hauteurDef	=	tr[1]-tl[1]; //-- hauteur de l'�cartement
		if(hauteurDef != 0){
			coteLong 	= 	(largeur*largeur) +  (hauteurDef*hauteurDef);
			coteLong	=	Math.sqrt(coteLong);
			angle 		= 	hauteurDef / coteLong;
		}else{
			angle 		= 0;
		}
		canvas.setTransform(1, angle, 0, 1, tl[0], tl[1]);
		//--
		var tetxturePlace1;
		var tetxturePlace2;
		//--
		if(wallpresent == 1){
		//alert(wallpresent);
			tetxturePlace1	=	img;
			tetxturePlace2	=	img2
		}else if(wallpresent == 2){
			tetxturePlace1	=	imgb;
			tetxturePlace2	=	imgc2
		}else if(wallpresent == 3){
			tetxturePlace1	=	imgd1;
			tetxturePlace2	=	imgd2
		}else{
			tetxturePlace1	=	img;
			tetxturePlace2	=	img2
		}
		canvas.drawImage(tetxturePlace1, 1, 1, largeur, hauteur);
		canvas.closePath();
		//-- triangle bhc, h perpendiculaire, calcul de b : bh / bc ou c = ch/ bc 
		//-- le c�t� le plus grand = la somme des deux autres c�t�s au carr� soit bc2 = bh2 + ch2
		canvas.beginPath();
		hauteur 		= 	br[1]-tr[1];	//-- hauteur du triangle
		largeur 		= 	br[0]-bl[0];	//-- largeur du triangle
		angle 			= 	-angle;
		canvas.setTransform(1, angle, 0, 1,  bl[0], tr[1]+hauteurDef);
		canvas.drawImage(tetxturePlace2, 1, 1, largeur,hauteur);
		canvas.closePath();
		//--
		if(wallpresent == 1){
			canvas.beginPath();
			canvas.setTransform(1, 0, 0, 1, 0, 0);
			canvas.moveTo(tl[0], tl[1]); // point du haut gauche
			canvas.lineTo(tr[0], tr[1]); // point du haut droit
			canvas.lineTo(br[0], br[1]); // point du bas droit
			canvas.lineTo(bl[0], bl[1]); // point du bas gauche
			canvas.fillStyle = linGrad;
			canvas.fill();
			canvas.closePath();
			//--
			/*canvas.fill();
			canvas.restore();
			canvas.closePath();*/
		}else{
			canvas.beginPath();
			canvas.setTransform(1, 0, 0, 1, 0, 0);
			//canvas.restore();
			canvas.closePath();
		}
		//canvas.restore();
		//--version sans les d�cors
		/*canvas.beginPath();
		canvas.moveTo(tl[0], tl[1]); // point du haut gauche
		canvas.lineTo(tr[0], tr[1]); // point du haut droit
		canvas.lineTo(br[0], br[1]); // point du bas droit
		canvas.lineTo(bl[0], bl[1]); // point du bas gauche
		canvas.fillStyle = linGradc;
		canvas.fill();
		canvas.closePath();*/
		
		//-- on dessine les lignes pour la mini carte
		map.lineTo(playerPos[0]*8+Math.cos(theta1)*(wall[i+1])*8, playerPos[1]*8+Math.sin(theta1)*(wall[i+1])*8);
		map.lineTo(playerPos[0]*8+Math.cos(theta2)*(wall[i+3])*8, playerPos[1]*8+Math.sin(theta2)*(wall[i+3])*8);
	}
	map.fillStyle="#FF0000"
	map.fill();
	canvas.save();
}
//-- fonction pour ne pas passer entre les murs
function nearWall(x,y){
	var xx,yy;
	if (isNaN(x)) x	=	playerPos[0];
	if (isNaN(y)) y	=	playerPos[1];
	for (var i=-0.1; i<=0.1; i+=0.2) {
		xx=Math.floor(x+i)
		for (var j=-0.1; j<=0.1; j+=0.2) {
			yy		=	Math.floor(y+j);
			if (arena[xx][yy]){ 
				if(!voirEnCours){
					nbrHit --;
					if(nbrHit < 1){
						nbrHit	=	0;
						termineLeJeu();
					}else{
						changement.innerHTML  = nbrHit;
					}
				}
				return true;
			}
		}
	}
	return false;
}
var xOff 			= 	0;
var yOff 			= 	0;
/*var select          =   false;*/
//-- fonction pour faire bouger le couteau
function wobbleGun(){
	var mag			=	playerVelY;
	if (key[6]) {
		xOff 			= 	20;
		yOff 			= 	20;
	}else{
		xOff 			= 	(10+Math.cos(total/6.23)* mag *90);
		yOff 			= 	(10+Math.cos(total/5)	* mag *90);
	}
	overlay.style.backgroundPosition = xOff + "px " + yOff + "px";
}

//-- variable pour faire durer le temps o� le perso saute
var jumpCycle		=	0;
//-- variable pour faire durer le temps o� le perso est accroupi
var dwonCycle		=	0;
//--
var voirEnCours = false;
//-- fonction pour d�terminer les mouvements du personnage en temps r�el
function update(){
	//canvas.addEventListener("mouseMove", onMouseMove(), false);
	total++;
	var change=false;
	if (jumpCycle) {
		jumpCycle--;
		change=true;
		playerPosZ = 1 + jumpCycle*(20-jumpCycle)/110;
	}else if (key[4]) jumpCycle	=	20;
	
	if (key[5]) {
		if (!key[4] && !jumpCycle) {
		change=true;
		playerPosZ 		= 0.7;
		}
	}else if(!key[4] && !jumpCycle){
		change=true;
		playerPosZ 		= 1;
	}
	if (key[6] && !voirEnCours){
		voirEnCours		=	true;
		lanceSon();
		overlay.style.background = "url(media/overlayc.png)";	
	}else if(!key[6] && voirEnCours){
		voirEnCours		=	false;
		overlay.style.background = "url(media/overlay.png)";
	}
	/*if (key[7] ){
			
		//voirEnCours		=	true;
		//lanceSon();
		//overlay.style.background = "url(media/overlayc.png)";	
		alert('kk');
	}else if(key[8]){
	}*/
	
	if (key[0]) {
		if (!key[1]) {
			playerDir	-=	0.07; //left
			change=true;
		}
	}else if (key[1]) {
		playerDir		+=	0.07; //right
		change=true;
	}
	//-- pour changer la position du ciel
	if (change) {
		playerDir		+=	2*pi;
		playerDir		%=	2*pi;
		document.getElementById("sky").style.backgroundPosition	=	Math.floor(1-playerDir/(2*pi)*2400)+"px 0";
	}
	//-- pour vous d�placer sur le c�t�
	if (key[2] && !key[3]) {
		if (playerVelY<0.1) playerVelY += 0.02;
	}else if (key[3] && !key[2]) {
		if (playerVelY>-0.1) playerVelY -= 0.02;
	}
	else {
		if (playerVelY<-0.02) playerVelY += 0.015;
		else if (playerVelY>0.02) playerVelY -= 0.015;
		else playerVelY=0;
	}
	if (playerVelY!=0) {
		//-- on change la position du perso
		var oldX	=	playerPos[0];
		var oldY	=	playerPos[1];		
		var newX	=	oldX+Math.cos(playerDir)*playerVelY;
		var newY	=	oldY+Math.sin(playerDir)*playerVelY;

		if (!nearWall(newX, oldY)) {
			playerPos[0]	=newX;
			oldX			=	newX;
			change			=	true;
		}
		if (!nearWall(oldX, newY)) {
			playerPos[1]	=newY;
			change			=	true;
		}
	}
	if (playerVelY) wobbleGun();
	if (change) drawCanvas();
}
//-- fonction pour receptionner lestouches du clavier
function changeKey(which, to){
	switch (which){
		case 81:	case 37: key[0]		=to; break; // left
		case 90: 	case 38: key[2]		=to; break; // up
		case 68: 	case 39: key[1]		=to; break; // right
		case 83: 	case 40: key[3]		=to; break;// down
		case 32: 			 key[4]		=to; break; // space bar;
		case 48: 	case 82: key[5]		=to; break; // 0
		case 17: 	case 84: key[6]		=to; break; // ctrl
		//case 38 && 32:  key[7]			=to; break; // ctrl
	}
}
document.onkeydown=function(e){changeKey((e||window.event).keyCode, 1);}
document.onkeyup=function(e){changeKey((e||window.event).keyCode, 0);}

function initUnderMap(){
	var underMap		=	$('underMap').getContext("2d");
	underMap.fillStyle	=	"#FFF";
	underMap.fillRect(0,0, 200, 200);
	underMap.fillStyle	=	"#444";
	for (var i=0; i<arena.length; i++) {
		for (var j=0; j<arena[i].length; j++) {
			if (arena[i][j]) underMap.fillRect(i*8, j*8, 8, 8);
		}	
	}
	underMap.save();
}
//-- fonction pour terminer le jeu
function termineLeJeu(){
	clearInterval(refreshIntervalId);
	perdu.style.visibility		= 'visible';	
	changement.style.visibility	= 'hidden';	
}
//-- fonction pour recommencer le jeu
function began(){
	playerPos		=	[12,2];
	playerDir		=	0.4; // theta, facing right=0=2pi
	//-- position en hauteur
	playerPosZ		= 	1;
	changement.style.visibility	= 'visible';
	perdu.style.visibility		= 'hidden';	
	refreshIntervalId = setInterval(update, 35);
	nbrHit			=	20;
	changement.innerHTML = nbrHit;
	underMap.restore();
}
function lanceSon(){
	$('audio').play();
}
//-- fonction pour charger les textures
function chargeTextures(){
	if (!window.CanvasRenderingContext2D) {
		alert('An error has occured, the most likely reason is because you are using an incompatible browser.\nYou must be using one of the following browsers or a newer version:\n\n- Internet Explorer 6\n- Firefox 1.5\n- Safari 1.3\n- Opera 9');
	}else{
		//img.src = (window.opera ? "walls_19color.png" : "walls.png");
		img.src 			= "media/part1.png";
		img2.src 			= "media/part2.png";
		imgb.src 			= "media/partb1.png";
		imgc2.src 			= "media/partb2.png";
		imgd1.src 			= "media/partd1.png";
		imgd2.src 			= "media/partd2.png";
		$('audio').src 		= 'mp3/song.mp3';
		$('audio').onload 	= commence();
		img.onload 			= commence();
		img2.onload 		= commence();
		imgb.onload 		= commence();
		img2c.onload 		= commence();
	}
}
function afficher(event){
    var event 			=  	event || window.event;
    // position de la souris
	var posY 			=	(event.clientY -119);
	if(posY > (windowHauteur / 2) && hautVision <190){
		hautVision 		+= 	posY/5;
		if(hautVision 	> 	190){
			hautVision 	= 	190;
		}
		change			=	true;
	}else if(posY < (windowHauteur / 2)&& hautVision > 140){
		hautVision 		-= 	posY/5;
		if(hautVision 	< 	140){
			hautVision 	= 	140;
		}
		change			=	true;
	}
}
function sortir(){
	canvas.clearRect(0,0,800,400);
	hautVision 					= 150;
	
}
var $ = function(id) { return document.getElementById(id); };
function commence(){
	if(begin == 3){
		audio		=	$("audio");
		map			=	$("map").getContext("2d");
		canvas		=	$("canvas").getContext("2d");
		overlay		=	$("overlay");
		changement	=	$("changement");
		perdu		=	$("perdu");
		perdu.style.visibility		=	'hidden';	
		document.getElementById("sky").style.backgroundPosition	=	Math.floor(-playerDir/(2*pi)*2400)+"px 0";
		drawCanvas();
		initUnderMap();
		$("holder").onmousemove = afficher;
		$("holder").onmouseout  = sortir;
		refreshIntervalId = setInterval(update, 35);
	}else{
		begin++;
		return false;
	}
}
window.onerror	=	function(){
	alert('An error has occured, the most likely reason is because you are using an incompatible browser.\nYou must be using one of the following browsers or a newer version:\n\n- Internet Explorer 6\n- Firefox 1.5\n- Safari 1.3\n- Opera 9');
	window.onerror=function(){};
	return true;
}
