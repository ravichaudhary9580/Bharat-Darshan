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


const baseUrl = "https://script.google.com/macros/s/AKfycbwj2nlyFntNJuJukZ-a25UzZmCnWCHWNYplpzzO990_2M-pb4DmwbOIw3EiqFMhaTzP/exec";
const CACHE_KEY = 'bharatDarshanTrips';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
        
        const tripId = `trip-${trip.title.replace(/\s+/g, '-').toLowerCase()}`;
        const likes = trip.likes || 0;
        const isLiked = localStorage.getItem(`liked-${tripId}`) === 'true';
        
        article.innerHTML = `
            <div class="relative">
                <img class="h-40 w-full object-cover" loading="lazy" src="${convertDriveUrl(trip.image)}" alt="${trip.title}"/>
                <div class="absolute top-2 right-2 flex gap-1">
                    <div class="px-2 py-1 ${trip.status === 'Booking Open' ? 'bg-green-600' : 'bg-red-600'} text-white text-xs rounded">
                        ${trip.status}
                    </div>
                    <div class="px-2 py-1 ${trip.category === 'Adventure' ? 'bg-green-600' : (trip.category === 'Heritage' ? 'bg-orange-700' : (trip.category === 'Religious' ? 'bg-orange-400' : 'bg-blue-600'))} text-white text-xs rounded">
                        ${trip.category}
                    </div>
                </div>
                <button onclick="toggleLike('${tripId}')" class="absolute top-2 left-2 bg-white/90 backdrop-blur p-2 rounded-full hover:bg-white transition-all">
                    <svg class="w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                </button>
            </div>
            <div class="p-3 flex-1 flex flex-col">
              <div class="flex items-start justify-between mb-1">
                <h4 class="text-lg font-bold text-gray-800 leading-tight flex-1">${trip.title}</h4>
              </div>
              <div class="flex items-center gap-3 mb-2 text-xs text-gray-600">
                <span class="flex items-center gap-1">
                    <svg class="w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    <span id="like-count-${tripId}">${likes}</span>
                </span>
              </div>
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
                ${trip.status === 'Booking Open' ? `<button class="w-full bg-orange-400 text-white py-2 px-3 rounded-lg hover:bg-orange-500 transition-colors text-sm font-semibold">
                    <a href="index.html?category=${encodeURIComponent(trip.category)}&title=${encodeURIComponent(trip.title)}#booking">Book Now</a>
                </button>` : ''}
                <div class="flex gap-1">
                    <button class="flex-1 border border-blue-600 text-blue-600 py-1 px-3 rounded-lg hover:bg-blue-50 transition-colors text-sm">
                        <a href="${trip.knowmore}" target="_blank">Know More</a>
                    </button>
                    <button onclick="shareTrip('${trip.title}', '${trip.location}', '${trip.category}', '${convertDriveUrl(trip.image)}')" class="border border-green-600 text-green-600 p-1 rounded-lg hover:bg-green-50 transition-colors" title="Share Trip">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                    </button>
                </div>
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
window.clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_KEY + '_time');
    location.reload();
};

// Handle hash changes for category filtering
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    const categoryMap = {
        'adventure': 'Adventure',
        'heritage': 'Heritage',
        'religious': 'Religious',
        'student': 'Student'
    };
    if (categoryMap[hash]) {
        document.getElementById('categoryFilter').value = categoryMap[hash];
        applyFilters();
    }
});


// Load trips with caching
function loadTrips() {
    const cached = localStorage.getItem(CACHE_KEY);
    const cacheTime = localStorage.getItem(CACHE_KEY + '_time');
    
    if (cached && cacheTime && Date.now() - parseInt(cacheTime) < CACHE_DURATION) {
        return Promise.resolve(JSON.parse(cached));
    }
    
    return fetch(baseUrl)
        .then(res => res.json())
        .then(trips => {
            localStorage.setItem(CACHE_KEY, JSON.stringify(trips));
            localStorage.setItem(CACHE_KEY + '_time', Date.now().toString());
            return trips;
        });
}

// Like functionality
function toggleLike(tripId) {
    const isLiked = localStorage.getItem(`liked-${tripId}`) === 'true';
    const trip = allTrips.find(t => `trip-${t.title.replace(/\s+/g, '-').toLowerCase()}` === tripId);
    if (!trip) return;
    
    const formData = new FormData();
    formData.append('formType', 'Trip Like');
    formData.append('tripTitle', trip.title);
    formData.append('action', isLiked ? 'unlike' : 'like');
    
    fetch(baseUrl, { method: 'POST', body: formData })
        .then(() => {
            localStorage.setItem(`liked-${tripId}`, isLiked ? 'false' : 'true');
            trip.likes = isLiked ? Math.max(0, trip.likes - 1) : trip.likes + 1;
            applyFilters();
        })
        .catch(() => applyFilters());
}

// Share functionality
async function shareTrip(title, location, category, imageUrl) {
    const url = `${window.location.origin}${window.location.pathname}?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}#booking`;
    const text = `Check out this amazing trip: ${title} to ${location}!`;
    
    // Create share options modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 class="text-lg font-bold mb-4">Share Trip</h3>
            <div class="space-y-2">
                <button onclick="shareToWhatsApp('${encodeURIComponent(text)}', '${encodeURIComponent(url)}')" class="w-full flex items-center gap-3 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                </button>
                <button onclick="shareToInstagram('${encodeURIComponent(text)}', '${encodeURIComponent(url)}')" class="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    Instagram
                </button>
                <button onclick="shareToOthers('${encodeURIComponent(title)}', '${encodeURIComponent(text)}', '${encodeURIComponent(url)}', '${imageUrl}')" class="w-full flex items-center gap-3 p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                    More Options
                </button>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full mt-4 p-2 text-gray-600 hover:text-gray-800">Cancel</button>
        </div>
    `;
    document.body.appendChild(modal);
    modal.onclick = (e) => e.target === modal && modal.remove();
}

function shareToWhatsApp(text, url) {
    const shareUrl = `https://wa.me/?text=${text}%0A${url}`;
    window.open(shareUrl, '_blank');
    document.querySelector('.fixed.inset-0')?.remove();
}

