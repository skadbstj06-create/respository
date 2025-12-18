document.addEventListener("DOMContentLoaded", () => {

    // --- CANVAS BACKGROUND (Simplified Matrix Rain/Particles) ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 2 + 0.5;
            this.color = Math.random() > 0.9 ? '#ccff00' : 'rgba(255,255,255,0.2)';
        }
        update() {
            this.y += this.speedY;
            if (this.y > height) this.y = 0;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) particles.push(new Particle());

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateCanvas);
    }
    animateCanvas();

    // --- WATCHER EYE ---
    const eyeContainer = document.querySelector('.eye-container');
    const pupil = document.querySelector('.pupil');

    window.addEventListener('mousemove', (e) => {
        // Calculate angle
        const eyeRect = eyeContainer.getBoundingClientRect();
        const eyeX = eyeRect.left + eyeRect.width / 2;
        const eyeY = eyeRect.top + eyeRect.height / 2;

        const deltaX = e.clientX - eyeX;
        const deltaY = e.clientY - eyeY;
        const angle = Math.atan2(deltaY, deltaX);

        // Limit movement
        const radius = 10;
        const pupilX = Math.cos(angle) * radius;
        const pupilY = Math.sin(angle) * radius;

        pupil.style.transform = `translate(-50%, -50%) translate(${pupilX}px, ${pupilY}px)`;
    });


    // --- CURSOR ---
    const cursor = document.querySelector('.cursor');
    window.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('[data-cursor]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('active'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });


    // --- PHYSICS / CHAOS MODE (Matter.js) ---
    const chaosBtn = document.getElementById('chaos-toggle');
    const chaosState = document.getElementById('chaos-state');
    const gridContainer = document.querySelector('.bento-grid');
    const physicsBoxes = document.querySelectorAll('.physics-box');

    let engine, render, runner, mouseConstraint;
    let isChaosActive = false;
    let bodies = [];

    function enableChaos() {
        isChaosActive = true;
        chaosState.innerText = "ON";
        chaosBtn.style.color = "red";
        chaosBtn.style.borderColor = "red";

        // Initializes Matter.js
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        engine = Engine.create();

        // Remove Grid Layout visually but keep dimensions for initial bodies
        gridContainer.classList.add('physics-active');

        // Create bodies from DOM elements
        bodies = Array.from(physicsBoxes).map(el => {
            const rect = el.getBoundingClientRect();
            // Matter.js bodies are positioned at center
            const body = Bodies.rectangle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                rect.width,
                rect.height,
                {
                    restitution: 0.8, // Bouncy
                    friction: 0.005,
                    density: 0.04
                }
            );
            return { body, el, width: rect.width, height: rect.height };
        });

        // Add walls
        const wallOptions = { isStatic: true, render: { visible: false } };
        const ground = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, height / 2, 100, height, wallOptions);
        const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions);
        const ceiling = Bodies.rectangle(width / 2, -500, width, 100, wallOptions); // High ceiling to allow throws

        Composite.add(engine.world, [...bodies.map(b => b.body), ground, leftWall, rightWall, ceiling]);

        // Mouse Control
        const mouse = Mouse.create(document.body);
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);

        // Run
        runner = Runner.create();
        Runner.run(runner, engine);

        // Update Loop
        function updatePhysics() {
            if (!isChaosActive) return;

            bodies.forEach(item => {
                const { body, el } = item;
                // Sync DOM to Physics Body
                el.style.position = 'absolute';
                el.style.width = `${item.width}px`;
                el.style.height = `${item.height}px`;
                el.style.left = '0px';
                el.style.top = '0px';
                el.style.transform = `translate(${body.position.x - item.width / 2}px, ${body.position.y - item.height / 2}px) rotate(${body.angle}rad)`;
            });
            requestAnimationFrame(updatePhysics);
        }
        updatePhysics();
    }

    chaosBtn.addEventListener('click', () => {
        if (!isChaosActive) {
            enableChaos();
            alert("⚠️ WARNING: GRAVITY FAILURE IMMINENT ⚠️");
        } else {
            location.reload(); // Simple reset
        }
    });

    // --- EASTER EGG (KONAMI CODE) ---
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let inputPos = 0;

    window.addEventListener('keydown', (e) => {
        if (e.key === code[inputPos]) {
            inputPos++;
            if (inputPos === code.length) {
                activateEasterEgg();
                inputPos = 0;
            }
        } else {
            inputPos = 0;
        }
    });

    function activateEasterEgg() {
        const overlay = document.getElementById('easter-egg-overlay');
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.display = 'none';
            // Secret visuals: Spinning everything
            document.body.style.transition = 'transform 5s';
            document.body.style.transform = 'rotate(180deg)';
        }, 3000);
    }

});
