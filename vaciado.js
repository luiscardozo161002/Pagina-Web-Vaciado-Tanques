function drawGrid(color, stepx, stepy) {
   ctx.save()
   ctx.strokeStyle = color;
   ctx.fillStyle = '#ffffff';
   ctx.lineWidth = 0.5;
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   for (var i = stepx + 0.5; i < canvas.width; i += stepx) {
     ctx.beginPath();
     ctx.moveTo(i, 0);
     ctx.lineTo(i, canvas.height);
     ctx.stroke();
   }

   for (var i = stepy + 0.5; i < canvas.height; i += stepy) {
     ctx.beginPath();
     ctx.moveTo(0, i);
     ctx.lineTo(canvas.width, i);
     ctx.stroke();
   }
   ctx.restore();
}

var canvas = document.getElementById('canvas_1'),
	ctx = canvas.getContext('2d');
ctx.font = '13px Helvetica';
var wChar= ctx.measureText('m').width;

//orígenes
var orgX=4*wChar, 
	orgY=canvas.height-5*wChar/2,
//escalas
    escala=(canvas.height-2*wChar)/0.5,
//parámetros
    rDeposito=0.10,     //e m
    rOrificio=0.01,
    h0=0.45,    //altura incial en m
    h=h0, //altura del fluido en cada instante
    t=0.0, 
	dt=0.05,
    tMax, //tiempo hasta que se descarga por completo
    cte,
    bAbre=false,
	pol=[];
 

function tubo(g){
    var anchoTubo=escala*2*rDeposito;
    g.strokeStyle='black';
	g.lineWidth=2;
	g.beginPath();
    g.moveTo(orgX, orgY);
	g.lineTo(orgX, 0);
    g.moveTo(orgX+anchoTubo, orgY);
	g.lineTo(orgX+anchoTubo, 0);
    var radio=rOrificio*escala;
    g.moveTo(orgX, orgY);
	g.lineTo(orgX+anchoTubo/2-radio, orgY);
    g.moveTo(orgX+anchoTubo/2+radio, orgY);
	g.lineTo(orgX+anchoTubo, orgY);
	g.stroke();
//fluido
	g.lineWidth=1;
    g.fillStyle='cyan';
    var y1=escala*h;
    g.fillRect(orgX+1, orgY-y1, anchoTubo-2, y1);
    if(bAbre && t<tMax){
        g.beginPath();
        g.moveTo(orgX+anchoTubo/2-radio, orgY);
        g.lineTo(orgX+anchoTubo/2+radio, orgY);
        g.lineTo(orgX+anchoTubo/2+radio+wChar, canvas.height);
        g.lineTo(orgX+anchoTubo/2-radio-wChar, canvas.height);
		g.closePath();
		g.fill();
    }else{
        g.strokeStyle='red';  //compuerta
		g.beginPath();
        g.moveTo(orgX+anchoTubo/2-radio, orgY);
		g.lineTo(orgX+anchoTubo/2+radio, orgY);
		g.stroke();
    }
	g.textAlign='left';
	g.textBaseline='bottom';
    g.fillStyle='black';
    g.fillText((h*100).toFixed(1), orgX+anchoTubo-4*wChar, orgY-y1);
    g.strokeStyle='black';
	g.textAlign='right';
	g.textBaseline='middle';
    g.beginPath();
	for(var i=0; i<=50; i+=10){
        y1=orgY-i*escala/100;
        g.moveTo(orgX, y1);
		g.lineTo(orgX-wChar, y1);
        g.fillText(i, orgX-wChar, y1);
        if(i==50) break;
        for(var j=1; j<10; j++){
            y1=orgY-(i+j)*escala/100;
            g.moveTo(orgX, y1);
			g.lineTo(orgX-wChar/2, y1);
            if(j==5){
				g.moveTo(orgX-3*wChar/4, y1);
				g.lineTo(orgX, y1);
			}
        }
    }
	g.stroke();
}
function grafico(g){
    var orgXGraf=orgX+2*rDeposito*escala+7*wChar;
    var escTiempo=(canvas.width-orgXGraf-2*wChar)/50.0;  //hasta un máximo de 50 s
    g.strokeStyle='black';
	g.beginPath();
    g.moveTo(orgXGraf, orgY);
	g.lineTo(canvas.width, orgY);
    g.moveTo(orgXGraf, orgY);
	g.lineTo(orgXGraf, 0);
	g.textAlign='right';
	g.textBaseline='middle';
    g.fillStyle='black';
    var x1, y1;
    for(var i=0; i<=50; i+=10){
        y1=orgY-i*escala/100;
        g.moveTo(orgXGraf, y1);
		g.lineTo(orgXGraf-wChar, y1);
        g.fillText(i, orgXGraf-wChar, y1);
        if(i==50) break;
        for(var j=1; j<10; j++){
            y1=orgY-(i+j)*escala/100;
            g.moveTo(orgXGraf, y1);
			g.lineTo(orgXGraf-wChar/2, y1);
            if(j==5){
				g.moveTo(orgXGraf-3*wChar/4, y1);
				g.lineTo(orgXGraf, y1);
			}
        }
    }
	g.textAlign='center';
	g.textBaseline='top';
    g.fillText('t (s)', canvas.width-2*wChar, orgY-3*wChar/2);
    g.fillText('h(cm)', orgXGraf+2*wChar, 2);
    for(var i=0; i<=50; i+=5){
        x1=orgXGraf+i*escTiempo;
        g.moveTo(x1, orgY+wChar);
		g.lineTo(x1, orgY);
        g.fillText(i, x1, orgY+wChar);
        if(i==50) break;
        for(var j=1; j<5; j++){
            x1=orgXGraf+(i+j)*escTiempo;
            g.moveTo(x1, orgY+wChar/2);
			g.lineTo(x1, orgY);
        }
    }
	g.stroke();
	g.textAlign='left';
	g.textBaseline='middle';
    g.fillText('tiempo (s) :'+t.toFixed(1), canvas.width-14*wChar, wChar);
    if(bAbre){
		x1=orgXGraf+escTiempo*t;
		y1=orgY-escala*h;
		pol.push({x:x1, y:y1});	
		g.strokeStyle='blue';
		g.beginPath();
		g.moveTo(pol[0].x, pol[0].y);
		for(var i=1; i<pol.length; i++){
			g.lineTo(pol[i].x, pol[i].y);	
		}
		g.stroke();
	}
}