function shareToInstagram(text, url) {
    const modal = document.querySelector('.fixed.inset-0');
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 class="text-lg font-bold mb-4">Share on Instagram</h3>
            <div class="space-y-2">
                <button onclick="shareInstagramPost('${text}', '${url}')" class="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90">
                    Share as Post/Story
                </button>
                <button onclick="shareInstagramMessage('${text}', '${url}')" class="w-full p-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90">
                    Share in Message
                </button>
            </div>
            <button onclick="this.closest('.fixed').remove()" class="w-full mt-4 p-2 text-gray-600 hover:text-gray-800">Back</button>
        </div>
    `;
}

function shareInstagramPost(text, url) {
    navigator.clipboard.writeText(decodeURIComponent(text) + '\n' + decodeURIComponent(url)).then(() => {
        alert('Link copied! Open Instagram and paste in your post or story.');
    });
    document.querySelector('.fixed.inset-0')?.remove();
}

function shareInstagramMessage(text, url) {
    const message = decodeURIComponent(text) + '\n' + decodeURIComponent(url);
    window.open(`instagram://direct/new?text=${encodeURIComponent(message)}`, '_blank');
    setTimeout(() => document.querySelector('.fixed.inset-0')?.remove(), 500);
}

async function shareToOthers(title, text, url, imageUrl) {
    if (navigator.share) {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'trip.jpg', { type: blob.type });
            await navigator.share({ title: decodeURIComponent(title), text: decodeURIComponent(text), url: decodeURIComponent(url), files: [file] });
        } catch {
            navigator.share({ title: decodeURIComponent(title), text: decodeURIComponent(text), url: decodeURIComponent(url) }).catch(() => {});
        }
    }
    document.querySelector('.fixed.inset-0')?.remove();
}

window.toggleLike = toggleLike;
window.shareTrip = shareTrip;
window.shareToWhatsApp = shareToWhatsApp;
window.shareToInstagram = shareToInstagram;
window.shareInstagramPost = shareInstagramPost;
window.shareInstagramMessage = shareInstagramMessage;
window.shareToOthers = shareToOthers;

// Load all trips and setup filters
document.addEventListener('DOMContentLoaded', () => {
    loadTrips()
        .then(trips => {
            allTrips = trips;
            filteredTrips = trips;
            populateLocationFilter();
            
            // Check for hash in URL and apply category filter
            const hash = window.location.hash.substring(1);
            if (hash) {
                const categoryMap = {
                    'adventure': 'Adventure',
                    'heritage': 'Heritage',
                    'religious': 'Religious',
                    'student': 'Student'
                };
                if (categoryMap[hash]) {
                    document.getElementById('categoryFilter').value = categoryMap[hash];
                }
            }
            
            applyFilters();
            
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
        .catch(err => {
            console.error('Error loading trips:', err);
            document.getElementById('loadingTrips').innerHTML = '<p class="text-red-600">Failed to load trips. Please refresh.</p>';
        });
});

