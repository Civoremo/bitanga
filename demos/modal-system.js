// Modal System for Demos
class ModalSystem {
    constructor() {
        this.currentModal = null;
        this.modalContainer = null;
        this.createModalContainer();
    }
    
    createModalContainer() {
        this.modalContainer = document.createElement('div');
        this.modalContainer.id = 'modal-container';
        this.modalContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        `;
        document.body.appendChild(this.modalContainer);
    }
    
    openModal(title, content, options = {}) {
        // Close any existing modal
        this.closeModal();
        
        const modal = document.createElement('div');
        modal.className = 'demo-modal';
        modal.style.cssText = `
            background: linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(22, 33, 62, 0.95));
            border: 2px solid #EF7B10;
            border-radius: 20px;
            padding: 0;
            max-width: ${options.maxWidth || '90vw'};
            max-height: ${options.maxHeight || '90vh'};
            width: ${options.width || 'auto'};
            height: ${options.height || 'auto'};
            position: relative;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(90deg, #EF7B10, #1084EF);
            padding: 15px 25px;
            color: white;
            font-family: 'Orbitron', monospace;
            font-size: 1.2rem;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.margin = '0';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s ease;
        `;
        closeButton.onmouseover = () => closeButton.style.background = 'rgba(255, 255, 255, 0.3)';
        closeButton.onmouseout = () => closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
        closeButton.onclick = () => this.closeModal();
        
        header.appendChild(titleElement);
        header.appendChild(closeButton);
        
        // Content area
        const contentArea = document.createElement('div');
        contentArea.style.cssText = `
            padding: 25px;
            color: white;
            overflow: auto;
            max-height: calc(90vh - 80px);
        `;
        
        if (typeof content === 'string') {
            contentArea.innerHTML = content;
        } else {
            contentArea.appendChild(content);
        }
        
        modal.appendChild(header);
        modal.appendChild(contentArea);
        this.modalContainer.appendChild(modal);
        
        // Show modal
        this.modalContainer.style.display = 'flex';
        this.currentModal = modal;
        
        // Add escape key listener
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
        
        // Add click outside to close
        this.modalContainer.onclick = (e) => {
            if (e.target === this.modalContainer) {
                this.closeModal();
            }
        };
        
        // Add window resize handler for responsive demos
        this.resizeHandler = () => {
            if (this.currentModal && this.currentModal.demoInstance) {
                const canvas = this.currentModal.querySelector('canvas');
                if (canvas && this.currentModal.demoInstance.resize) {
                    this.currentModal.demoInstance.resize(canvas);
                }
            }
        };
        window.addEventListener('resize', this.resizeHandler);
        
        return modal;
    }
    
    closeModal() {
        if (this.currentModal) {
            // Clean up any demo-specific resources
            if (this.currentModal.demoInstance && this.currentModal.demoInstance.destroy) {
                this.currentModal.demoInstance.destroy();
            }
            
            this.modalContainer.innerHTML = '';
            this.modalContainer.style.display = 'none';
            this.currentModal = null;
            
            // Remove event listeners
            if (this.escapeHandler) {
                document.removeEventListener('keydown', this.escapeHandler);
                this.escapeHandler = null;
            }
            if (this.resizeHandler) {
                window.removeEventListener('resize', this.resizeHandler);
                this.resizeHandler = null;
            }
        }
    }
    
    openGameModal() {
        const gameContainer = document.createElement('div');
        gameContainer.style.cssText = `
            width: 100%;
            height: 600px;
            position: relative;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
        `;
        
        // Create game canvas
        const gameCanvas = document.createElement('canvas');
        gameCanvas.id = 'game-canvas';
        gameCanvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
        `;
        gameContainer.appendChild(gameCanvas);
        
        // Game controls info
        const controlsInfo = document.createElement('div');
        controlsInfo.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: #EF7B10;
            padding: 10px;
            border-radius: 5px;
            font-family: 'Orbitron', monospace;
            font-size: 12px;
            z-index: 1000;
        `;
        controlsInfo.innerHTML = `
            <div><strong>Controls:</strong></div>
            <div>WASD/Arrows: Move</div>
            <div>Space: Up | Shift: Down</div>
            <div>Collect blue gems, avoid colored cubes</div>
        `;
        gameContainer.appendChild(controlsInfo);
        
        const modal = this.openModal('3D Game Engine', gameContainer, {
            width: '95vw',
            height: '90vh',
            maxWidth: '1200px',
            maxHeight: '800px'
        });
        
        // Initialize game in modal
        setTimeout(() => {
            if (window.gameDemo) {
                window.gameDemo.startInModal(gameCanvas);
                modal.demoInstance = window.gameDemo;
            }
        }, 100);
        
        return modal;
    }
    
    openAudioModal() {
        const audioContainer = document.createElement('div');
        audioContainer.style.cssText = `
            width: 100%;
            height: 400px;
            position: relative;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
        `;
        
        const audioCanvas = document.createElement('canvas');
        audioCanvas.id = 'audio-modal-canvas';
        audioCanvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
        `;
        audioContainer.appendChild(audioCanvas);
        
        const controls = document.createElement('div');
        controls.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
        `;
        
        const startButton = document.createElement('button');
        startButton.textContent = '🎵 Start Audio';
        startButton.style.cssText = `
            background: #EF7B10;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
        `;
        startButton.onclick = () => {
            if (window.audioDemo) {
                window.audioDemo.startInModal(audioCanvas);
            }
        };
        
        const changeButton = document.createElement('button');
        changeButton.textContent = 'Change Style';
        changeButton.style.cssText = `
            background: #1084EF;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
        `;
        changeButton.onclick = () => {
            if (window.audioDemo) {
                window.audioDemo.changeVisualizer();
            }
        };
        
        controls.appendChild(startButton);
        controls.appendChild(changeButton);
        audioContainer.appendChild(controls);
        
        const modal = this.openModal('Audio Visualizer', audioContainer, {
            width: '80vw',
            height: '70vh',
            maxWidth: '900px',
            maxHeight: '600px'
        });
        
        return modal;
    }
    
    openAIModal() {
        const aiContainer = document.createElement('div');
        aiContainer.style.cssText = `
            width: 100%;
            height: 500px;
            position: relative;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
        `;
        
        const aiCanvas = document.createElement('canvas');
        aiCanvas.id = 'ai-modal-canvas';
        aiCanvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
        `;
        aiContainer.appendChild(aiCanvas);
        
        const controls = document.createElement('div');
        controls.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
        `;
        
        const trainButton = document.createElement('button');
        trainButton.textContent = 'Train Network';
        trainButton.style.cssText = `
            background: #EF7B10;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
        `;
        trainButton.onclick = () => {
            if (window.aiDemo) {
                window.aiDemo.train();
            }
        };
        
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.style.cssText = `
            background: #1084EF;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
        `;
        resetButton.onclick = () => {
            if (window.aiDemo) {
                window.aiDemo.reset();
            }
        };
        
        controls.appendChild(trainButton);
        controls.appendChild(resetButton);
        aiContainer.appendChild(controls);
        
        const modal = this.openModal('AI Neural Network', aiContainer, {
            width: '85vw',
            height: '75vh',
            maxWidth: '1000px',
            maxHeight: '700px'
        });
        
        // Initialize AI demo in modal
        setTimeout(() => {
            if (window.aiDemo) {
                window.aiDemo.startInModal(aiCanvas);
                modal.demoInstance = window.aiDemo;
            }
        }, 100);
        
        return modal;
    }
    
    openCreativeModal() {
        const creativeContainer = document.createElement('div');
        creativeContainer.style.cssText = `
            width: 100%;
            height: 500px;
            position: relative;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
        `;
        
        const creativeCanvas = document.createElement('canvas');
        creativeCanvas.id = 'creative-modal-canvas';
        creativeCanvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
        `;
        creativeContainer.appendChild(creativeCanvas);
        
        const modal = this.openModal('Creative Drawing Tools', creativeContainer, {
            width: '85vw',
            height: '75vh',
            maxWidth: '1000px',
            maxHeight: '700px'
        });
        
        // Initialize creative demo in modal
        setTimeout(() => {
            if (window.creativeDemo) {
                window.creativeDemo.startInModal(creativeCanvas);
                modal.demoInstance = window.creativeDemo;
            }
        }, 100);
        
        return modal;
    }
    
