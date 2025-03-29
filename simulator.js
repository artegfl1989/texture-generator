class ElectricMotorSimulator {
    constructor() {
        this.model = null;
        this.isAIControlled = false;
        this.setupCanvas();
        this.setupControls();
        this.initializeAI();
    }

    async initializeAI() {
        // Create a simple neural network model
        this.model = tf.sequential({
            layers: [
                tf.layers.dense({ inputShape: [3], units: 64, activation: 'relu' }),
                tf.layers.dense({ units: 32, activation: 'relu' }),
                tf.layers.dense({ units: 1, activation: 'sigmoid' })
            ]
        });

        // Compile the model
        this.model.compile({
            optimizer: tf.train.adam(0.01),
            loss: 'meanSquaredError'
        });

        // Train the model with some initial data
        await this.trainModel();
    }

    async trainModel() {
        // Generate training data
        const trainingData = this.generateTrainingData(1000);
        
        // Train the model
        const xs = tf.tensor2d(trainingData.inputs);
        const ys = tf.tensor2d(trainingData.outputs);

        await this.model.fit(xs, ys, {
            epochs: 50,
            batchSize: 32
        });

        xs.dispose();
        ys.dispose();
    }

    generateTrainingData(samples) {
        const inputs = [];
        const outputs = [];

        for (let i = 0; i < samples; i++) {
            const speed = Math.random();
            const load = Math.random();
            const resistance = Math.random();
            
            inputs.push([speed, load, resistance]);
            
            // Simplified physics-based output calculation
            const efficiency = (speed * 0.7 + load * 0.2 + resistance * 0.1);
            outputs.push([efficiency]);
        }

        return { inputs, outputs };
    }

    setupCanvas() {
        this.canvas = document.getElementById('motorCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.angle = 0;
    }

    setupControls() {
        this.speedControl = document.getElementById('speedControl');
        this.loadControl = document.getElementById('loadControl');
        this.resistanceControl = document.getElementById('resistanceControl');
        
        document.getElementById('startAI').addEventListener('click', () => this.startAIControl());
        document.getElementById('stopAI').addEventListener('click', () => this.stopAIControl());
        
        this.updateLoop();
    }

    async startAIControl() {
        this.isAIControlled = true;
        this.aiLoop();
    }

    stopAIControl() {
        this.isAIControlled = false;
    }

    async aiLoop() {
        if (!this.isAIControlled) return;

        const currentState = [
            this.speedControl.value / 1000,
            this.loadControl.value / 100,
            this.resistanceControl.value / 100
        ];

        const prediction = await this.model.predict(tf.tensor2d([currentState])).data();
        
        // Adjust controls based on AI prediction
        this.speedControl.value = prediction[0] * 1000;
        
        this.updateMetrics();
        this.drawMotor();

        setTimeout(() => this.aiLoop(), 100);
    }

    updateMetrics() {
        const speed = this.speedControl.value;
        const load = this.loadControl.value;
        const resistance = this.resistanceControl.value;

        document.getElementById('speedValue').textContent = Math.round(speed);
        document.getElementById('loadValue').textContent = Math.round(load);
        document.getElementById('resistanceValue').textContent = Math.round(resistance);

        // Calculate metrics
        const power = (speed * load * 0.1).toFixed(2);
        const efficiency = (100 - (resistance * 0.5)).toFixed(1);
        const temp = (20 + (speed * 0.05) + (load * 0.05)).toFixed(1);

        document.getElementById('powerConsumption').textContent = power;
        document.getElementById('efficiency').textContent = efficiency;
        document.getElementById('temperature').textContent = temp;
    }

    drawMotor() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Disegna il cielo
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, 200);

        // Disegna le onde del mare
        this.ctx.beginPath();
        this.ctx.moveTo(0, 200);
        for (let x = 0; x <= this.canvas.width; x += 20) {
            const waveHeight = 10 * Math.sin((x + this.angle * 5) / 30);
            this.ctx.lineTo(x, 200 + waveHeight);
        }
        this.ctx.lineTo(this.canvas.width, 400);
        this.ctx.lineTo(0, 400);
        this.ctx.closePath();
        this.ctx.fillStyle = '#0077be';
        this.ctx.fill();

        // Disegna la nave
        this.ctx.beginPath();
        this.ctx.moveTo(200, 180);
        this.ctx.lineTo(400, 180);
        this.ctx.lineTo(450, 230);
        this.ctx.lineTo(150, 230);
        this.ctx.closePath();
        this.ctx.fillStyle = '#555';
        this.ctx.fill();

        // Disegna il motore e l'elica
        this.ctx.save();
        this.ctx.translate(300, 250);

        // Alloggiamento motore
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 40, 0, Math.PI * 2);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();

        // Elica rotante
        this.angle += (this.speedControl.value / 1000) * 0.1;
        this.ctx.rotate(this.angle);
        
        // Disegna le pale dell'elica
        for (let i = 0; i < 3; i++) {
            this.ctx.save();
            this.ctx.rotate((i * Math.PI * 2) / 3);
            this.ctx.beginPath();
            this.ctx.moveTo(-5, 0);
            this.ctx.lineTo(15, -20);
            this.ctx.lineTo(40, -15);
            this.ctx.lineTo(15, 0);
            this.ctx.fillStyle = '#007bff';
            this.ctx.fill();
            this.ctx.restore();
        }

        this.ctx.restore();

        // Disegna indicatori di potenza
        this.drawPowerIndicators();
    }

    drawPowerIndicators() {
        const speed = this.speedControl.value;
        const power = speed * this.loadControl.value * 0.1;

        // Disegna indicatore di potenza
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Potenza: ${power.toFixed(2)} kW`, 20, 30);
        this.ctx.fillText(`Velocità: ${Math.round(speed)} RPM`, 20, 50);
        
        // Disegna barra della potenza
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(20, 60, 150, 20);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(20, 60, (power / 100) * 150, 20);
    }

    updateLoop() {
        this.updateMetrics();
        this.drawMotor();
        requestAnimationFrame(() => this.updateLoop());
    }
}

// Initialize the simulator when the page loads
window.addEventListener('load', () => {
    new ElectricMotorSimulator();
});