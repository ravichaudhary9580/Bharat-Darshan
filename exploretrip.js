document.addEventListener("DOMContentLoaded", function () {
    // Adventure Trips Scroll
    let adventureScroll = document.getElementById("adventureScroll");
    document.getElementById("adventureScrollLeft").onclick = function () {
        adventureScroll.scrollBy({ left: -350, behavior: "smooth" });
    };
    document.getElementById("adventureScrollRight").onclick = function () {
        adventureScroll.scrollBy({ left: 350, behavior: "smooth" });
    };
    // Heritage Trips Scroll
    let heritageScroll = document.getElementById("heritageScroll");
    document.getElementById("heritageScrollLeft").onclick = function () {
        religiousScroll.scrollBy({ left: -350, behavior: "smooth" });
    };
    document.getElementById("heritageScrollRight").onclick = function () {
        heritageScroll.scrollBy({ left: 350, behavior: "smooth" });
    };

    // Religious Trips Scroll
    let religiousScroll = document.getElementById("religiousScroll");
    document.getElementById("religiousScrollLeft").onclick = function () {
        religiousScroll.scrollBy({ left: -350, behavior: "smooth" });
    };
    document.getElementById("religiousScrollRight").onclick = function () {
        religiousScroll.scrollBy({ left: 350, behavior: "smooth" });
    };

    // Student Trips Scroll
    let studentScroll = document.getElementById("studentScroll");
    document.getElementById("studentScrollLeft").onclick = function () {
        studentScroll.scrollBy({ left: -350, behavior: "smooth" });
    };
    document.getElementById("studentScrollRight").onclick = function () {
        studentScroll.scrollBy({ left: 350, behavior: "smooth" });
    };
    // Mobile menu toggle
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    menuBtn.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
    });
});

// Auto scroll for mobile view, stop on click/touch
//Adventure Section
let adventureScrollInterval;
function autoScrollAdventure() {
    const el = document.getElementById('adventureScroll');
    if (!el) return;
    clearInterval(adventureScrollInterval);
    if (window.innerWidth < 768) {
        let direction = 1;
        adventureScrollInterval = setInterval(() => {
            if (el.scrollLeft + el.offsetWidth >= el.scrollWidth) direction = -1;
            if (el.scrollLeft <= 0) direction = 1;
            el.scrollBy({ left: 0.5 * direction, behavior: 'smooth' });
        }, 20);

        // Stop auto scroll on user interaction
        function stopScroll() {
            clearInterval(adventureScrollInterval);
            el.removeEventListener('mousedown', stopScroll);
            el.removeEventListener('touchstart', stopScroll);
        }
        el.addEventListener('mousedown', stopScroll);
        el.addEventListener('touchstart', stopScroll);
    }
}
window.addEventListener('DOMContentLoaded', autoScrollAdventure);
window.addEventListener('resize', autoScrollAdventure);

// Heritage Section
let heritageScrollInterval;
function autoScrollHeritage() {
    const el = document.getElementById('heritageScroll');
    if (!el) return;
    clearInterval(heritageScrollInterval);
    if (window.innerWidth < 768) {
        let direction = 1;
        heritageScrollInterval = setInterval(() => {
            if (el.scrollLeft + el.offsetWidth >= el.scrollWidth) direction = -1;
            if (el.scrollLeft <= 0) direction = 1;
            el.scrollBy({ left: 0.5 * direction, behavior: 'smooth' });
        }, 20);

        // Stop auto scroll on user interaction
        function stopScroll() {
            clearInterval(heritageScrollInterval);
            el.removeEventListener('mousedown', stopScroll);
            el.removeEventListener('touchstart', stopScroll);
        }
        el.addEventListener('mousedown', stopScroll);
        el.addEventListener('touchstart', stopScroll);
    }
}
window.addEventListener('DOMContentLoaded', autoScrollHeritage);
window.addEventListener('resize', autoScrollHeritage);

// Religious Section
let religiousScrollInterval;
function autoScrollReligious() {
    const el = document.getElementById('religiousScroll');
    if (!el) return;
    clearInterval(religiousScrollInterval);
    if (window.innerWidth < 768) {
        let direction = 1;
        religiousScrollInterval = setInterval(() => {
            if (el.scrollLeft + el.offsetWidth >= el.scrollWidth) direction = -1;
            if (el.scrollLeft <= 0) direction = 1;
            el.scrollBy({ left: 0.5 * direction, behavior: 'smooth' });
        }, 20);

        // Stop auto scroll on user interaction
        function stopScroll() {
            clearInterval(religiousScrollInterval);
            el.removeEventListener('mousedown', stopScroll);
            el.removeEventListener('touchstart', stopScroll);
        }
        el.addEventListener('mousedown', stopScroll);
        el.addEventListener('touchstart', stopScroll);
    }
}
window.addEventListener('DOMContentLoaded', autoScrollReligious);
window.addEventListener('resize', autoScrollReligious);

// Student Section
let studentScrollInterval;
function autoScrollStudent() {
    const el = document.getElementById('studentScroll');
    if (!el) return;
    clearInterval(studentScrollInterval);
    if (window.innerWidth < 768) {
        let direction = 1;
        studentScrollInterval = setInterval(() => {
            if (el.scrollLeft + el.offsetWidth >= el.scrollWidth) direction = -1;
            if (el.scrollLeft <= 0) direction = 1;
            el.scrollBy({ left: 0.5 * direction, behavior: 'smooth' });
        }, 20);

        // Stop auto scroll on user interaction
        function stopScroll() {
            clearInterval(studentScrollInterval);
            el.removeEventListener('mousedown', stopScroll);
            el.removeEventListener('touchstart', stopScroll);
        }
        el.addEventListener('mousedown', stopScroll);
        el.addEventListener('touchstart', stopScroll);
    }
}
window.addEventListener('DOMContentLoaded', autoScrollStudent);
window.addEventListener('resize', autoScrollStudent);




