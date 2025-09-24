// Audio Visualizer Demo
class AudioDemo {
    constructor() {
        this.isActive = false;
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.canvas = null;
        this.ctx = null;
    }
    
    async start() {
        if (!this.isActive) {
            try {
                // Request microphone access
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                // Create audio context
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.microphone = this.audioContext.createMediaStreamSource(stream);
                
                // Connect microphone to analyser
                this.microphone.connect(this.analyser);
                
                // Configure analyser
                this.analyser.fftSize = 256;
                const bufferLength = this.analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                this.isActive = true;
                console.log('Audio:', 'Active');
                
                // Create real-time audio visualizer
                this.createRealAudioVisualizer(this.analyser, dataArray);
                
            } catch (error) {
                console.error('Error accessing microphone:', error);
                alert('Microphone access denied. Using simulated audio visualization.');
                this.createSimulatedAudioVisualizer();
            }
        } else {
            // Stop audio
            if (this.microphone) {
                this.microphone.disconnect();
            }
            if (this.audioContext) {
                this.audioContext.close();
            }
            this.isActive = false;
            console.log('Audio:', 'Inactive');
        }
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
        
        // Start with simulated visualizer
        this.createSimulatedAudioVisualizer();
    }
    
    createRealAudioVisualizer(analyser, dataArray) {
        this.canvas = document.getElementById('audio-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        const drawVisualizer = () => {
            if (!this.isActive) return;
            
            analyser.getByteFrequencyData(dataArray);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const maxRadius = Math.min(this.canvas.width, this.canvas.height) / 2 - 20;
            
            // Draw frequency bars
            const barWidth = this.canvas.width / dataArray.length;
            for (let i = 0; i < dataArray.length; i++) {
                const barHeight = (dataArray[i] / 255) * this.canvas.height * 0.8;
                const x = i * barWidth;
                const y = this.canvas.height - barHeight;
                
                // Create gradient
                const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, y);
                gradient.addColorStop(0, '#1084EF');
                gradient.addColorStop(1, '#EF7B10');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, y, barWidth - 1, barHeight);
            }
            
            // Draw circular visualizer
            this.ctx.strokeStyle = '#EF7B10';
            this.ctx.lineWidth = 3;
            
            for (let i = 0; i < dataArray.length; i++) {
                const angle = (i / dataArray.length) * Math.PI * 2;
                const radius = 30 + (dataArray[i] / 255) * maxRadius;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                if (i === 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
            
            // Draw center circle
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(239, 123, 16, 0.8)';
            this.ctx.fill();
            
            requestAnimationFrame(drawVisualizer);
        };
        
        drawVisualizer();
    }
    
    createSimulatedAudioVisualizer() {
        this.canvas = document.getElementById('audio-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        const drawVisualizer = () => {
            if (!this.isActive) return;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            const time = Date.now() * 0.001;
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            
            // Create animated circles with more complex patterns
            for (let i = 0; i < 8; i++) {
                const radius = 20 + i * 15 + Math.sin(time * 2 + i) * 15;
                const alpha = 0.8 - i * 0.1;
                
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(239, 123, 16, ${alpha})`;
                this.ctx.lineWidth = 3;
                this.ctx.stroke();
            }
            
            // Add frequency bars simulation
            const barCount = 32;
            const barWidth = this.canvas.width / barCount;
            for (let i = 0; i < barCount; i++) {
                const barHeight = Math.sin(time * 3 + i * 0.5) * 50 + 50;
                const x = i * barWidth;
                const y = this.canvas.height - barHeight;
                
                const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, y);
                gradient.addColorStop(0, '#1084EF');
                gradient.addColorStop(1, '#EF7B10');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x, y, barWidth - 2, barHeight);
            }
            
            requestAnimationFrame(drawVisualizer);
        };
        
        drawVisualizer();
    }
    
    changeVisualizer() {
        // This could be expanded to switch between different visualizer styles
        console.log('Visualizer style changed');
    }
    
    toggle() {
        this.isActive = !this.isActive;
        console.log('Audio:', this.isActive ? 'Active' : 'Inactive');
    }
    
    destroy() {
        if (this.microphone) {
            this.microphone.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.isActive = false;
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
}

// Export for use in main script
window.AudioDemo = AudioDemo;
