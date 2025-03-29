// Galaxy data with realistic information
const galaxyData = {
    andromeda: {
        name: "Andromeda Galaxy (M31)",
        distance: "2.537 million light years",
        coordinates: { ra: "00h 42m 44.3s", dec: "+41° 16' 9\"" },
        description: "The Andromeda Galaxy is the nearest major galaxy to the Milky Way.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/1280px-Andromeda_Galaxy_%28with_h-alpha%29.jpg"
    },
    milkyway: {
        name: "Milky Way Galaxy",
        distance: "We are here",
        coordinates: { ra: "17h 45m 40.0s", dec: "-29° 00' 28\"" },
        description: "Our home galaxy, a barred spiral galaxy containing our Solar System.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/ESO-VLT-Laser-phot-33a-07.jpg/1280px-ESO-VLT-Laser-phot-33a-07.jpg"
    },
    sombrero: {
        name: "Sombrero Galaxy (M104)",
        distance: "29.3 million light years",
        coordinates: { ra: "12h 39m 59.4s", dec: "-11° 37' 23\"" },
        description: "The Sombrero Galaxy has a bright nucleus, an unusually large central bulge, and a prominent dust lane.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/M104_ngc4594_sombrero_galaxy_hi-res.jpg/1280px-M104_ngc4594_sombrero_galaxy_hi-res.jpg"
    },
    whirlpool: {
        name: "Whirlpool Galaxy (M51)",
        distance: "23 million light years",
        coordinates: { ra: "13h 29m 52.7s", dec: "+47° 11' 43\"" },
        description: "The Whirlpool Galaxy is an interacting grand-design spiral galaxy with a Seyfert 2 active galactic nucleus.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Messier51_sRGB.jpg/1280px-Messier51_sRGB.jpg"
    },
    triangulum: {
        name: "Triangulum Galaxy (M33)",
        distance: "2.73 million light years",
        coordinates: { ra: "01h 33m 50.0s", dec: "+30° 39' 36\"" },
        description: "The Triangulum Galaxy is the third-largest member of the Local Group of galaxies.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Triangulum_Galaxy_Messier_33_%28cropped%29.jpg/1280px-Triangulum_Galaxy_Messier_33_%28cropped%29.jpg"
    }
};

// Planet data with realistic information
const planetData = {
    jupiter: {
        name: "Jupiter",
        distance: "588 million km (average)",
        coordinates: { ra: "19h 35m 10s", dec: "-21° 50' 20\"" },
        description: "The largest planet in our solar system, known for its Great Red Spot and numerous moons.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg"
    },
    saturn: {
        name: "Saturn",
        distance: "1.4 billion km (average)",
        coordinates: { ra: "20h 40m 30s", dec: "-18° 10' 40\"" },
        description: "Famous for its spectacular ring system, Saturn is the second-largest planet in our solar system.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg"
    },
    mars: {
        name: "Mars",
        distance: "225 million km (average)",
        coordinates: { ra: "21h 10m 15s", dec: "-25° 30' 10\"" },
        description: "The Red Planet, with polar ice caps and the largest volcano in the solar system, Olympus Mons.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg"
    },
    neptune: {
        name: "Neptune",
        distance: "4.5 billion km (average)",
        coordinates: { ra: "23h 05m 25s", dec: "-08° 15' 30\"" },
        description: "The windiest planet in our solar system, with winds reaching speeds of over 2,100 km/h.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg"
    },
    uranus: {
        name: "Uranus",
        distance: "2.9 billion km (average)",
        coordinates: { ra: "02h 30m 45s", dec: "+14° 40' 20\"" },
        description: "The ice giant that rotates on its side, with a unique sideways orientation in the solar system.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg"
    }
};

// DOM elements
const telescopeCanvas = document.getElementById('telescopeCanvas');
const ctx = telescopeCanvas.getContext('2d');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const captureBtn = document.getElementById('capture');
const galaxySelect = document.getElementById('galaxySelect');
const currentObjectEl = document.getElementById('currentObject');
const objectInfoEl = document.getElementById('objectInfo');
const coordinatesEl = document.getElementById('coordinates');
const gallery = document.getElementById('gallery');

// Set canvas size
telescopeCanvas.width = 800;
telescopeCanvas.height = 600;

// Simulation state
let currentZoom = 1;
let currentGalaxy = 'andromeda';
let currentPlanet = null;
let currentViewMode = 'galaxies'; // 'galaxies' or 'planets'
let isModelLoaded = false;
let generatedGalaxyImage = null;
let generatedPlanetImage = null;

