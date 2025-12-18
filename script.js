document.addEventListener("DOMContentLoaded", () => {

    // --- AUTOMATIC SCROLL UNROLLING (Observer) ---
    // Since Norigae is removed, scrolls open automatically on view.
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('unrolled');
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.jokja-wrapper').forEach(wrapper => {
        scrollObserver.observe(wrapper);
    });


    // --- FADE IN FOR NON-JOKJA SECTIONS ---
    const options = { threshold: 0.4 };

    // Note: We removed the auto-unroll observer for Jokja sections
    // as it is now manual interaction.

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const container = entry.target.querySelector('.paper-container');
            if (entry.isIntersecting && container) {
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }
        });
    }, options);

    document.querySelectorAll('.content-section:not(.jokja-section)').forEach(section => {
        const container = section.querySelector('.paper-container');
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(30px)';
            container.style.transition = 'opacity 1s, transform 1s';
            fadeObserver.observe(section);
        }
    });

});
