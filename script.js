document.addEventListener("DOMContentLoaded", () => {

    // --- NAV LOGIC ---
    let currentPage = 1;
    const totalPages = 8;
    let isTransitioning = false;
    const gateOverlay = document.querySelector('.gate-overlay');
    const gateSection = document.querySelector('.gate-section');

    // 1. GATE OPEN
    gateOverlay.addEventListener('click', () => {
        gateSection.classList.add('open');
        setTimeout(() => {
            transitionToPage(2);
        }, 1200); // Wait for door open anim
    });

    // 2. PAGE TRANSITION FUNCTION
    function transitionToPage(pageNum) {
        if (pageNum < 2 || pageNum > totalPages) return;
        if (isTransitioning) return;

        isTransitioning = true;

        // Update Dots
        document.querySelectorAll('.nav-dot').forEach(d => d.classList.remove('active'));
        document.querySelector(`.nav-dot[data-target="${pageNum}"]`)?.classList.add('active');

        // Old Page Fade Out
        const oldPage = document.querySelector(`.page.active`);
        if (oldPage && oldPage.id !== `page-${pageNum}`) {
            oldPage.classList.remove('active');
        }

        // New Page Fade In
        const newPage = document.getElementById(`page-${pageNum}`);
        if (newPage) {
            newPage.classList.add('active');
            currentPage = pageNum;
        }

        setTimeout(() => { isTransitioning = false; }, 1000);
    }

    // 3. MOUSE WHEEL
    window.addEventListener('wheel', (e) => {
        if (!gateSection.classList.contains('open')) return;
        if (isTransitioning) return;

        if (e.deltaY > 0) {
            if (currentPage < totalPages) transitionToPage(currentPage + 1);
        } else {
            if (currentPage > 2) transitionToPage(currentPage - 1);
        }
    });

    // 4. DOT CLICK
    document.querySelectorAll('.nav-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            if (!gateSection.classList.contains('open')) return;
            const target = parseInt(dot.getAttribute('data-target'));
            if (target !== currentPage) transitionToPage(target);
        });
    });

    if (window.innerWidth <= 1024) {
        window.removeEventListener('wheel', null);
    }
});