    openVRModal() {
        const vrContainer = document.createElement('div');
        vrContainer.style.cssText = `
            width: 100%;
            height: 400px;
            position: relative;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        `;
        
        const vrInfo = document.createElement('div');
        vrInfo.style.cssText = `
            text-align: center;
            color: #EF7B10;
            font-family: 'Orbitron', monospace;
            margin-bottom: 30px;
        `;
        vrInfo.innerHTML = `
            <h3>VR Experience</h3>
            <p>Click the button below to enter VR mode</p>
            <p><small>Requires a compatible VR headset and WebXR support</small></p>
        `;
        
        const vrButton = document.createElement('button');
        vrButton.textContent = 'Enter VR';
        vrButton.style.cssText = `
            background: linear-gradient(45deg, #EF7B10, #1084EF);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            font-size: 16px;
        `;
        vrButton.onclick = () => {
            if (window.vrDemo) {
                window.vrDemo.launch();
            }
        };
        
        vrContainer.appendChild(vrInfo);
        vrContainer.appendChild(vrButton);
        
        const modal = this.openModal('VR Experience', vrContainer, {
            width: '70vw',
            height: '60vh',
            maxWidth: '800px',
            maxHeight: '500px'
        });
        
        return modal;
    }
    
    openGeometryModal() {
        const geometryContainer = document.createElement('div');
        geometryContainer.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            background: #000;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        `;
        
        // Create Three.js canvas for the modal
        const canvas = document.createElement('canvas');
        canvas.id = 'geometry-modal-canvas';
        canvas.style.cssText = `
            width: 100%;
            height: 100%;
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
        `;
        
        // Create a dedicated Three.js scene for the modal
        const modalScene = new THREE.Scene();
        const modalCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const modalRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        
        // Set up the modal scene
        modalCamera.position.z = 100;
        
        // Resize handler for modal canvas
        const resizeModalCanvas = () => {
            const containerRect = geometryContainer.getBoundingClientRect();
            const width = containerRect.width;
            const height = containerRect.height - 200; // Account for controls
            
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            
            modalCamera.aspect = width / height;
            modalCamera.updateProjectionMatrix();
            modalRenderer.setSize(width, height);
        };
        
        // Initial resize
        setTimeout(resizeModalCanvas, 100);
        
        // Add resize listener
        window.addEventListener('resize', resizeModalCanvas);
        
        // Add lighting to modal scene
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        modalScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xEF7B10, 1);
        directionalLight.position.set(50, 50, 50);
        modalScene.add(directionalLight);
        
