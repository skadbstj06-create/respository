document.addEventListener("DOMContentLoaded", () => {

    // --- HANOK GATE INTERACTION ---
    const gate = document.getElementById('hanok-gate');
    const enterBtn = document.getElementById('enter-btn');
    const mainContent = document.getElementById('main-content');

    function openGate() {
        gate.classList.add('open');
        mainContent.classList.add('visible');

        // Play Open Sound (Optional/Placeholder)
        // const audio = new Audio('door_korean.mp3');
        // audio.play();
    }

    enterBtn.addEventListener('click', openGate);

    // Also open on scroll/mousewheel if they try to scroll past the gate
    /* 
    window.addEventListener('wheel', (e) => {
        if (!gate.classList.contains('open') && e.deltaY > 0) {
            openGate();
        }
    });
    */


    // --- SCROLL ANIMATION (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 1s, transform 1s ease-out';
        observer.observe(section);
    });

});
