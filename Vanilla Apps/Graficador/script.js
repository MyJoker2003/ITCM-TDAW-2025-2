const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');
const exprInput = document.getElementById('expr');
const xminInput = document.getElementById('xmin');
const xmaxInput = document.getElementById('xmax');
const samplesInput = document.getElementById('samples');
const autoYInput = document.getElementById('autoY');
const redrawBtn = document.getElementById('redraw');
const resetBtn = document.getElementById('reset');
const errorBox = document.getElementById('error');

function clearCanvas(){ ctx.clearRect(0,0,canvas.width,canvas.height); }

function drawGrid(xmin,xmax,ymin,ymax){
  const w = canvas.width, h = canvas.height;
  ctx.save();
  ctx.strokeStyle = '#e6eef8';
  ctx.lineWidth = 1;
  const step = 50;
  for(let x=0;x<=w;x+=step){
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();
  }
  for(let y=0;y<=h;y+=step){
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = '#333';ctx.lineWidth=1.4;
  const toX = x=> (x - xmin)/(xmax - xmin)*w;
  const toY = y=> h - (y - ymin)/(ymax - ymin)*h;
  const y0 = toY(0);
  if(y0>=0&&y0<=h){ctx.beginPath();ctx.moveTo(0,y0);ctx.lineTo(w,y0);ctx.stroke();}
  const x0 = toX(0);
  if(x0>=0&&x0<=w){ctx.beginPath();ctx.moveTo(x0,0);ctx.lineTo(x0,h);ctx.stroke();}
  ctx.restore();
}

function plotExpression(expression,xmin,xmax,samples){
  errorBox.textContent='';
  let compiledExp;
  try{ compiledExp = math.compile(expression); }
  catch(e){ errorBox.textContent='Error sintaxis: '+e.message; return; }
  const xs=[],ys=[];
  for(let i=0;i<samples;i++){
    const t=i/(samples-1);
    const x=xmin+t*(xmax-xmin);
    let y;try{y=compiledExp.evaluate({x});if(!isFinite(y))y=NaN;}catch(e){y=NaN;}
    xs.push(x);ys.push(y);
  }
  let ymin=Infinity,ymax=-Infinity;
  for(const y of ys){ if(!isNaN(y)){ if(y<ymin)ymin=y; if(y>ymax)ymax=y; } }
  if(ymin===Infinity){ymin=-1;ymax=1;}
  if(ymin===ymax){ymin-=1;ymax+=1;}
  if(!autoYInput.checked){ymin=-10;ymax=10;}
  clearCanvas(); drawGrid(xmin,xmax,ymin,ymax);
  const w=canvas.width,h=canvas.height;
  const toX=x=> (x-xmin)/(xmax-xmin)*w;
  const toY=y=> h-(y-ymin)/(ymax-ymin)*h;
  ctx.save();ctx.lineWidth=2;ctx.strokeStyle='#ef4444';ctx.beginPath();
  let started=false;
  for(let i=0;i<xs.length;i++){
    const x=xs[i],y=ys[i];
    if(isNaN(y)){started=false;continue;}
    const px=toX(x),py=toY(y);
    if(!started){ctx.moveTo(px,py);started=true;}else ctx.lineTo(px,py);
  }
  ctx.stroke();ctx.restore();
}

function redraw(){
  const expr=exprInput.value.trim();
  const xmin=parseFloat(xminInput.value)||-10;
  const xmax=parseFloat(xmaxInput.value)||10;
  let samples=parseInt(samplesInput.value)||600;
  if(samples<50)samples=50;if(samples>5000)samples=5000;
  if(xmin>=xmax){errorBox.textContent='xmin debe ser menor que xmax';return;}
  plotExpression(expr,xmin,xmax,samples);
}

exprInput.addEventListener('input',()=>{try{redraw();}catch(e){}});
xminInput.addEventListener('change',redraw);
xmaxInput.addEventListener('change',redraw);
samplesInput.addEventListener('change',redraw);
autoYInput.addEventListener('change',redraw);
redrawBtn.addEventListener('click',redraw);
resetBtn.addEventListener('click',()=>{
  exprInput.value='sin(x)';xminInput.value=-10;xmaxInput.value=10;
  samplesInput.value=800;autoYInput.checked=true;redraw();
});

window.addEventListener('resize',()=>{
  const containerW=Math.min(900,document.querySelector('.visual').clientWidth-200);
  canvas.width=Math.max(600,containerW);redraw();
});

(function init(){canvas.width=900;canvas.height=500;redraw();})();