        // Animation loop for modal scene
        const animateModal = () => {
            requestAnimationFrame(animateModal);
            modalRenderer.render(modalScene, modalCamera);
        };
        animateModal();
        
        // Add canvas to container
        geometryContainer.appendChild(canvas);
        
        // Create modal-specific geometry demo
        const modalGeometryDemo = new GeometryDemo(modalScene);
        modalGeometryDemo.init();
        
        // Text input area
        const inputArea = document.createElement('div');
        inputArea.style.cssText = `
            padding: 20px;
            background: rgba(239, 123, 16, 0.1);
            border-bottom: 2px solid #EF7B10;
        `;
        
        const title = document.createElement('h3');
        title.textContent = 'Geometric Art Generator';
        title.style.cssText = `
            color: #EF7B10;
            font-family: 'Orbitron', monospace;
            margin: 0 0 15px 0;
            text-align: center;
        `;
        
        const inputGroup = document.createElement('div');
        inputGroup.style.cssText = `
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
        `;
        
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.placeholder = 'Type your text here...';
        textInput.style.cssText = `
            flex: 1;
            min-width: 200px;
            padding: 12px 15px;
            border: 2px solid #1084EF;
            border-radius: 25px;
            background: rgba(16, 132, 239, 0.1);
            color: white;
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            outline: none;
        `;
        textInput.addEventListener('input', (e) => {
            modalGeometryDemo.generateArtFromText(e.target.value);
        });
        
