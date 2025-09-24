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


const baseUrl = "https://script.google.com/macros/s/AKfycbzvI4G5SZFbH6S2jIhJE-44mOpYC2NWTPahFb8ZBSOHAM2ACs60LmnpoN-FmHx_9x-6/exec"; // New script URL

// Function to render trips inside a section
function loadTrips(category, containerId) {

    fetch(`${baseUrl}?category=${category}`)
        .then(res => res.json())
        .then(trips => {
            const container = document.getElementById(containerId);
            container.innerHTML = ""; // clear

            trips.forEach(trip => {
                let article = document.createElement("article");

                article.className =
                    "min-w-[320px] bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-gray-200 flex flex-col transform transition-all duration-300 hover:-translate-y-1";

                article.innerHTML = `
            <div class="relative">
                <img class="h-48 w-full object-cover" src="${trip.image}" alt="${trip.title}" />
                <div class="absolute top-0 right-0 m-2 flex gap-2">
                    <div class="px-2 py-1 ${trip.status === 'Booking Open' ? 'bg-green-600' : 'bg-red-600'} text-white text-sm rounded">
                        ${trip.status}
                    </div>
                    <div class="px-2 py-1 ${trip.category === 'Adventure' ? 'bg-green-600' : (trip.category === 'Heritage' ? 'bg-orange-700' : (trip.category === 'Religious' ? 'bg-orange-400' : 'bg-blue-600'))} text-white text-sm rounded">
                        ${trip.category}
                    </div>
                </div>
            </div>
            <div class="p-6 flex-1 flex flex-col">
              <h4 class="text-xl font-bold mb-2 text-gray-800">${trip.title}</h4>
              <p class="text-sm text-gray-600 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                ${trip.location}
              </p>
              <div class="text-sm text-gray-700 mb-4 space-y-2">
                <p class="flex items-center">
                    <span class="font-medium mr-2">Dates:</span> ${trip.dates}
                </p>
                <p class="flex items-center">
                    <span class="font-medium mr-2">Group Size:</span> ${trip.groupSize}
                </p>
                <p class="flex items-center text-lg font-bold text-blue-600">
                    <span class="font-medium mr-2">Price:</span> ${trip.price}
                </p>
              </div>
              <div class="mt-auto space-y-2">
                <button class="w-full bg-orange-400 text-white py-2 px-4 rounded-lg hover:bg-orange-500 transition-colors font-semibold">
                    <a href="index.html?category=${encodeURIComponent(trip.category)}&title=${encodeURIComponent(trip.title)}#booking">Book Now</a>
                </button>
                <button class="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                    <a href="${trip.knowmore}" target="_blank">Know More</a>
                </button>
              </div>
            </div>
          `;
                container.appendChild(article);
            });
        })
        .catch(err => console.error(`Error loading ${category} trips:`, err));
}


// Load all sections immediately with staggered timing for smooth loading
document.addEventListener('DOMContentLoaded', () => {
    const sections = [
        { id: 'adventureScroll', category: 'Adventure' },
        { id: 'heritageScroll', category: 'Heritage' },
        { id: 'religiousScroll', category: 'Religious' },
        { id: 'studentScroll', category: 'Student' }
    ];

    sections.forEach((section, index) => {
        setTimeout(() => {
            loadTrips(section.category, section.id);
        }, index * 200); // Stagger each section load by 300ms
    });
});

