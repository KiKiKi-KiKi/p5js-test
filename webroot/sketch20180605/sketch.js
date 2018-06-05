'use strict';
const w = window,
      collection = [];

var canvas;

const options = {
  minDist: 100,
  springAmount: 0.001,
};

function setup() {
  let n = 100;
  frameRate(30);
  canvas = createCanvas(windowWidth, windowHeight);

  while(--n) {
    createParticle();
  }
  console.log(collection);
}

// adjust canvas size
/*
w.onresize = function() {
  canvas.resize(windowWidth, windowHeight);
};
*/

function draw() {
  let n = collection.length;

  colorMode(HSB);
  background(246, 6, 5);

  colorMode(RGB);
  for(let i=0; i<n; i+=1) {
    let star = collection[i];
    updatePos(star);
    for(let j=i+1; j<n; j++) {
      updateSpring(star, collection[j]);
    }
    // Draw Particle
    //stroke(255);
    //point(star.x, star.y);
    fill(255);
    ellipse(star.x, star.y, star.radius);
  }
}

// Methods
// -------------------------
function createParticle(x, y, rad) {
  let a = new Star({
    radius: rad || Math.random() * 10 + 2,
    x     : x || Math.random() * canvas.width,
    y     : y || Math.random() * canvas.height,
    vx    : Math.random() * 3 - 1.5,
    vy    : Math.random() * 3 - 1.5
  });
  collection.push(a);
}

// Update Particle Position
// @params: a(:Star)
function updatePos(a) {
  let x = a.x + a.vx,
      y = a.y + a.vy,
      cW = canvas.width,
      cH = canvas.height;

  if(x > cW) {
    x = 0;
  } else if(x < 0) {
    x = cW;
  }

  if(y > cH) {
    y = 0;
  } else if(y < 0) {
    y = cH;
  }
  // set position
  a.setPos(x, y);
}

// Update Particle Spring(vx, vy)
// @params: a(:Star)
//          b(:Star)
function updateSpring(a, b) {
  let o = options,
      ax = a.x, ay = a.y, amass = a.mass,
      bx = b.x, by = b.y, bmass = b.mass,
      dx = bx - ax,
      dy = by - ay,
      distSQ = dx * dx + dy * dy,
      dist = Math.sqrt(distSQ);

  if(dist < o.minDist) {
    // draw string
    stroke(255, 60);
    strokeWeight(1);
    line(ax, ay, bx, by);

    ax = dx * o.springAmount;
    ay = dy * o.springAmount;

    a.setSpring(
      a.vx + ax / amass,
      a.vy + ay / amass
    );
    b.setSpring(
      b.vx - ax / amass,
      b.vy - ay / amass
    );
  }
}

// Particle Class
function Star(options) {
  // params
  this.radius = options.radius || 1;
  this.mass = 0;
  this.x = options.x || 0;
  this.y = options.y || 0;
  this.vx = options.vx || 0;
  this.vy = options.vy || 0;
  this.color = '#fff';
  return this.init();
}

Star.prototype.init = function() {
  let r = this.radius, m, rr, h;
  m = r * 5;
  r = Math.round( (r * 0.1 + 4 / 5) * 100 ) / 100;
  rr = r * r;
  h = Math.round(-38 * rr + 38 * 4);

  this.radius = r;
  this.mass = m;
  // this.color =

  return this;
};

Star.prototype.setPos = function(x, y) {
  this.x = x;
  this.y = y;
  return this;
};

Star.prototype.setSpring = function(vx, vy) {
  this.vx = vx;
  this.vy = vy;
  return this;
};
