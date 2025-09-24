
// Make sure DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Booking toggle
    const btnInd = document.getElementById('btnInd');
    const btnGrp = document.getElementById('btnGrp');
    const formInd = document.getElementById('formInd');
    const formGrp = document.getElementById('formGrp');
    function activate(tab) {
        if (tab === 'ind') { btnInd.classList.add('bg-orange-500', 'text-white'); btnGrp.classList.remove('bg-orange-500', 'text-white'); formInd.classList.remove('hidden'); formGrp.classList.add('hidden'); }
        else { btnGrp.classList.add('bg-orange-500', 'text-white'); btnInd.classList.remove('bg-orange-500', 'text-white'); formGrp.classList.remove('hidden'); formInd.classList.add('hidden'); }
    }
    btnInd?.addEventListener('click', () => activate('ind'));
    btnGrp?.addEventListener('click', () => activate('grp'));

    // slider
    const slides = document.getElementById('slides');
    const dots = document.querySelectorAll('#dots button');
    let current = 0;

    function showSlide(idx) {
        current = idx;
        slides.style.transform = `translateX(-${idx * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('bg-green-600', i === idx);
            dot.classList.toggle('bg-gray-300', i !== idx);
        });
    }

    document.getElementById('prevSlide').onclick = () => {
        showSlide((current - 1 + dots.length) % dots.length);
        resetAutoSlide(); // Reset timer when manually changed
    };

    document.getElementById('nextSlide').onclick = () => {
        showSlide((current + 1) % dots.length);
        resetAutoSlide(); // Reset timer when manually changed
    };

    dots.forEach((dot, i) => {
        dot.onclick = () => {
            showSlide(i);
            resetAutoSlide(); // Reset timer when manually changed
        }
    });

    // Auto slide functionality
    let slideInterval;
    const SLIDE_INTERVAL_TIME = 5000; // Change slide every 5 seconds

    function startAutoSlide() {
        slideInterval = setInterval(() => {
            showSlide((current + 1) % dots.length);
        }, SLIDE_INTERVAL_TIME);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    // Initialize slider
    showSlide(0);
    startAutoSlide();

    // Pause auto-slide when user hovers over slider
    document.getElementById('slider').addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    // Resume auto-slide when user leaves slider
    document.getElementById('slider').addEventListener('mouseleave', () => {
        startAutoSlide();
    });

    // Mobile menu toggle
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    menuBtn.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
    });
});
