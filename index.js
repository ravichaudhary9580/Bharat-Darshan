
// Make sure DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Fetch all trips data
    let allTrips = [];
    const baseUrl = "https://script.google.com/macros/s/AKfycbzvI4G5SZFbH6S2jIhJE-44mOpYC2NWTPahFb8ZBSOHAM2ACs60LmnpoN-FmHx_9x-6/exec";
    const toast = document.getElementById('toast');
    
    fetch(baseUrl)
        .then(res => res.json())
        .then(trips => {
            allTrips = trips;
            populateDropdowns();
            handleURLParams();
        })
        .catch(err => console.error('Error loading trips:', err));
    
    function populateDropdowns() {
        const categorySelect = document.getElementById('tripcategory');
        const titleSelect = document.getElementById('triptitle');
        
        // Get unique categories
        const categories = [...new Set(allTrips.map(trip => trip.category))];
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
        
        // Populate all titles initially
        titleSelect.innerHTML = '<option value="">Select Trip</option>';
        allTrips.forEach(trip => {
            const option = document.createElement('option');
            option.value = trip.title;
            option.textContent = trip.title;
            option.dataset.category = trip.category;
            titleSelect.appendChild(option);
        });
    }
    
    function filterTitles(selectedCategory) {
        const titleSelect = document.getElementById('triptitle');
        titleSelect.innerHTML = '<option value="">Select Trip</option>';
        
        if (selectedCategory) {
            const filteredTrips = allTrips.filter(trip => trip.category === selectedCategory);
            filteredTrips.forEach(trip => {
                const option = document.createElement('option');
                option.value = trip.title;
                option.textContent = trip.title;
                titleSelect.appendChild(option);
            });
        }
    }
    
    // Category change handler
    document.getElementById('tripcategory').addEventListener('change', (e) => {
        filterTitles(e.target.value);
    });
    
    function handleURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const title = urlParams.get('title');
        
        if (category && title) {
            const categorySelect = document.getElementById('tripcategory');
            if (categorySelect) {
                categorySelect.value = category;
                filterTitles(category);
            }
            
            setTimeout(() => {
                const titleSelect = document.getElementById('triptitle');
                if (titleSelect) {
                    titleSelect.value = title;
                }
            }, 100);
            
            setTimeout(() => {
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 200);
            
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

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

    // Form submission handler
    function handleSubmit(e, label) {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append("formType", label);

        fetch(baseUrl, {
            method: "POST",
            body: formData
        })
        .then(res => res.text())
        .then(res => {
            document.getElementById('toast').classList.remove('hidden');
            document.getElementById('toast').scrollIntoView({ behavior: 'smooth', block: 'center' });
            e.target.reset();
        })
        .catch(err => {
            alert("Error submitting form: " + err);
        });

        return false;
    }
    window.handleSubmit = handleSubmit;
});