function dispositivo(g){
    tubo(g);
    grafico(g);
}
	
var raf, 
	nuevo = document.getElementById('nuevo'),
	empieza = document.getElementById('empieza'),
   paso = document.getElementById('paso'),
	pausa=document.getElementById('pausa');

drawGrid('lightgray', 10, 10);  
dispositivo(ctx);
empieza.disabled=true;
pausa.disabled=true;



nuevo.onclick = function (e) {	
 	rDeposito=parseFloat(document.getElementById('deposito_1').value)/100;
 	rOrificio=parseFloat(document.getElementById('orificio_1').value)/100;
	cte=rOrificio*rOrificio*Math.sqrt(4.9/(rDeposito*rDeposito*rDeposito*rDeposito-rOrificio*rOrificio*rOrificio*rOrificio));
    h=h0;
    t=0.0;
    pol.length=0;
    bAbre=true;
    tMax=Math.sqrt(h0)/cte;     //h0 esta en cm

    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid('lightgray', 10, 10);  
    dispositivo(ctx);
    empieza.disabled=false;
    pausa.disabled=true;
	paso.style.display='none';
	pausa.style.display='inline';
	if(raf!=undefined){
        window.cancelAnimationFrame(raf);
    }
}
empieza.onclick = function (e) {
   empieza.disabled=true;
    pausa.disabled=false;
	paso.style.display='none';
	pausa.style.display='inline';
	raf=window.requestAnimationFrame(animate);
}

pausa.onclick = function (e) {
  empieza.disabled=false;
    pausa.disabled=true;
	paso.style.display='inline';
	pausa.style.display='none';
    window.cancelAnimationFrame(raf);
}

paso.onclick = function (e) {
    update();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid('lightgray', 10, 10);  
    dispositivo(ctx);
}


function update() {
    h=(Math.sqrt(h0)-cte*t)*(Math.sqrt(h0)-cte*t);    // h0 en m
    t+=dt;
}

function animate(time) {
    update();
	if (t>tMax){
       window.cancelAnimationFrame(raf);
        pausa.disabled=true;
 	}else{
        raf=window.requestAnimationFrame(animate);
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid('lightgray', 10, 10);  
    dispositivo(ctx);
}
