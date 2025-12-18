// Minimal JS for this version as CSS Scroll Snap handles the heavy lifting
document.addEventListener("DOMContentLoaded", () => {
    console.log("Myeongcheop Portfolio Loaded");

    // Optional: Add scroll reveal animations if needed
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.paper-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 1s, transform 1s';
        observer.observe(el);
    });

    // Simple observer callback update
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.3 });
    document.querySelectorAll('.paper-container').forEach(el => revealObserver.observe(el));
});
