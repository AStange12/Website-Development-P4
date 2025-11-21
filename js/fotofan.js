// FotoFan JavaScript - Photo Management Web App
// Simulates database functionality with sample data

$(document).ready(function() {
    // Sample photo data (simulating database)
    const samplePhotos = {
        'Joe': [
            {
                id: 1,
                url: 'images/gotSnow.jpg',
                thumbnail: 'images/gotSnow.jpg',
                title: 'Snow Day Fun',
                year: '2024',
                country: 'USA',
                state: 'Massachusetts',
                description: 'A beautiful winter day in the mountains'
            },
            {
                id: 2,
                url: 'images/gousiePous.jpg',
                thumbnail: 'images/gousiePous.jpg',
                title: 'Summer Memories',
                year: '2023',
                country: 'USA',
                state: 'California',
                description: 'Relaxing day by the beach'
            },
            {
                id: 3,
                url: 'images/mikeGousie.jpg',
                thumbnail: 'images/mikeGousie.jpg',
                title: 'City Adventure',
                year: '2024',
                country: 'USA',
                state: 'New York',
                description: 'Exploring the urban landscape'
            },
            {
                id: 4,
                url: 'images/inDaMts.jpg',
                thumbnail: 'images/inDaMts.jpg',
                title: 'Mountain Hiking',
                year: '2022',
                country: 'Canada',
                state: '',
                description: 'Breathtaking mountain views'
            },
            {
                id: 5,
                url: 'images/youngerGous.jpg',
                thumbnail: 'images/youngerGous.jpg',
                title: 'Family Gathering',
                year: '2023',
                country: 'USA',
                state: 'Florida',
                description: 'Annual family reunion'
            }
        ],
        'Jane': [
            {
                id: 6,
                url: 'images/gotSnow.jpg',
                thumbnail: 'images/gotSnow.jpg',
                title: 'Winter Wonderland',
                year: '2025',
                country: 'USA',
                state: 'Massachusetts',
                description: 'Fresh snow covering everything'
            },
            {
                id: 7,
                url: 'images/gousiePous.jpg',
                thumbnail: 'images/gousiePous.jpg',
                title: 'Sunset Views',
                year: '2024',
                country: 'France',
                state: '',
                description: 'Magical sunset in Paris'
            },
            {
                id: 8,
                url: 'images/mikeGousie.jpg',
                thumbnail: 'images/mikeGousie.jpg',
                title: 'Travel Memories',
                year: '2023',
                country: 'Japan',
                state: '',
                description: 'Cherry blossom season in Kyoto'
            },
            {
                id: 9,
                url: 'images/inDaMts.jpg',
                thumbnail: 'images/inDaMts.jpg',
                title: 'Nature Walk',
                year: '2024',
                country: 'UK',
                state: '',
                description: 'Peaceful forest trail'
            }
        ]
    };

    // Application state
    let currentUser = '';
    let currentPhotos = [];
    let filteredPhotos = [];
    let currentPhotoIndex = -1;
    let slideshowInterval = null;
    let currentPage = 1;
    const photosPerPage = 12;

    // Initialize app
    function initApp() {
        // Check if user is logged in
        currentUser = sessionStorage.getItem('loggedInUser');
        
        if (!currentUser) {
            // Redirect to login if not logged in
            alert('Please login to access FotoFan');
            window.location.href = 'index.html';
            return;
        }

        // Update UI with user info
        $('#username').text(currentUser);
        
        // Load user's photos
        loadUserPhotos();
        
        // Set up event handlers
        setupEventHandlers();
        
        // Show state filter only for USA
        $('#countryFilter').on('change', function() {
            if ($(this).val() === 'USA') {
                $('#stateGroup').show();
            } else {
                $('#stateGroup').hide();
                $('#stateFilter').val('');
            }
        });
    }

    // Load user's photos from "database"
    function loadUserPhotos() {
        $('#loadingIndicator').show();
        
        // Simulate loading delay
        setTimeout(() => {
            currentPhotos = samplePhotos[currentUser] || [];
            filteredPhotos = [...currentPhotos];
            displayPhotos();
            updatePhotoCount();
            populateSearchOptions();
            $('#loadingIndicator').hide();
        }, 500);
    }

    // Populate datalist options based on current photos
    function populateSearchOptions() {
        const filenames = [...new Set(currentPhotos.map(photo => photo.url.split('/').pop().split('.')[0]))];
        const years = [...new Set(currentPhotos.map(photo => photo.year))].sort();
        const countries = [...new Set(currentPhotos.map(photo => photo.country))].sort();
        const states = [...new Set(currentPhotos.map(photo => photo.state).filter(state => state))].sort();

        // Populate filename datalist
        $('#filenameList').empty();
        filenames.forEach(filename => {
            $('#filenameList').append(`<option value="${filename}">`);
        });

        // Populate year datalist
        $('#yearList').empty();
        years.forEach(year => {
            $('#yearList').append(`<option value="${year}">`);
        });

        // Populate country datalist
        $('#countryList').empty();
        countries.forEach(country => {
            $('#countryList').append(`<option value="${country}">`);
        });

        // Populate state datalist
        $('#stateList').empty();
        states.forEach(state => {
            $('#stateList').append(`<option value="${state}">`);
        });
    }

    // Display photos in thumbnail gallery
    function displayPhotos() {
        const container = $('#thumbnailsContainer');
        container.empty();

        if (filteredPhotos.length === 0) {
            container.html('<div class="no-photos"><p>No photos found. Try adjusting your search or filters.</p></div>');
            updatePagination();
            return;
        }

        // Calculate pagination
        const startIndex = (currentPage - 1) * photosPerPage;
        const endIndex = Math.min(startIndex + photosPerPage, filteredPhotos.length);
        const photosToShow = filteredPhotos.slice(startIndex, endIndex);

        // Create thumbnail elements
        photosToShow.forEach((photo, index) => {
            const thumbnail = $(`
                <img src="${photo.thumbnail}" 
                     alt="${photo.title}" 
                     class="thumbnail" 
                     data-photo-id="${photo.id}"
                     data-index="${startIndex + index}">
            `);
            
            // Add click handler with animation
            thumbnail.on('click', function() {
                const photoIndex = parseInt($(this).data('index'));
                selectPhoto(photoIndex);
                
                // Add visual feedback
                $('.thumbnail').removeClass('active');
                $(this).addClass('active');
                
                // Smooth animation
                $(this).addClass('loading');
                setTimeout(() => $(this).removeClass('loading'), 300);
            });
            
            container.append(thumbnail);
        });

        updatePagination();
    }

    // Select and display a photo
    function selectPhoto(index) {
        if (index < 0 || index >= filteredPhotos.length) return;
        
        currentPhotoIndex = index;
        const photo = filteredPhotos[index];
        
        // Hide placeholder, show photo with fade effect
        $('#photoPlaceholder').fadeOut(200, function() {
            $('#mainPhoto').attr('src', photo.url).fadeIn(300);
            $('#photoInfo').fadeIn(300);
            
            // Update photo information
            $('#photoTitle').text(photo.title);
            $('#photoYear').text(photo.year);
            $('#photoLocation').text(getLocationString(photo));
            $('#photoDescription').text(photo.description);
            
            // Show navigation arrows
            $('#prevPhoto, #nextPhoto').fadeIn(200);
        });
    }

    // Get formatted location string
    function getLocationString(photo) {
        if (photo.country === 'USA' && photo.state) {
            return `${photo.state}, ${photo.country}`;
        }
        return photo.country;
    }

    // Update photo count display
    function updatePhotoCount() {
        const count = filteredPhotos.length;
        const text = count === 1 ? '1 photo' : `${count} photos`;
        $('#photoCount').text(text);
    }

    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
        
        if (totalPages <= 1) {
            $('#pagination').hide();
            return;
        }
        
        $('#pagination').show();
        $('#pageInfo').text(`Page ${currentPage} of ${totalPages}`);
        
        $('#prevPage').prop('disabled', currentPage <= 1);
        $('#nextPage').prop('disabled', currentPage >= totalPages);
    }

    // Search functionality
    function performSearch() {
        const filenameSearch = $('#filenameSearch').val().toLowerCase();
        const yearSearch = $('#yearSearch').val().toLowerCase();
        const countrySearch = $('#countrySearch').val().toLowerCase();
        const stateSearch = $('#stateSearch').val().toLowerCase();
        
        // If all search fields are empty, show all photos
        if (!filenameSearch && !yearSearch && !countrySearch && !stateSearch) {
            filteredPhotos = [...currentPhotos];
        } else {
            filteredPhotos = currentPhotos.filter(photo => {
                const filename = photo.url.split('/').pop().toLowerCase();
                const photoYear = photo.year.toLowerCase();
                const photoCountry = photo.country.toLowerCase();
                const photoState = photo.state.toLowerCase();
                
                const matchesFilename = !filenameSearch || filename.includes(filenameSearch);
                const matchesYear = !yearSearch || photoYear.includes(yearSearch);
                const matchesCountry = !countrySearch || photoCountry.includes(countrySearch);
                const matchesState = !stateSearch || photoState.includes(stateSearch);
                
                return matchesFilename && matchesYear && matchesCountry && matchesState;
            });
        }
        
        currentPage = 1;
        displayPhotos();
        updatePhotoCount();
        resetMainPhoto();
    }

    // Clear all search fields
    function clearSearch() {
        $('#filenameSearch').val('');
        $('#yearSearch').val('');
        $('#countrySearch').val('');
        $('#stateSearch').val('');
        performSearch();
    }


    // Reset main photo display
    function resetMainPhoto() {
        $('#mainPhoto').hide();
        $('#photoInfo').hide();
        $('#prevPhoto, #nextPhoto').hide();
        $('#photoPlaceholder').show();
        $('.thumbnail').removeClass('active');
        currentPhotoIndex = -1;
    }

    // Slideshow functionality
    function startSlideshow() {
        if (filteredPhotos.length === 0) {
            alert('No photos to display in slideshow');
            return;
        }
        
        const speed = parseInt($('#slideSpeed').val());
        let slideIndex = 0;
        
        $('#slideshowModal').fadeIn();
        showSlidePhoto(slideIndex);
        
        slideshowInterval = setInterval(() => {
            slideIndex = (slideIndex + 1) % filteredPhotos.length;
            showSlidePhoto(slideIndex);
        }, speed);
        
        $('#startSlideshow').hide();
        $('#stopSlideshow').show();
        $('.slideshow-controls').show();
    }

    function stopSlideshow() {
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
            slideshowInterval = null;
        }
        
        $('#slideshowModal').fadeOut();
        $('#startSlideshow').show();
        $('#stopSlideshow').hide();
        $('.slideshow-controls').hide();
    }

    function showSlidePhoto(index) {
        const photo = filteredPhotos[index];
        $('#slideshowImage').attr('src', photo.url);
        $('#slideshowTitle').text(photo.title);
        $('#slideshowMeta').text(`${photo.year} • ${getLocationString(photo)}`);
        
        // Update progress bar
        const progress = ((index + 1) / filteredPhotos.length) * 100;
        $('#progressBar').css('width', progress + '%');
    }

    // Set up all event handlers
    function setupEventHandlers() {
        // Search functionality
        $('#searchBtn').on('click', performSearch);
        $('#clearSearch').on('click', clearSearch);
        
        // Allow search on Enter key for all search fields
        $('#filenameSearch, #yearSearch, #countrySearch, #stateSearch').on('keypress', function(e) {
            if (e.which === 13) performSearch();
        });
        
        // Real-time search as user types (with debounce)
        let searchTimeout;
        $('#filenameSearch, #yearSearch, #countrySearch, #stateSearch').on('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 300);
        });

        // Photo navigation
        $('#prevPhoto').on('click', function() {
            if (currentPhotoIndex > 0) {
                selectPhoto(currentPhotoIndex - 1);
                updateActiveThumbnail();
            }
        });
        
        $('#nextPhoto').on('click', function() {
            if (currentPhotoIndex < filteredPhotos.length - 1) {
                selectPhoto(currentPhotoIndex + 1);
                updateActiveThumbnail();
            }
        });

        // Pagination
        $('#prevPage').on('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayPhotos();
            }
        });
        
        $('#nextPage').on('click', function() {
            const totalPages = Math.ceil(filteredPhotos.length / photosPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayPhotos();
            }
        });

        // Slideshow controls
        $('#startSlideshow').on('click', startSlideshow);
        $('#stopSlideshow').on('click', stopSlideshow);
        $('#closeSlideshowBtn').on('click', stopSlideshow);

        // Upload modal (non-functional) - sidebar button only
        $('#uploadBtnSidebar').on('click', function() {
            $('#uploadModal').fadeIn();
        });
        
        $('.close').on('click', function() {
            $('#uploadModal').fadeOut();
        });

        // Logout functionality
        $('#logoutBtn').on('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                sessionStorage.removeItem('loggedInUser');
                sessionStorage.removeItem('isLoggedIn');
                window.location.href = 'index.html';
            }
        });

        // Keyboard shortcuts
        $(document).on('keydown', function(e) {
            if ($('#slideshowModal').is(':visible')) {
                if (e.key === 'Escape') {
                    stopSlideshow();
                }
                return;
            }
            
            if (currentPhotoIndex >= 0) {
                switch(e.key) {
                    case 'ArrowLeft':
                        $('#prevPhoto').click();
                        break;
                    case 'ArrowRight':
                        $('#nextPhoto').click();
                        break;
                    case 'Escape':
                        resetMainPhoto();
                        break;
                }
            }
        });

        // Close modals when clicking outside
        $(window).on('click', function(e) {
            if ($(e.target).is('#uploadModal')) {
                $('#uploadModal').fadeOut();
            }
            if ($(e.target).is('#slideshowModal')) {
                stopSlideshow();
            }
        });
    }

    // Update active thumbnail highlight
    function updateActiveThumbnail() {
        $('.thumbnail').removeClass('active');
        $(`.thumbnail[data-index="${currentPhotoIndex}"]`).addClass('active');
    }

    // Initialize the app
    initApp();
});

// Add smooth loading animations
$(window).on('load', function() {
    $('.thumbnail').each(function(index) {
        $(this).delay(index * 50).animate({opacity: 1}, 200);
    });
});