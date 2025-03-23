// First, add TensorFlow.js to your HTML file
// Add this in the head section of your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
// <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/magenta-arbitrary-image-stylization"></script>

document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const texturePreview = document.getElementById('texturePreview');

    function generatePerlinNoise(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        let imageData = ctx.createImageData(width, height);
        let data = imageData.data;
        
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let value = (noise.perlin2(x / 100, y / 100) + 1) * 0.5;
                let index = (x + y * width) * 4;
                
                data[index] = value * 255;     // R
                data[index + 1] = value * 255; // G
                data[index + 2] = value * 255; // B
                data[index + 3] = 255;         // A
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    generateBtn.addEventListener('click', () => {
        const prompt = promptInput.value.trim();
        
        if (!prompt) {
            alert('Please enter a texture description');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        texturePreview.innerHTML = '<p>Generating texture...</p>';

        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1024;
            canvas.height = 1024;
            const ctx = canvas.getContext('2d');

            // Generate base noise texture
            const noiseCanvas = generatePerlinNoise(1024, 1024);
            ctx.drawImage(noiseCanvas, 0, 0);

            // Add some variation
            ctx.globalCompositeOperation = 'multiply';
            for (let i = 0; i < 3; i++) {
                const scale = Math.random() * 0.5 + 0.5;
                ctx.drawImage(noiseCanvas, 
                    0, 0, 1024, 1024,
                    0, 0, 1024 * scale, 1024 * scale
                );
            }

            // Display result
            const img = new Image();
            img.onload = () => {
                texturePreview.innerHTML = '';
                texturePreview.appendChild(img);
                downloadBtn.disabled = false;
            };
            img.src = canvas.toDataURL('image/png');

        } catch (error) {
            console.error('Generation error:', error);
            texturePreview.innerHTML = '<p>Error generating texture</p>';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Texture';
        }
    });

    downloadBtn.addEventListener('click', () => {
        const img = texturePreview.querySelector('img');
        if (img) {
            const link = document.createElement('a');
            link.download = 'texture_4k.png';
            link.href = img.src;
            link.click();
        }
    });
});

// Perlin Noise implementation
const noise = {
    grad3: [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],
    p: [...Array(256)].map(() => Math.floor(Math.random() * 256)),
    
    perlin2: function(x, y) {
        // Simple Perlin noise implementation
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        
        const u = this.fade(x);
        const v = this.fade(y);
        
        const A = this.p[X] + Y;
        const B = this.p[X + 1] + Y;
        
        return this.lerp(v,
            this.lerp(u,
                this.grad2(this.p[A], x, y),
                this.grad2(this.p[B], x - 1, y)
            ),
            this.lerp(u,
                this.grad2(this.p[A + 1], x, y - 1),
                this.grad2(this.p[B + 1], x - 1, y - 1)
            )
        );
    },
    
    fade: t => t * t * t * (t * (t * 6 - 15) + 10),
    lerp: (t, a, b) => a + t * (b - a),
    grad2: (hash, x, y) => {
        const h = hash & 15;
        const grad = 1 + (h & 7);
        return ((h & 8) ? -grad : grad) * x + ((h & 4) ? -grad : grad) * y;
    }
};