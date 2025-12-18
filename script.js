document.addEventListener("DOMContentLoaded", () => {

    const options = {
        threshold: 0.4
    };

    const jokjaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const wrapper = entry.target.querySelector('.jokja-wrapper');
            if (entry.isIntersecting) {
                // Add class to Start Unrolling
                if (wrapper) wrapper.classList.add('unrolled');
            } else {
                // Optional: Roll back up when leaving view?
                // wrapper.classList.remove('unrolled');
            }
        });
    }, options);

    document.querySelectorAll('.jokja-section').forEach(section => {
        jokjaObserver.observe(section);
    });

    // Fade in for other sections
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
