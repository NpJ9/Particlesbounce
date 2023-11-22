const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle ='white';
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'magenta');
gradient.addColorStop(1, 'blue');
ctx.fillStyle= gradient;
ctx.strokeStyle = 'white'


class Particle {
  constructor(effect){
    this.effect = effect;
    this.radius = Math.random() * 10 + 2;
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = Math.random() * 4 -2;
    this.vy = Math.random() * 4 -2;
    
  }
  draw(context){
    context.beginPath();
    context.arc(this.x,this.y, this.radius, 0 , Math.PI * 2);
    context.fill();
   
  }
  
  update(){
    // Bounce off the right and left
    this.x+= this.vx;
    if (this.x > this.effect.width - this.radius|| this.x < this.radius) {
      this.vx *= -1;
    }

    this.y+= this.vy;
    if (this.y > this.effect.height - this.radius|| this.y < this.radius) {
      this.vy *= -1;
    } 
  }
  reset() {
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
  }
}


class Effect {
    constructor(canvas, context){
      this.canvas = canvas;
      this.context = context;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.particles= [];
      this.numberOfParticles = 100;
      this.createParticles();

      window.addEventListener('resize', e => {
        this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
      });
    }
    createParticles(){
      for (let i = 0; i < this.numberOfParticles; i++) {
        this.particles.push(new Particle(this));
      }
    }
    
    handleParticles(context){
       this.connectParticles(context);
      this.particles.forEach(particle => {
        particle.draw(context);
        particle.update();
      });
     
    }

    connectParticles(context){
      const maxDistance = 100;
      for (let a = 0; a < this.particles.length; a++) {
        for (let b = a; b < this.particles.length; b++){
          const dx = this.particles[a].x - this.particles[b].x;
          const dy = this.particles[a].y - this.particles[b].y;
          const distance = Math.hypot(dx, dy);
          if (distance < maxDistance) {
            context.save()
            const opacity = 1 - (distance/maxDistance);
            context.globalAlpha = opacity;
            context.beginPath()
            context.moveTo(this.particles[a].x, this.particles[a].y);
            context.lineTo(this.particles[b].x, this.particles[b].y);
            context.stroke();
            context.restore();
          }


        } 
      }
    }
    resize(width, height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.width = width;
      this.height = height;
      const gradient = this.context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'white');
      gradient.addColorStop(0.5, 'magenta');
      gradient.addColorStop(1, 'blue');
      this.context.fillStyle= gradient;
      this.context.strokeStyle = 'white';
      this.particles.forEach(particle => {
        particle.reset();
      })

    }
}

const effect = new Effect(canvas, ctx);
effect.handleParticles(ctx);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height )
  effect.handleParticles(ctx); 
  requestAnimationFrame(animate);
}

animate()