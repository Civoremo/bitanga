// 3D Game Demo
class GameDemo {
    constructor(scene) {
        this.scene = scene;
        this.gameObjects = [];
        this.gameScore = 0;
        this.gameRunning = false;
        this.gameRenderer = null;
        this.gameCamera = null;
        this.gameScene = null;
        this.setupControls();
    }
    
    setupControls() {
        document.addEventListener('keydown', (event) => this.handleInput(event));
    }
    
    start() {
        this.clearGame();
        this.createPlayer();
        this.createObstacles();
        this.createCollectibles();
        this.gameScore = 0;
        this.gameRunning = true;
        this.updateScore();
    }
    
    startInModal(canvas) {
        // Create dedicated game scene
        this.gameScene = new THREE.Scene();
        
        // Set canvas size to fill container
        const container = canvas.parentElement;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight - 40; // Account for controls
        
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';
        
        this.gameCamera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
        this.gameRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        this.gameRenderer.setSize(containerWidth, containerHeight);
        
        // Add lighting to game scene
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.gameScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xEF7B10, 1);
        directionalLight.position.set(50, 50, 50);
        this.gameScene.add(directionalLight);
        
        // Start the game
        this.clearGame();
        this.createPlayer();
        this.createObstacles();
        this.createCollectibles();
        this.gameScore = 0;
        this.gameRunning = true;
        this.updateScore();
        