// Initialize the simulator
// Update the initSimulator function to handle the view buttons
async function initSimulator() {
    // Load TensorFlow.js model for random galaxy generation
    try {
        // In a real application, you would load a pre-trained model here
        // For this demo, we'll simulate model loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        isModelLoaded = true;
        console.log("Deep learning model loaded successfully");
    } catch (error) {
        console.error("Failed to load model:", error);
    }
    
    // Set initial galaxy
    updateView();
    
    // Add event listeners
    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < 5) {
            currentZoom += 0.5;
            updateView();
        }
    });
    
    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > 0.5) {
            currentZoom -= 0.5;
            updateView();
        }
    });
    
    captureBtn.addEventListener('click', captureImage);
    
    // View mode buttons
    const viewGalaxiesBtn = document.getElementById('viewGalaxies');
    const viewPlanetsBtn = document.getElementById('viewPlanets');
    
    viewGalaxiesBtn.addEventListener('click', () => {
        switchToViewMode('galaxies');
        viewGalaxiesBtn.classList.add('active');
        viewPlanetsBtn.classList.remove('active');
    });
    
    viewPlanetsBtn.addEventListener('click', () => {
        switchToViewMode('planets');
        viewPlanetsBtn.classList.add('active');
        viewGalaxiesBtn.classList.remove('active');
    });
    
    galaxySelect.addEventListener('change', (e) => {
        currentGalaxy = e.target.value;
        currentZoom = 1;
        updateView();
    });
    
    document.getElementById('planetSelect').addEventListener('change', (e) => {
        currentPlanet = e.target.value;
        currentZoom = 1;
        updateView();
    });
}

// Switch between galaxies and planets view modes
function switchToViewMode(mode) {
    currentViewMode = mode;
    
    if (mode === 'galaxies') {
        document.getElementById('galaxySelect').style.display = 'inline-block';
        document.getElementById('planetSelect').style.display = 'none';
        currentGalaxy = currentGalaxy || 'andromeda';
        currentPlanet = null;
    } else {
        document.getElementById('galaxySelect').style.display = 'none';
        document.getElementById('planetSelect').style.display = 'inline-block';
        currentGalaxy = null;
        // Don't reset currentPlanet if it's already set
        if (!currentPlanet) {
            document.getElementById('planetSelect').value = '';
        }
    }
    
    updateView();
}

// Create menu system
function createMenuSystem() {
    // Add planets option group to galaxy select
    const planetsOptGroup = document.createElement('optgroup');
    planetsOptGroup.label = "Switch to Planets";
    
    const switchOption = document.createElement('option');
    switchOption.value = 'planets-menu';
    switchOption.textContent = "View Planets";
    planetsOptGroup.appendChild(switchOption);
    
    galaxySelect.appendChild(planetsOptGroup);
    
    // Create planets menu (initially hidden)
    const planetMenu = document.createElement('select');
    planetMenu.id = 'planetSelect';
    planetMenu.style.display = 'none';
    
    // Add planet options
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a Planet';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    planetMenu.appendChild(defaultOption);
    
    // Add planets
    Object.keys(planetData).forEach(planetKey => {
        const option = document.createElement('option');
        option.value = planetKey;
        option.textContent = planetData[planetKey].name;
        planetMenu.appendChild(option);
    });
    
    // Add random AI planet option
    const randomPlanetOption = document.createElement('option');
    randomPlanetOption.value = 'random-planet';
    randomPlanetOption.textContent = 'Random Exoplanet (AI Generated)';
    planetMenu.appendChild(randomPlanetOption);
    
    // Add back to galaxies option
    const backOption = document.createElement('option');
    backOption.value = 'back-to-galaxies';
    backOption.textContent = 'Back to Galaxies';
    planetMenu.appendChild(backOption);
    
    // Add event listener
    planetMenu.addEventListener('change', (e) => {
        if (e.target.value === 'back-to-galaxies') {
            switchToViewMode('galaxies');
            return;
        }
        
        currentPlanet = e.target.value;
        currentZoom = 1;
        updateView();
    });
    
    // Add to DOM
    const controlsDiv = document.querySelector('.controls');
    controlsDiv.appendChild(planetMenu);
}

