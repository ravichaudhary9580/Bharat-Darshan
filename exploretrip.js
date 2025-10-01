document.addEventListener("DOMContentLoaded", function () {
    // Unified scroll handler
    const sections = ['adventure', 'heritage', 'religious', 'student'];
    sections.forEach(section => {
        const scroll = document.getElementById(`${section}Scroll`);
        document.getElementById(`${section}ScrollLeft`)?.addEventListener('click', () => scroll?.scrollBy({ left: -350, behavior: "smooth" }));
        document.getElementById(`${section}ScrollRight`)?.addEventListener('click', () => scroll?.scrollBy({ left: 350, behavior: "smooth" }));
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


const baseUrl = "https://script.google.com/macros/s/AKfycbzBEnTzYfb1HF0JgHzMjmUKLnHACmGpjWN_a-5W5E1Q1UvweIM97eqzmYVRLYs2LEbK/exec";

let allTrips = [];
let filteredTrips = [];

// Function to convert Google Drive link to direct image URL
function convertDriveUrl(url) {
    if (url.includes('drive.google.com')) {
        const fileId = url.match(/[-\w]{25,}/)?.[0];
        return fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : url;
    }
    return url;
}

// Function to calculate trip duration from dates
function calculateDuration(dates) {
    try {
        const dateStr = dates.toString();
        
        // Extract all numbers from the date string
        const numbers = dateStr.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            const start = parseInt(numbers[0]);
            const end = parseInt(numbers[1]);
            if (end > start) {
                return `${end - start + 1} Days`;
            }
        }
        
        // Count days/nights keywords
        const dayMatch = dateStr.match(/(\d+)\s*days?/i);
        const nightMatch = dateStr.match(/(\d+)\s*nights?/i);
        
        if (dayMatch) return `${dayMatch[1]} Days`;
        if (nightMatch) return `${parseInt(nightMatch[1]) + 1} Days`;
        
        return "5 Days"; // Default estimate
    } catch (error) {
        return "5 Days";
    }
}

// Function to render trips in grid
function renderTrips(trips) {
    const container = document.getElementById('resultsGrid');
    const noResults = document.getElementById('noResults');
    const resultsCount = document.getElementById('resultsCount');
    const loading = document.getElementById('loadingTrips');
    
    container.innerHTML = '';
    loading?.classList.add('hidden');
    
    if (trips.length === 0) {
        noResults.classList.remove('hidden');
        resultsCount.textContent = '';
        return;
    }
    
    noResults.classList.add('hidden');
    resultsCount.textContent = `${trips.length} trip${trips.length !== 1 ? 's' : ''} found`;
    
    trips.forEach(trip => {
        const article = document.createElement('article');
        article.className = 'bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden border border-gray-200 flex flex-col transform transition-all duration-300 hover:-translate-y-1';
        
        const duration = calculateDuration(trip.dates);
        
        article.innerHTML = `
            <div class="relative">
                <img class="h-40 w-full object-cover" src="${convertDriveUrl(trip.image)}" alt="${trip.title}"/>
                <div class="absolute top-2 right-2 flex gap-1">
                    <div class="px-2 py-1 ${trip.status === 'Booking Open' ? 'bg-green-600' : 'bg-red-600'} text-white text-xs rounded">
                        ${trip.status}
                    </div>
                    <div class="px-2 py-1 ${trip.category === 'Adventure' ? 'bg-green-600' : (trip.category === 'Heritage' ? 'bg-orange-700' : (trip.category === 'Religious' ? 'bg-orange-400' : 'bg-blue-600'))} text-white text-xs rounded">
                        ${trip.category}
                    </div>
                </div>
            </div>
            <div class="p-3 flex-1 flex flex-col">
              <h4 class="text-lg font-bold mb-1 text-gray-800 leading-tight">${trip.title}</h4>
              <p class="text-sm text-gray-600 mb-2 flex items-center leading-tight">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
                ${trip.location}
              </p>
              <div class="text-sm text-gray-700 mb-2 leading-tight">
                <p><span class="font-medium">Dates:</span> ${trip.dates}</p>
                <p><span class="font-medium">Duration:</span> <span class="text-blue-600">${duration}</span></p>
                <p><span class="font-medium">Group:</span> ${trip.groupSize}</p>
                <p class="text-base font-bold text-blue-600">${trip.price}</p>
              </div>
              <div class="mt-auto space-y-1">
                <button class="w-full bg-orange-400 text-white py-2 px-3 rounded-lg hover:bg-orange-500 transition-colors text-sm font-semibold">
                    <a href="index.html?category=${encodeURIComponent(trip.category)}&title=${encodeURIComponent(trip.title)}#booking">Book Now</a>
                </button>
                <button class="w-full border border-blue-600 text-blue-600 py-1 px-3 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                    <a href="${trip.knowmore}" target="_blank">Know More</a>
                </button>
              </div>
            </div>
        `;
        container.appendChild(article);
    });
}

// Filter functions
function applyFilters() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const location = document.getElementById('locationFilter').value;
    const duration = document.getElementById('durationFilter').value;
    const price = document.getElementById('priceFilter').value;
    const group = document.getElementById('groupFilter').value;
    const circuit = document.getElementById('circuitFilter').value;
    const status = document.getElementById('statusFilter').value;
    
    filteredTrips = allTrips.filter(trip => {
        // Search filter
        if (searchTerm && !trip.title.toLowerCase().includes(searchTerm) && !trip.location.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        // Category filter
        if (category && trip.category !== category) return false;
        
        // Location filter
        if (location && trip.location !== location) return false;
        
        // Duration filter
        if (duration) {
            const tripDuration = parseInt(calculateDuration(trip.dates));
            if (duration === '1-3' && (tripDuration < 1 || tripDuration > 3)) return false;
            if (duration === '4-7' && (tripDuration < 4 || tripDuration > 7)) return false;
            if (duration === '8+' && tripDuration < 8) return false;
        }
        
        // Price filter
        if (price) {
            const tripPrice = parseInt(trip.price.replace(/[^\d]/g, ''));
            if (price === '0-5000' && tripPrice > 5000) return false;
            if (price === '5000-15000' && (tripPrice < 5000 || tripPrice > 15000)) return false;
            if (price === '15000+' && tripPrice < 15000) return false;
        }
        
        // Group size filter
        if (group) {
            const groupSizeStr = trip.groupSize.toString().toLowerCase();
            const numbers = groupSizeStr.match(/\d+/g);
            const maxSize = numbers ? Math.max(...numbers.map(n => parseInt(n))) : 0;
            
            if (group === 'small' && maxSize > 10) return false;
            if (group === 'medium' && (maxSize < 11 || maxSize > 25)) return false;
            if (group === 'large' && maxSize < 26) return false;
        }
        
        // Circuit filter
        if (circuit) {
            const locationWords = trip.location.split(/[\s-]+/).filter(word => word.length > 0);
            const isCircuit = locationWords.length > 2;
            if (circuit === 'single' && isCircuit) return false;
            if (circuit === 'circuit' && !isCircuit) return false;
        }
        
        // Status filter
        if (status && trip.status !== status) return false;
        
        return true;
    });
    
    renderTrips(filteredTrips);
}

function populateLocationFilter() {
    const locationFilter = document.getElementById('locationFilter');
    const locations = [...new Set(allTrips.map(trip => trip.location))].sort();
    
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
}

function clearAllFilters() {
    document.getElementById('searchBox').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('durationFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('groupFilter').value = '';
    document.getElementById('circuitFilter').value = '';
    document.getElementById('statusFilter').value = '';
    applyFilters();
}

window.clearAllFilters = clearAllFilters;


// Load all trips and setup filters
document.addEventListener('DOMContentLoaded', () => {
    fetch(baseUrl)
        .then(res => res.json())
        .then(trips => {
            allTrips = trips;
            filteredTrips = trips;
            populateLocationFilter();
            renderTrips(filteredTrips);
            
            // Setup event listeners
            document.getElementById('searchBox').addEventListener('input', applyFilters);
            document.getElementById('categoryFilter').addEventListener('change', applyFilters);
            document.getElementById('locationFilter').addEventListener('change', applyFilters);
            document.getElementById('durationFilter').addEventListener('change', applyFilters);
            document.getElementById('priceFilter').addEventListener('change', applyFilters);
            document.getElementById('groupFilter').addEventListener('change', applyFilters);
            document.getElementById('circuitFilter').addEventListener('change', applyFilters);
            document.getElementById('statusFilter').addEventListener('change', applyFilters);
            document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
        })
        .catch(err => console.error('Error loading trips:', err));
});

