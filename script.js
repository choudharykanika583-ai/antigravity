class AntigravitySite {
    constructor() {
        this.canvas = document.getElementById('starfield-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.numStars = 400;
        this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        this.targetMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        
        this.init();
    }

    init() {
        this.resize();
        this.generateStars();
        this.attachEvents();
        this.animate();
        this.initAgentTyping();
        
        console.log("Antigravity Systems Online...");
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    generateStars() {
        this.stars = [];
        const colors = ['#ffffff', '#4285f4', '#ea4335', '#fbbc05', '#34a853'];
        
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * this.canvas.width, // Depth
                size: Math.random() * 3 + 1, // Larger stars
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random(),
                speed: Math.random() * 2 + 0.5
            });
        }
    }

    attachEvents() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = e.clientX;
            this.targetMouse.y = e.clientY;
        });

        window.addEventListener('resize', () => {
            this.resize();
            this.generateStars();
        });

        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.feature-block, .blog-card').forEach(el => observer.observe(el));
    }

    updateStars() {
      
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        this.stars.forEach(star => {
           
            star.z -= star.speed;

        
            if (star.z <= 0) {
                star.z = this.canvas.width;
                star.x = Math.random() * this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }

            
            const k = 128 / star.z;
            const px = (star.x - this.canvas.width / 2) * k + this.canvas.width / 2;
            const py = (star.y - this.canvas.height / 2) * k + this.canvas.height / 2;

           
            const offsetX = (this.mouse.x - this.canvas.width / 2) * (star.z / this.canvas.width) * 0.1;
            const offsetY = (this.mouse.y - this.canvas.height / 2) * (star.z / this.canvas.width) * 0.1;

            star.drawX = px + offsetX;
            star.drawY = py + offsetY;
            star.drawSize = (1 - star.z / this.canvas.width) * 6; 
        });
    }

    draw() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.fillStyle = star.color;
            this.ctx.globalAlpha = star.opacity;
            this.ctx.arc(star.drawX, star.drawY, star.drawSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            
            if (star.drawSize > 3) {
                this.ctx.shadowBlur = 15;
                this.ctx.shadowColor = star.color;
            } else {
                this.ctx.shadowBlur = 0;
            }
        });
        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.updateStars();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    initAgentTyping() {
        const codeElement = document.getElementById('live-code-stream');
        const codeText = `import { Gravity } from "@google/core";\n\nconst agent = new Gravity.Agent();\nawait agent.liftoff({\n  mode: "autonomous",\n  context: "project_nebula"\n});`;
        
        let charIndex = 0;
        const type = () => {
            if (charIndex < codeText.length) {
                codeElement.textContent += codeText[charIndex];
                charIndex++;
                setTimeout(type, 40 + Math.random() * 100);
            }
        };

        
        setTimeout(type, 2000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new AntigravitySite();
});