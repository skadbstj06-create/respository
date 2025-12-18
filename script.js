document.addEventListener("DOMContentLoaded", () => {

    /* ============================
       CANVAS BACKGROUND
       ============================ */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    // Resize function
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce screen edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.floor(width / 10); // Density based on width
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect nearby
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1000})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });

    resize();
    initParticles();
    animate();


    /* ============================
       CUSTOM CURSOR
       ============================ */
    const cursor = document.querySelector('.cursor');

    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Interactive Elements
    document.querySelectorAll('[data-cursor="hover"]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    document.querySelectorAll('[data-cursor="view"]').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursor.style.mixBlendMode = 'normal';
            cursor.style.backgroundColor = 'var(--acc-green)';
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursor.style.mixBlendMode = 'difference';
            cursor.style.backgroundColor = 'white';
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

});
