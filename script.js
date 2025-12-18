document.addEventListener("DOMContentLoaded", () => {

    // --- STATE MANAGEMENT ---
    let currentPage = 1;
    const totalPages = 8;
    let isTransitioning = false;
    const gateSection = document.getElementById('page-1');
    const enterBtn = document.getElementById('enter-btn');

    // --- GATE LOGIC ---
    enterBtn.addEventListener('click', () => {
        gateSection.classList.add('open');
        // Wait for door animation then transition to page 2
        setTimeout(() => {
            transitionToPage(2);
        }, 800);
    });

    // --- NAVIGATION LOGIC ---
    function transitionToPage(pageNum) {
        if (pageNum < 2 || pageNum > totalPages) return;
        isTransitioning = true;

        // Hide all pages (except Gate which is handled separately)
        document.querySelectorAll('.page.content-section').forEach(p => {
            p.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`page-${pageNum}`);
        if (targetPage) {
            targetPage.classList.add('active');
            currentPage = pageNum;
        }

        setTimeout(() => isTransitioning = false, 1000); // Debounce
    }

    // --- SCROLL EVENT (Mouse Wheel) ---
    window.addEventListener('wheel', (e) => {
        // Blocks scrolling while gate is closed OR during transition
        if (!gateSection.classList.contains('open') || isTransitioning) return;

        if (e.deltaY > 0) {
            // Scroll Down
            if (currentPage < totalPages) transitionToPage(currentPage + 1);
        } else {
            // Scroll Up
            if (currentPage > 2) transitionToPage(currentPage - 1);
        }
    });

});
