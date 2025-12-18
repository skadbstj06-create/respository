document.addEventListener("DOMContentLoaded", () => {

    // --- CANVAS BACKGROUND (Ink Drops) ---
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
    class InkDrop {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 20 + 5;
            this.maxSize = this.size + Math.random() * 30; // Grow effect
            this.growth = 0.2;
            this.alpha = Math.random() * 0.1;
        }
        update() {
            if (this.size < this.maxSize) this.size += this.growth;
            // Slowly fade or move slightly
            this.y += 0.2;
            if (this.y > height) this.y = 0;
        }
        draw() {
            ctx.fillStyle = `rgba(10, 10, 10, ${this.alpha})`; // Ink Color
            ctx.beginPath();
            // Draw imperfect circle (blob)
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 30; i++) particles.push(new InkDrop());

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
        const eyeRect = eyeContainer.getBoundingClientRect();
        const eyeX = eyeRect.left + eyeRect.width / 2;
        const eyeY = eyeRect.top + eyeRect.height / 2;

        const deltaX = e.clientX - eyeX;
        const deltaY = e.clientY - eyeY;
        const angle = Math.atan2(deltaY, deltaX);

        const radius = 8;
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
    const gridContainer = document.querySelector('.bento-grid');
    const physicsBoxes = document.querySelectorAll('.physics-box');

    let engine, render, runner, mouseConstraint;
    let isChaosActive = false;
    let bodies = [];

    function enableChaos() {
        isChaosActive = true;
        chaosBtn.querySelector('.seal-inner').innerHTML = "봉인<br>완료";
        chaosBtn.style.opacity = 0.5;

        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        engine = Engine.create();

        gridContainer.classList.add('physics-active');

        bodies = Array.from(physicsBoxes).map(el => {
            const rect = el.getBoundingClientRect();
            const body = Bodies.rectangle(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                rect.width,
                rect.height,
                {
                    restitution: 0.6,
                    friction: 0.1,
                    density: 0.04
                }
            );
            return { body, el, width: rect.width, height: rect.height };
        });

        const wallOptions = { isStatic: true, render: { visible: false } };
        const ground = Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions);
        const leftWall = Bodies.rectangle(-50, height / 2, 100, height, wallOptions);
        const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions);
        const ceiling = Bodies.rectangle(width / 2, -500, width, 100, wallOptions);

        Composite.add(engine.world, [...bodies.map(b => b.body), ground, leftWall, rightWall, ceiling]);

        const mouse = Mouse.create(document.body);
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);

        runner = Runner.create();
        Runner.run(runner, engine);

        function updatePhysics() {
            if (!isChaosActive) return;

            bodies.forEach(item => {
                const { body, el } = item;
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
        } else {
            location.reload();
        }
    });

    // --- EASTER EGG ---
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
            document.body.style.transition = 'filter 2s';
            // Invert colors to mimic negative film
            document.body.style.filter = 'invert(1)';
        }, 3000);
    }

});
