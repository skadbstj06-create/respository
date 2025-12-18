document.addEventListener("DOMContentLoaded", () => {

    // --- NORIGAE INTERACTION ---
    document.querySelectorAll('.norigae-trigger').forEach(trigger => {
        trigger.addEventListener('click', function () {
            // 1. Untie (Animate Norigae Drop)
            this.classList.add('untied');

            // 2. Find wrapper and unroll
            const wrapper = this.closest('.jokja-wrapper');
            if (wrapper) {
                // Short delay to sync with knot falling
                setTimeout(() => {
                    wrapper.classList.add('unrolled');
                }, 300);
            }
        });
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