// Switch between galaxies and planets view modes
function switchToViewMode(mode) {
    currentViewMode = mode;
    
    if (mode === 'galaxies') {
        document.getElementById('galaxySelect').style.display = 'inline-block';
        document.getElementById('planetSelect').style.display = 'none';
        currentGalaxy = currentGalaxy || 'andromeda';
        currentPlanet = null;
    } else {
        document.getElementById('galaxySelect').style.display = 'none';
        document.getElementById('planetSelect').style.display = 'inline-block';
        currentGalaxy = null;
        currentPlanet = '';
        document.getElementById('planetSelect').value = '';
    }
    
    currentZoom = 1;
    updateView();
}

// Update the telescope view based on current mode
function updateView() {
    if (currentViewMode === 'galaxies') {
        updateGalaxyView();
    } else {
        updatePlanetView();
    }
}

// Update the telescope view with the current planet
function updatePlanetView() {
    // Clear canvas
    ctx.clearRect(0, 0, telescopeCanvas.width, telescopeCanvas.height);
    
    if (!currentPlanet) {
        // Show selection prompt
        drawLoadingMessage("Select a planet to view");
        return;
    }
    
    if (currentPlanet === 'random-planet') {
        if (isModelLoaded) {
            generateRandomPlanet();
        } else {
            drawLoadingMessage("Loading deep learning model...");
        }
    } else {
        // Draw selected planet from our database
        const planet = planetData[currentPlanet];
        drawPlanetFromImage(planet);
        
        // Update info panel
        currentObjectEl.textContent = planet.name;
        objectInfoEl.textContent = `Distance: ${planet.distance}`;
        coordinatesEl.innerHTML = `<span>RA: ${planet.coordinates.ra}</span><span>Dec: ${planet.coordinates.dec}</span>`;
    }
}

// Draw a planet from an image URL
function drawPlanetFromImage(planet) {
    const img = new Image();
    img.onload = () => {
        // Calculate dimensions to maintain aspect ratio
        const scale = currentZoom;
        const scaledWidth = telescopeCanvas.width * scale;
        const scaledHeight = telescopeCanvas.height * scale;
        
        // Center the image
        const x = (telescopeCanvas.width - scaledWidth) / 2;
        const y = (telescopeCanvas.height - scaledHeight) / 2;
        
        // Draw the image with zoom effect
        ctx.drawImage(
            img,
            -x / scale, -y / scale,
            telescopeCanvas.width / scale, telescopeCanvas.height / scale,
            0, 0,
            telescopeCanvas.width, telescopeCanvas.height
        );
        
        // Add telescope view effects
        addTelescopeEffects();
    };
    img.src = planet.imageUrl;
}

