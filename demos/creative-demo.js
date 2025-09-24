// Creative Tools Demo
class CreativeDemo {
    constructor() {
        this.container = null;
        this.canvas = null;
        this.ctx = null;
        this.currentTool = 'brush';
        this.currentColor = '#EF7B10';
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
    }
    
    launch() {
        this.createContainer();
        this.setupCanvas();
        this.createToolPalette();
        this.createColorPalette();
        this.setupDrawingEvents();
    }
    
    startInModal(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set canvas size to fill container
        const container = canvas.parentElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';
        
        // Set up drawing context
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        this.setupDrawingEvents();
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
            flex-direction: column;
            align-items: center;
            justify-content: center;
        `;
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.cssText = `
            border: 2px solid #EF7B10;
            border-radius: 10px;
            cursor: crosshair;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.ctx.strokeStyle = '#EF7B10';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
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
        
        this.container.appendChild(closeButton);
        this.container.appendChild(this.canvas);
        document.body.appendChild(this.container);
    }
    
    createToolPalette() {
        const tools = ['brush', 'spray', 'eraser', 'line', 'circle'];
        
        const toolPalette = document.createElement('div');
        toolPalette.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
            justify-content: center;
        `;
        
        // Tool buttons
        tools.forEach(tool => {
            const button = document.createElement('button');
            button.textContent = tool;
            button.style.cssText = `
                background: ${tool === this.currentTool ? '#EF7B10' : 'rgba(255,255,255,0.1)'};
                color: white;
                border: 2px solid #EF7B10;
                padding: 10px 15px;
                border-radius: 25px;
                cursor: pointer;
                font-family: 'Orbitron', monospace;
                text-transform: capitalize;
            `;
            button.onclick = () => {
                this.currentTool = tool;
                tools.forEach(t => {
                    const btn = toolPalette.querySelector(`[data-tool="${t}"]`);
                    if (btn) btn.style.background = t === tool ? '#EF7B10' : 'rgba(255,255,255,0.1)';
                });
            };
            button.setAttribute('data-tool', tool);
            toolPalette.appendChild(button);
        });
        
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Canvas';
        clearButton.style.cssText = `
            background: #1084EF;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            margin-left: 20px;
        `;
        clearButton.onclick = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        
        const controls = document.createElement('div');
        controls.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        `;
        controls.appendChild(toolPalette);
        controls.appendChild(clearButton);
        
        this.container.insertBefore(controls, this.canvas);
    }
    
    createColorPalette() {
        const colors = ['#EF7B10', '#1084EF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        
        const colorPalette = document.createElement('div');
        colorPalette.style.cssText = `
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            justify-content: center;
        `;
        
        colors.forEach(color => {
            const button = document.createElement('button');
            button.style.cssText = `
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: ${color};
                border: 2px solid ${color === this.currentColor ? 'white' : 'transparent'};
                cursor: pointer;
            `;
            button.onclick = () => {
                this.currentColor = color;
                this.ctx.strokeStyle = color;
                colors.forEach(c => {
                    const btn = colorPalette.querySelector(`[data-color="${c}"]`);
                    if (btn) btn.style.border = c === color ? '2px solid white' : '2px solid transparent';
                });
            };
            button.setAttribute('data-color', color);
            colorPalette.appendChild(button);
        });
        
        this.container.insertBefore(colorPalette, this.canvas);
    }
    
    setupCanvas() {
        // Canvas setup is done in createContainer
    }
    
    setupDrawingEvents() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', (e) => this.stopDrawing(e));
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        
        switch(this.currentTool) {
            case 'brush':
                this.ctx.lineTo(currentX, currentY);
                this.ctx.stroke();
                break;
            case 'spray':
                for (let i = 0; i < 20; i++) {
                    const offsetX = (Math.random() - 0.5) * 20;
                    const offsetY = (Math.random() - 0.5) * 20;
                    this.ctx.fillRect(currentX + offsetX, currentY + offsetY, 2, 2);
                }
                break;
            case 'eraser':
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.lineTo(currentX, currentY);
                this.ctx.stroke();
                this.ctx.globalCompositeOperation = 'source-over';
                break;
            case 'line':
                // Will be drawn on mouse up
                break;
            case 'circle':
                // Will be drawn on mouse up
                break;
        }
        
        this.lastX = currentX;
        this.lastY = currentY;
    }
    
    stopDrawing(e) {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        
        if (this.currentTool === 'line') {
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(currentX, currentY);
            this.ctx.stroke();
        } else if (this.currentTool === 'circle') {
            const rect = this.canvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            const radius = Math.sqrt(Math.pow(currentX - this.lastX, 2) + Math.pow(currentY - this.lastY, 2));
            
            this.ctx.beginPath();
            this.ctx.arc(this.lastX, this.lastY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    close() {
        if (this.container) {
            this.container.remove();
        }
    }
    
    resize(canvas) {
        const container = canvas.parentElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
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
window.CreativeDemo = CreativeDemo;