        const generateButton = document.createElement('button');
        generateButton.textContent = 'Generate Art';
        generateButton.style.cssText = `
            background: #EF7B10;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            transition: background 0.3s ease;
        `;
        generateButton.onmouseover = () => generateButton.style.background = '#FF8C00';
        generateButton.onmouseout = () => generateButton.style.background = '#EF7B10';
        
        // Add click event listener
        generateButton.addEventListener('click', (e) => {
            e.preventDefault();
            modalGeometryDemo.generateArtFromText(textInput.value);
        });
        
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.style.cssText = `
            background: #1084EF;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            transition: background 0.3s ease;
        `;
        clearButton.onmouseover = () => clearButton.style.background = '#1E90FF';
        clearButton.onmouseout = () => clearButton.style.background = '#1084EF';
        clearButton.onclick = () => {
            textInput.value = '';
            modalGeometryDemo.createFloatingShapes();
        };
        
        inputGroup.appendChild(textInput);
        inputGroup.appendChild(generateButton);
        inputGroup.appendChild(clearButton);
        
        inputArea.appendChild(title);
        inputArea.appendChild(inputGroup);
        
        // Controls area
        const controlsArea = document.createElement('div');
        controlsArea.style.cssText = `
            padding: 15px 20px;
            background: rgba(16, 132, 239, 0.1);
            border-bottom: 2px solid #1084EF;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        `;
        
        const colorButton = document.createElement('button');
        colorButton.textContent = 'Change Colors';
        colorButton.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid #EF7B10;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            font-size: 12px;
        `;
        colorButton.onclick = () => {
            modalGeometryDemo.changeGeometry();
        };
        
        const rotationButton = document.createElement('button');
        rotationButton.textContent = 'Toggle Rotation';
        rotationButton.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid #1084EF;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-family: 'Orbitron', monospace;
            font-size: 12px;
        `;
        rotationButton.onclick = () => {
            modalGeometryDemo.toggleRotation();
        };
        
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '0';
        speedSlider.max = '0.05';
        speedSlider.step = '0.005';
        speedSlider.value = '0.01';
        speedSlider.style.cssText = `
            flex: 1;
            min-width: 100px;
            max-width: 200px;
        `;
        speedSlider.oninput = (e) => {
            modalGeometryDemo.setAnimationSpeed(parseFloat(e.target.value));
        };
        
        const speedLabel = document.createElement('span');
        speedLabel.textContent = 'Speed:';
        speedLabel.style.cssText = `
            color: white;
            font-family: 'Orbitron', monospace;
            font-size: 12px;
        `;
        
        controlsArea.appendChild(colorButton);
        controlsArea.appendChild(rotationButton);
        controlsArea.appendChild(speedLabel);
        controlsArea.appendChild(speedSlider);
        
        // Info area
        const infoArea = document.createElement('div');
        infoArea.style.cssText = `
            padding: 15px 20px;
            background: rgba(0, 0, 0, 0.3);
            color: #EF7B10;
            font-family: 'Orbitron', monospace;
            font-size: 12px;
            text-align: center;
            line-height: 1.4;
        `;
        infoArea.innerHTML = `
            <div><strong>How it works:</strong></div>
            <div>• Each character becomes a unique geometric shape</div>
            <div>• Shapes are arranged in a grid pattern</div>
            <div>• Colors and animations are based on character codes</div>
            <div>• Try typing your name, a message, or any text!</div>
        `;
        
        geometryContainer.appendChild(inputArea);
        geometryContainer.appendChild(controlsArea);
        geometryContainer.appendChild(infoArea);
        
        const modal = this.openModal('Geometric Art Generator', geometryContainer, {
            width: '90vw',
            height: '80vh',
            maxWidth: '1000px',
            maxHeight: '700px'
        });
        
        // Initialize with floating shapes
        setTimeout(() => {
            modalGeometryDemo.createFloatingShapes();
            modal.demoInstance = modalGeometryDemo;
            
            // Add update loop for modal geometry demo
            const updateModalGeometry = () => {
                modalGeometryDemo.update();
                requestAnimationFrame(updateModalGeometry);
            };
            updateModalGeometry();
        }, 100);
        
        return modal;
    }
}

// Export for use in main script
window.ModalSystem = ModalSystem;