// Generate a random planet using simulated deep learning
function generateRandomPlanet() {
    // Clear canvas
    ctx.clearRect(0, 0, telescopeCanvas.width, telescopeCanvas.height);
    
    // Set background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, telescopeCanvas.width, telescopeCanvas.height);
    
    // Create planet center
    const centerX = telescopeCanvas.width / 2;
    const centerY = telescopeCanvas.height / 2;
    
    // Random planet type (gas giant, rocky, ice giant)
    const planetType = Math.floor(Math.random() * 3);
    const planetRadius = 150 * currentZoom;
    
    // Draw planet
    ctx.beginPath();
    ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
    
    let gradient;
    
    if (planetType === 0) {
        // Gas giant (Jupiter/Saturn-like)
        gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, planetRadius);
        
        // Random base color
        const hue = Math.floor(Math.random() * 60) + 20; // Yellowish to reddish
        gradient.addColorStop(0, `hsla(${hue}, 80%, 50%, 1)`);
        gradient.addColorStop(0.7, `hsla(${hue}, 60%, 40%, 1)`);
        gradient.addColorStop(1, `hsla(${hue}, 50%, 30%, 1)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add bands
        const bandCount = Math.floor(Math.random() * 5) + 5;
        for (let i = 0; i < bandCount; i++) {
            const bandY = centerY - planetRadius + (2 * planetRadius / bandCount) * i;
            const bandHeight = planetRadius / (Math.random() * 3 + 3);
            const bandHue = hue + (Math.random() * 20 - 10);
            const bandSaturation = 60 + (Math.random() * 20);
            const bandLightness = 30 + (Math.random() * 20);
            
            // Calculate band width based on distance from center
            const distFromCenter = Math.abs(bandY - centerY);
            const maxWidth = 2 * Math.sqrt(planetRadius * planetRadius - distFromCenter * distFromCenter);
            
            ctx.fillStyle = `hsla(${bandHue}, ${bandSaturation}%, ${bandLightness}%, 0.3)`;
            ctx.fillRect(centerX - maxWidth/2, bandY, maxWidth, bandHeight);
        }
        
        // Add a spot like Jupiter's Great Red Spot
        if (Math.random() > 0.5) {
            const spotX = centerX + (Math.random() * planetRadius/2 - planetRadius/4);
            const spotY = centerY + (Math.random() * planetRadius/2 - planetRadius/4);
            const spotRadius = planetRadius / (Math.random() * 4 + 4);
            
            ctx.beginPath();
            ctx.ellipse(
                spotX, spotY, 
                spotRadius, spotRadius/2, 
                Math.random() * Math.PI, 
                0, Math.PI * 2
            );
            
            const spotHue = (hue + 180) % 360; // Complementary color
            ctx.fillStyle = `hsla(${spotHue}, 70%, 40%, 0.5)`;
            ctx.fill();
        }
        
    } else if (planetType === 1) {
        // Rocky planet (Mars/Mercury-like)
        gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, planetRadius);
        
        // Random base color (reddish, brownish)
        const hue = Math.floor(Math.random() * 60) + 10; // Reddish to brownish
        gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 1)`);
        gradient.addColorStop(0.7, `hsla(${hue}, 60%, 40%, 1)`);
        gradient.addColorStop(1, `hsla(${hue}, 50%, 30%, 1)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add craters
        const craterCount = Math.floor(Math.random() * 20) + 10;
        for (let i = 0; i < craterCount; i++) {
            // Random position within planet
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * planetRadius * 0.9;
            const craterX = centerX + Math.cos(angle) * distance;
            const craterY = centerY + Math.sin(angle) * distance;
            
            // Random crater size
            const craterRadius = Math.random() * (planetRadius / 10) + (planetRadius / 20);
            
            // Draw crater
            ctx.beginPath();
            ctx.arc(craterX, craterY, craterRadius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 40%, 60%, 0.5)`;
            ctx.fill();
            ctx.strokeStyle = `hsla(${hue}, 30%, 40%, 0.8)`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Add polar caps
        if (Math.random() > 0.5) {
            // North pole
            ctx.beginPath();
            ctx.arc(centerX, centerY - planetRadius * 0.7, planetRadius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
            
            // South pole
            ctx.beginPath();
            ctx.arc(centerX, centerY + planetRadius * 0.7, planetRadius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fill();
        }
        
    } else {
        // Ice giant (Neptune/Uranus-like)
        gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, planetRadius);
        
        // Blue to teal colors
        const hue = Math.floor(Math.random() * 60) + 180; // Bluish to tealish
        gradient.addColorStop(0, `hsla(${hue}, 80%, 70%, 1)`);
        gradient.addColorStop(0.7, `hsla(${hue}, 70%, 50%, 1)`);
        gradient.addColorStop(1, `hsla(${hue}, 60%, 40%, 1)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add atmospheric bands
        const bandCount = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < bandCount; i++) {
            const bandY = centerY - planetRadius + (2 * planetRadius / bandCount) * i;
            const bandHeight = planetRadius / (Math.random() * 2 + 3);
            const bandHue = hue + (Math.random() * 20 - 10);
            
            // Calculate band width based on distance from center
            const distFromCenter = Math.abs(bandY - centerY);
            const maxWidth = 2 * Math.sqrt(planetRadius * planetRadius - distFromCenter * distFromCenter);
            
            ctx.fillStyle = `hsla(${bandHue}, 80%, 60%, 0.2)`;
            ctx.fillRect(centerX - maxWidth/2, bandY, maxWidth, bandHeight);
        }
        
        // Add storms/spots
        const spotCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < spotCount; i++) {
            const spotX = centerX + (Math.random() * planetRadius - planetRadius/2);
            const spotY = centerY + (Math.random() * planetRadius - planetRadius/2);
            const spotRadius = planetRadius / (Math.random() * 6 + 8);
            
            ctx.beginPath();
            ctx.arc(spotX, spotY, spotRadius, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue + 30}, 90%, 80%, 0.6)`;
            ctx.fill();
        }
    }
    
    // Randomly add rings (Saturn-like)
    if (Math.random() > 0.7) {
        const ringWidth = planetRadius * (Math.random() * 0.5 + 0.5);
        const ringInnerRadius = planetRadius * 1.1;
        const ringOuterRadius = ringInnerRadius + ringWidth;
        
        // Draw rings
        ctx.beginPath();
        ctx.ellipse(
            centerX, centerY, 
            ringOuterRadius, ringOuterRadius * 0.2, 
            Math.PI * 0.2, 
            0, Math.PI * 2
        );
        ctx.moveTo(centerX + ringInnerRadius, centerY);
        ctx.ellipse(
            centerX, centerY, 
            ringInnerRadius, ringInnerRadius * 0.2, 
            Math.PI * 0.2, 
            0, Math.PI * 2, 
            true
        );
        
        // Create gradient for rings
        const ringGradient = ctx.createLinearGradient(
            centerX - ringOuterRadius, centerY,
            centerX + ringOuterRadius, centerY
        );
        ringGradient.addColorStop(0, 'rgba(255, 240, 200, 0.3)');
        ringGradient.addColorStop(0.3, 'rgba(255, 240, 200, 0.6)');
        ringGradient.addColorStop(0.5, 'rgba(255, 240, 200, 0.2)');
        ringGradient.addColorStop(0.7, 'rgba(255, 240, 200, 0.6)');
        ringGradient.addColorStop(1, 'rgba(255, 240, 200, 0.3)');
        
        ctx.fillStyle = ringGradient;
        ctx.fill();
    }
    
    // Randomly add moons
    const moonCount = Math.floor(Math.random() * 3);
    for (let i = 0; i < moonCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = planetRadius * (Math.random() * 0.5 + 1.5);
        const moonX = centerX + Math.cos(angle) * distance;
        const moonY = centerY + Math.sin(angle) * distance;
        const moonRadius = planetRadius * (Math.random() * 0.1 + 0.05);
        
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
        ctx.fill();
    }
    
    // Add telescope effects
    addTelescopeEffects();
    
    // Generate random planet name and data
    const planetNamePrefixes = ['HD', 'Kepler', 'WASP', 'GJ', 'TOI', 'K2'];
    const prefix = planetNamePrefixes[Math.floor(Math.random() * planetNamePrefixes.length)];
    const number = Math.floor(Math.random() * 9000) + 1000;
    const letter = String.fromCharCode(98 + Math.floor(Math.random() * 4)); // b, c, d, e
    const planetName = `${prefix}-${number}${letter}`;
    
    const randomRA = `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m ${Math.floor(Math.random() * 60)}.${Math.floor(Math.random() * 10)}s`;
    const randomDec = `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 90)}° ${Math.floor(Math.random() * 60)}' ${Math.floor(Math.random() * 60)}"`;
    const randomDistance = `${(Math.random() * 1000 + 10).toFixed(1)} light years`;
    
    // Update info panel
    currentObjectEl.textContent = `Exoplanet ${planetName} (AI Generated)`;
    objectInfoEl.textContent = `Distance: ${randomDistance}`;
    coordinatesEl.innerHTML = `<span>RA: ${randomRA}</span><span>Dec: ${randomDec}</span>`;
    
    // Store the generated image
    generatedPlanetImage = telescopeCanvas.toDataURL('image/png');
}

// Update the telescope view with the current galaxy
function updateGalaxyView() {
    // Clear canvas
    ctx.clearRect(0, 0, telescopeCanvas.width, telescopeCanvas.height);
    
    if (currentGalaxy === 'random') {
        if (isModelLoaded) {
            generateRandomGalaxy();
        } else {
            drawLoadingMessage("Loading deep learning model...");
        }
    } else {
        // Draw selected galaxy from our database
        const galaxy = galaxyData[currentGalaxy];
        drawGalaxyFromImage(galaxy);
        
        // Update info panel
        currentObjectEl.textContent = galaxy.name;
        objectInfoEl.textContent = `Distance: ${galaxy.distance}`;
        coordinatesEl.innerHTML = `<span>RA: ${galaxy.coordinates.ra}</span><span>Dec: ${galaxy.coordinates.dec}</span>`;
    }
}

// Draw a galaxy from an image URL
function drawGalaxyFromImage(galaxy) {
    const img = new Image();
    img.onload = () => {
        // Calculate dimensions to maintain aspect ratio
        const scale = currentZoom;
        const scaledWidth = telescopeCanvas.width * scale;
        const scaledHeight = telescopeCanvas.height * scale;
        
        // Center the image
        const x = (telescopeCanvas.width - scaledWidth) / 2;
        const y = (telescopeCanvas.height - scaledHeight) / 2;
        
        // Draw the image with zoom effect
        ctx.drawImage(
            img,
            -x / scale, -y / scale,
            telescopeCanvas.width / scale, telescopeCanvas.height / scale,
            0, 0,
            telescopeCanvas.width, telescopeCanvas.height
        );
        
        // Add telescope view effects
        addTelescopeEffects();
    };
    img.src = galaxy.imageUrl;
}

// Generate a random galaxy using simulated deep learning
function generateRandomGalaxy() {
    // In a real application, this would use TensorFlow.js to generate an image
    // For this demo, we'll create a simple procedural galaxy
    
    // Clear canvas
    ctx.clearRect(0, 0, telescopeCanvas.width, telescopeCanvas.height);
    
    // Set background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, telescopeCanvas.width, telescopeCanvas.height);
    
    // Create a galaxy center
    const centerX = telescopeCanvas.width / 2;
    const centerY = telescopeCanvas.height / 2;
    
    // Draw stars
    for (let i = 0; i < 2000; i++) {
        const distance = Math.random() * 300 * currentZoom;
        const angle = Math.random() * Math.PI * 2;
        
        // Add spiral arm effect
        const spiralFactor = 0.1;
        const adjustedAngle = angle + distance * spiralFactor;
        
        const x = centerX + Math.cos(adjustedAngle) * distance;
        const y = centerY + Math.sin(adjustedAngle) * distance;
        
        // Vary star brightness and size
        const brightness = Math.random() * 0.8 + 0.2;
        const size = Math.random() * 2 + 0.5;
        
        // Draw star
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
        ctx.fill();
    }
    
    // Draw galaxy core
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100 * currentZoom);
    gradient.addColorStop(0, 'rgba(255, 240, 200, 0.8)');
    gradient.addColorStop(0.2, 'rgba(255, 210, 150, 0.6)');
    gradient.addColorStop(0.4, 'rgba(200, 170, 120, 0.4)');
    gradient.addColorStop(1, 'rgba(100, 80, 60, 0)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 150 * currentZoom, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Add telescope effects
    addTelescopeEffects();
    
    // Update info panel with random data
    const randomRA = `${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m ${Math.floor(Math.random() * 60)}.${Math.floor(Math.random() * 10)}s`;
    const randomDec = `${Math.random() > 0.5 ? '+' : '-'}${Math.floor(Math.random() * 90)}° ${Math.floor(Math.random() * 60)}' ${Math.floor(Math.random() * 60)}"`;
    const randomDistance = `${(Math.random() * 1000 + 100).toFixed(1)} million light years`;
    
    currentObjectEl.textContent = "Deep Space Object (AI Generated)";
    objectInfoEl.textContent = `Estimated Distance: ${randomDistance}`;
    coordinatesEl.innerHTML = `<span>RA: ${randomRA}</span><span>Dec: ${randomDec}</span>`;
    
    // Store the generated image
    generatedGalaxyImage = telescopeCanvas.toDataURL('image/png');
}

// Add telescope view effects
function addTelescopeEffects() {
    // Add some noise to simulate telescope image
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * telescopeCanvas.width;
        const y = Math.random() * telescopeCanvas.height;
        const alpha = Math.random() * 0.05;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(x, y, 1, 1);
    }
    
    // Add crosshair
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, telescopeCanvas.height / 2);
    ctx.lineTo(telescopeCanvas.width, telescopeCanvas.height / 2);
    ctx.stroke();
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(telescopeCanvas.width / 2, 0);
    ctx.lineTo(telescopeCanvas.width / 2, telescopeCanvas.height);
    ctx.stroke();
    
    // Add circle in center
    ctx.beginPath();
    ctx.arc(telescopeCanvas.width / 2, telescopeCanvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
}

// Draw loading message
function drawLoadingMessage(message) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, telescopeCanvas.width, telescopeCanvas.height);
    
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(message, telescopeCanvas.width / 2, telescopeCanvas.height / 2);
}

// Capture current view
function captureImage() {
    const timestamp = new Date().toLocaleString().replace(/[/\\:]/g, '-');
    const galaxyName = currentGalaxy === 'random' ? 'Deep-Space-Object' : galaxyData[currentGalaxy].name.replace(/\s+/g, '-');
    
    // Create gallery item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    // Create image
    const img = document.createElement('img');
    img.src = currentGalaxy === 'random' && generatedGalaxyImage ? 
        generatedGalaxyImage : 
        telescopeCanvas.toDataURL('image/png');
    
    // Create caption
    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = `${galaxyName} (Zoom: ${currentZoom}x)`;
    
    // Add to gallery
    galleryItem.appendChild(img);
    galleryItem.appendChild(caption);
    gallery.appendChild(galleryItem);
}

// Initialize the simulator when the page loads
window.addEventListener('load', initSimulator);