        // Start game animation loop
        this.animateGame();
    }
    
    animateGame() {
        if (!this.gameRunning || !this.gameRenderer) return;
        
        this.update();
        this.gameRenderer.render(this.gameScene, this.gameCamera);
        requestAnimationFrame(() => this.animateGame());
    }
    
    clearGame() {
        if (this.gameScene) {
            this.gameObjects.forEach(obj => this.gameScene.remove(obj));
        } else {
            this.gameObjects.forEach(obj => this.scene.remove(obj));
        }
        this.gameObjects = [];
    }
    
    createPlayer() {
        const playerGeometry = new THREE.SphereGeometry(2, 16, 16);
        const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xEF7B10 });
        const player = new THREE.Mesh(playerGeometry, playerMaterial);
        player.position.set(0, 0, 0);
        player.userData = { type: 'player', velocity: new THREE.Vector3(0, 0, 0) };
        this.gameObjects.push(player);
        if (this.gameScene) {
            this.gameScene.add(player);
        } else {
            this.scene.add(player);
        }
    }
    
    createObstacles() {
        for (let i = 0; i < 20; i++) {
            const obstacleGeometry = new THREE.BoxGeometry(
                Math.random() * 3 + 1,
                Math.random() * 3 + 1,
                Math.random() * 3 + 1
            );
            const obstacleMaterial = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6) 
            });
            const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
            obstacle.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
            obstacle.userData = { type: 'obstacle' };
        this.gameObjects.push(obstacle);
        if (this.gameScene) {
            this.gameScene.add(obstacle);
        } else {
            this.scene.add(obstacle);
        }
        }
    }
    
    createCollectibles() {
        for (let i = 0; i < 10; i++) {
            const collectibleGeometry = new THREE.OctahedronGeometry(1);
            const collectibleMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x1084EF,
                emissive: 0x1084EF,
                emissiveIntensity: 0.3
            });
            const collectible = new THREE.Mesh(collectibleGeometry, collectibleMaterial);
            collectible.position.set(
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 80
            );
            collectible.userData = { type: 'collectible' };
        this.gameObjects.push(collectible);
        if (this.gameScene) {
            this.gameScene.add(collectible);
        } else {
            this.scene.add(collectible);
        }
        }
    }
    
    handleInput(event) {
        if (!this.gameRunning) return;
        
        const player = this.gameObjects.find(obj => obj.userData.type === 'player');
        if (!player) return;
        
        const speed = 0.5;
        const velocity = player.userData.velocity;
        
        switch(event.code) {
            case 'KeyW':
            case 'ArrowUp':
                velocity.z -= speed;
                break;
            case 'KeyS':
            case 'ArrowDown':
                velocity.z += speed;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                velocity.x -= speed;
                break;
            case 'KeyD':
            case 'ArrowRight':
                velocity.x += speed;
                break;
            case 'Space':
                velocity.y += speed;
                event.preventDefault();
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                velocity.y -= speed;
                break;
        }
    }
    
    update() {
        if (!this.gameRunning) return;
        
        const player = this.gameObjects.find(obj => obj.userData.type === 'player');
        if (!player) return;
        
        // Update player position
        player.position.add(player.userData.velocity);
        
        // Apply damping
        player.userData.velocity.multiplyScalar(0.9);
        
        // Check collisions with collectibles
        this.gameObjects.forEach(obj => {
            if (obj.userData.type === 'collectible') {
                const distance = player.position.distanceTo(obj.position);
            if (distance < 3) {
                // Collect item
                if (this.gameScene) {
                    this.gameScene.remove(obj);
                } else {
                    this.scene.remove(obj);
                }
                this.gameObjects.splice(this.gameObjects.indexOf(obj), 1);
                this.gameScore += 10;
                this.updateScore();
                
                // Create particle effect
                this.createCollectEffect(obj.position);
            }
            }
        });
        
        // Check collisions with obstacles
        this.gameObjects.forEach(obj => {
            if (obj.userData.type === 'obstacle') {
                const distance = player.position.distanceTo(obj.position);
                if (distance < 3) {
                    // Game over
                    this.gameRunning = false;
                    this.showGameOver();
                }
            }
        });
        
        // Rotate collectibles
        this.gameObjects.forEach(obj => {
            if (obj.userData.type === 'collectible') {
                obj.rotation.x += 0.02;
                obj.rotation.y += 0.02;
            }
        });
    }
    
    createCollectEffect(position) {
        const particleCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = position.x + (Math.random() - 0.5) * 4;
            positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 4;
            positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 4;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x1084EF,
            size: 0.5,
            transparent: true,
            opacity: 1
        });
        
        const particles = new THREE.Points(geometry, material);
        if (this.gameScene) {
            this.gameScene.add(particles);
        } else {
            this.scene.add(particles);
        }
        
        // Animate particles
        let opacity = 1;
        const animate = () => {
            opacity -= 0.02;
            material.opacity = opacity;
            particles.rotation.y += 0.1;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                if (this.gameScene) {
                    this.gameScene.remove(particles);
                } else {
                    this.scene.remove(particles);
                }
            }
        };
        animate();
    }
    
    updateScore() {
        let scoreElement = document.getElementById('game-score');
        if (!scoreElement) {
            scoreElement = document.createElement('div');
            scoreElement.id = 'game-score';
            scoreElement.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                color: #EF7B10;
                font-family: 'Orbitron', monospace;
                font-size: 24px;
                font-weight: bold;
                z-index: 1000;
                text-shadow: 0 0 10px rgba(239, 123, 16, 0.5);
            `;
            document.body.appendChild(scoreElement);
        }
        scoreElement.textContent = `Score: ${this.gameScore}`;
    }
    
    showGameOver() {
        const gameOverElement = document.createElement('div');
        gameOverElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: #EF7B10;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            font-family: 'Orbitron', monospace;
            z-index: 10000;
            border: 2px solid #EF7B10;
        `;
        
        gameOverElement.innerHTML = `
            <h2>Game Over!</h2>
            <p>Final Score: ${this.gameScore}</p>
            <button onclick="this.parentElement.remove(); window.gameDemo.start();" style="
                background: #EF7B10;
                border: none;
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                margin-top: 20px;
                font-family: inherit;
            ">Play Again</button>
        `;
        
        document.body.appendChild(gameOverElement);
    }
    
    destroy() {
        this.clearGame();
        this.gameRunning = false;
    }
    
    resize(canvas) {
        if (this.gameRenderer && this.gameCamera) {
            const container = canvas.parentElement;
            const containerWidth = container.offsetWidth;
            const containerHeight = container.offsetHeight - 40;
            
            canvas.width = containerWidth;
            canvas.height = containerHeight;
            canvas.style.width = containerWidth + 'px';
            canvas.style.height = containerHeight + 'px';
            
            this.gameCamera.aspect = containerWidth / containerHeight;
            this.gameCamera.updateProjectionMatrix();
            this.gameRenderer.setSize(containerWidth, containerHeight);
        }
    }
}

// Export for use in main script
window.GameDemo = GameDemo;
