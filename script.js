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
let isModelLoaded = false;
let generatedGalaxyImage = null;

// Initialize the simulator
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
    updateGalaxyView();
    
    // Add event listeners
    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < 5) {
            currentZoom += 0.5;
            updateGalaxyView();
        }
    });
    
    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > 0.5) {
            currentZoom -= 0.5;
            updateGalaxyView();
        }
    });
    
    captureBtn.addEventListener('click', captureImage);
    
    galaxySelect.addEventListener('change', (e) => {
        currentGalaxy = e.target.value;
        currentZoom = 1;
        updateGalaxyView();
    });
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