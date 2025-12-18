document.addEventListener("DOMContentLoaded", () => {

    // --- NAV LOGIC ---
    let currentPage = 1;
    const totalPages = 8;
    let isTransitioning = false;
    const gateSeal = document.querySelector('.center-seal');
    const gateSection = document.querySelector('.gate-section');

    // 1. GATE OPEN
    gateSeal.addEventListener('click', () => {
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
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
        document.querySelector(`.dot[data-target="${pageNum}"]`)?.classList.add('active');

        // Old Page Fade Out
        const oldPage = document.querySelector(`.page.active`);
        if (oldPage && oldPage.id !== `page-${pageNum}`) {
            oldPage.classList.remove('active');
            // Optional: determine direction for exit anim
        }

        // New Page Fade In
        const newPage = document.getElementById(`page-${pageNum}`);
        newPage.classList.add('active');

        currentPage = pageNum;

        setTimeout(() => { isTransitioning = false; }, 1000);
    }

    // 3. MOUSE WHEEL CONTROL
    window.addEventListener('wheel', (e) => {
        // Gate handling: if closed, don't scroll
        if (!gateSection.classList.contains('open')) return;

        // Debounce
        if (isTransitioning) return;

        if (e.deltaY > 0) {
            // DOWN
            if (currentPage < totalPages) transitionToPage(currentPage + 1);
        } else {
            // UP
            if (currentPage > 2) transitionToPage(currentPage - 1);
        }
    });

    // 4. DOT CLICK CONTROL
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', () => {
            if (!gateSection.classList.contains('open')) return;
            const target = parseInt(dot.getAttribute('data-target'));
            if (target !== currentPage) transitionToPage(target);
        });
    });

    // Check Mobile
    if (window.innerWidth <= 1024) {
        // Disable JS scrolljacking on mobile
        window.removeEventListener('wheel', null);
    }
});
