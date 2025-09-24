// AI Neural Network Demo
class AIDemo {
    constructor() {
        this.neuralNetwork = null;
        this.container = null;
        this.canvas = null;
        this.ctx = null;
        this.trainingData = [];
        this.trainingStep = 0;
    }
    
    launch() {
        this.createContainer();
        this.createNeuralNetwork();
        this.setupCanvas();
        this.startTraining();
    }
    
    startInModal(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size to fill container
        const container = canvas.parentElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight - 80; // Account for controls
        
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';
        
        this.createNeuralNetwork();
        this.startTraining();
    }
    
    createContainer() {
        this.container = document.createElement('div');
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.cssText = `
            border: 2px solid #EF7B10;
            border-radius: 10px;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: #EF7B10;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
        `;
        closeButton.onclick = () => this.close();
        
        this.container.appendChild(this.canvas);
        this.container.appendChild(closeButton);
        document.body.appendChild(this.container);
    }
    
    createNeuralNetwork() {
        this.neuralNetwork = new NeuralNetwork();
    }
    
    setupCanvas() {
        // Neural network simulation
        class NeuralNetwork {
            constructor() {
                this.layers = [4, 6, 4, 2]; // Input, hidden, hidden, output
                this.weights = [];
                this.biases = [];
                this.activations = [];
                
                // Initialize weights and biases
                for (let i = 0; i < this.layers.length - 1; i++) {
                    this.weights[i] = [];
                    this.biases[i] = [];
                    for (let j = 0; j < this.layers[i + 1]; j++) {
                        this.weights[i][j] = [];
                        for (let k = 0; k < this.layers[i]; k++) {
                            this.weights[i][j][k] = Math.random() * 2 - 1;
                        }
                        this.biases[i][j] = Math.random() * 2 - 1;
                    }
                }
            }
            
            forward(input) {
                this.activations = [input];
                let current = input;
                
                for (let i = 0; i < this.weights.length; i++) {
                    const next = [];
                    for (let j = 0; j < this.weights[i].length; j++) {
                        let sum = this.biases[i][j];
                        for (let k = 0; k < current.length; k++) {
                            sum += current[k] * this.weights[i][j][k];
                        }
                        next.push(this.sigmoid(sum));
                    }
                    this.activations.push(next);
                    current = next;
                }
                
                return current;
            }
            
            sigmoid(x) {
                return 1 / (1 + Math.exp(-x));
            }
            
            train(input, target, learningRate = 0.1) {
                const output = this.forward(input);
                
                // Simple backpropagation
                for (let i = this.weights.length - 1; i >= 0; i--) {
                    for (let j = 0; j < this.weights[i].length; j++) {
                        const error = (i === this.weights.length - 1) ? 
                            (target[j] - output[j]) : 0;
                        
                        this.biases[i][j] += error * learningRate;
                        
                        for (let k = 0; k < this.weights[i][j].length; k++) {
                            this.weights[i][j][k] += error * this.activations[i][k] * learningRate;
                        }
                    }
                }
            }
        }
        
        this.neuralNetwork = new NeuralNetwork();
    }
    
    drawNetwork() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const layerSpacing = this.canvas.width / (this.neuralNetwork.layers.length + 1);
        const nodeRadius = 20;
        
        // Draw connections
        this.ctx.strokeStyle = 'rgba(239, 123, 16, 0.3)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.neuralNetwork.weights.length; i++) {
            const x1 = layerSpacing * (i + 1);
            const x2 = layerSpacing * (i + 2);
            
            for (let j = 0; j < this.neuralNetwork.weights[i].length; j++) {
                const y1 = (this.canvas.height / (this.neuralNetwork.layers[i] + 1)) * (j + 1);
                
                for (let k = 0; k < this.neuralNetwork.weights[i][j].length; k++) {
                    const y2 = (this.canvas.height / (this.neuralNetwork.layers[i + 1] + 1)) * (k + 1);
                    
                    const weight = this.neuralNetwork.weights[i][j][k];
                    this.ctx.globalAlpha = Math.abs(weight);
                    this.ctx.strokeStyle = weight > 0 ? 'rgba(239, 123, 16, 0.5)' : 'rgba(16, 132, 239, 0.5)';
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(x1, y1);
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        this.ctx.globalAlpha = 1;
        for (let i = 0; i < this.neuralNetwork.layers.length; i++) {
            const x = layerSpacing * (i + 1);
            const nodeSpacing = this.canvas.height / (this.neuralNetwork.layers[i] + 1);
            
            for (let j = 0; j < this.neuralNetwork.layers[i]; j++) {
                const y = nodeSpacing * (j + 1);
                const activation = this.neuralNetwork.activations[i] ? this.neuralNetwork.activations[i][j] : 0;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(239, 123, 16, ${activation})`;
                this.ctx.fill();
                this.ctx.strokeStyle = '#EF7B10';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }
    
    startTraining() {
        // Generate training data
        this.trainingData = [];
        for (let i = 0; i < 100; i++) {
            const input = [Math.random(), Math.random(), Math.random(), Math.random()];
            const target = [input[0] > 0.5 ? 1 : 0, input[1] > 0.5 ? 1 : 0];
            this.trainingData.push({ input, target });
        }
        
        this.trainingStep = 0;
        this.trainStep();
    }
    
    trainStep() {
        if (this.trainingStep < this.trainingData.length) {
            const data = this.trainingData[this.trainingStep];
            this.neuralNetwork.train(data.input, data.target);
            this.drawNetwork();
            this.trainingStep++;
            setTimeout(() => this.trainStep(), 100);
        } else {
            this.trainingStep = 0;
            setTimeout(() => this.trainStep(), 1000);
        }
    }
    
    train() {
        console.log('Training neural network...');
        // Simulate neural network training
        const progress = document.createElement('div');
        progress.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: #EF7B10;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: 'Orbitron', monospace;
        `;
        progress.textContent = 'Training Neural Network...';
        document.body.appendChild(progress);
        
        setTimeout(() => {
            progress.textContent = 'Training Complete!';
            setTimeout(() => document.body.removeChild(progress), 1000);
        }, 2000);
    }
    
    reset() {
        console.log('Resetting neural network...');
        this.setupCanvas();
        this.startTraining();
    }
    
    close() {
        if (this.container) {
            this.container.remove();
        }
    }
    
    resize(canvas) {
        const container = canvas.parentElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight - 80;
        
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';
    }
    
    destroy() {
        this.close();
    }
}

// Export for use in main script
window.AIDemo = AIDemo;
