document.addEventListener('DOMContentLoaded', () => {
    let allTrips = [];
    const baseUrl = "https://script.google.com/macros/s/AKfycbzBEnTzYfb1HF0JgHzMjmUKLnHACmGpjWN_a-5W5E1Q1UvweIM97eqzmYVRLYs2LEbK/exec";
    
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
        
        const categories = [...new Set(allTrips.map(trip => trip.category))];
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
        
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

    function toggleBooking(isIndividual) {
        const btnInd = document.getElementById('btnInd');
        const btnGrp = document.getElementById('btnGrp');
        const formInd = document.getElementById('formInd');
        const formGrp = document.getElementById('formGrp');
        
        btnInd?.classList.toggle('bg-orange-500', isIndividual);
        btnInd?.classList.toggle('text-white', isIndividual);
        btnGrp?.classList.toggle('bg-orange-500', !isIndividual);
        btnGrp?.classList.toggle('text-white', !isIndividual);
        formInd?.classList.toggle('hidden', !isIndividual);
        formGrp?.classList.toggle('hidden', isIndividual);
    }
    document.getElementById('btnInd')?.addEventListener('click', () => toggleBooking(true));
    document.getElementById('btnGrp')?.addEventListener('click', () => toggleBooking(false));

    const slides = document.getElementById('slides');
    const dots = document.querySelectorAll('#dots button');
    let current = 0, slideInterval;

    function showSlide(idx) {
        current = idx;
        slides.style.transform = `translateX(-${idx * 100}%)`;
        dots.forEach((dot, i) => dot.className = i === idx ? 'w-3 h-3 rounded-full bg-green-600 opacity-80' : 'w-3 h-3 rounded-full bg-gray-300 opacity-80');
    }

    function nextSlide() { showSlide((current + 1) % dots.length); }
    function prevSlide() { showSlide((current - 1 + dots.length) % dots.length); }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    document.getElementById('prevSlide')?.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
    document.getElementById('nextSlide')?.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); resetAutoSlide(); }));
    
    const slider = document.getElementById('slider');
    slider?.addEventListener('mouseenter', () => clearInterval(slideInterval));
    slider?.addEventListener('mouseleave', startAutoSlide);

    showSlide(0);
    startAutoSlide();

    function handleSubmit(e, label) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
        submitBtn.disabled = true;

        const formData = new FormData(e.target);
        formData.append("formType", label);
        
        // Add user info if signed in and booking
        const userData = localStorage.getItem('bharatDarshanUser');
        if (userData && (label === 'Individual Booking' || label === 'Group Booking')) {
            const user = JSON.parse(userData);
            formData.append("userPhone", user.phone);
            formData.append("userName", user.name);
        }

        fetch(baseUrl, {
            method: "POST",
            body: formData
        })
        .then(res => res.text())
        .then(res => {
            // Save booking to user's local storage
            if (userData && (label === 'Individual Booking' || label === 'Group Booking')) {
                const bookingData = {
                    id: Date.now(),
                    type: label,
                    category: formData.get('category'),
                    title: formData.get('triptitle') || formData.get('groupname'),
                    travellers: formData.get('travellers'),
                    date: new Date().toLocaleDateString(),

                };
                
                const bookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
                bookings.push(bookingData);
                localStorage.setItem('userBookings', JSON.stringify(bookings));
            }
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                if (label === 'Contact Form') {
                    document.getElementById('contactToast').classList.remove('hidden');
                    document.getElementById('contactToast').scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    document.getElementById('toast').classList.remove('hidden');
                    document.getElementById('toast').scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                e.target.reset();
            }, 1000);
        })
        .catch(err => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert("Error submitting form: " + err);
        });

        return false;
    }
    window.handleSubmit = handleSubmit;
});