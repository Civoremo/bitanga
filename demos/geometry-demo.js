// Geometric Art Generator Demo
class GeometryDemo {
    constructor(scene) {
        this.scene = scene;
        this.artShapes = [];
        this.isRotationActive = true;
        this.currentText = '';
        this.animationSpeed = 0.01;
        this.colorScheme = 0;
        this.geometryTypes = [
            'box', 'sphere', 'cone', 'torus', 'octahedron', 'tetrahedron', 
            'cylinder', 'plane', 'ring', 'dodecahedron'
        ];
    }
    
    init() {
        // Create initial floating shapes
        this.createFloatingShapes();
    }
    
    createFloatingShapes() {
        // Clear existing shapes
        this.clearShapes();
        
        // Create some ambient floating shapes
        for (let i = 0; i < 8; i++) {
            const shape = this.createRandomShape();
            shape.position.set(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            );
            this.artShapes.push(shape);
            this.scene.add(shape);
        }
    }
    
    createRandomShape() {
        const geometryType = this.geometryTypes[Math.floor(Math.random() * this.geometryTypes.length)];
        const geometry = this.createGeometry(geometryType);
        const material = this.createMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.userData = {
            type: 'floating',
            originalY: mesh.position.y,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            floatSpeed: Math.random() * 0.01 + 0.005
        };
        
        return mesh;
    }
    
    createGeometry(type) {
        const size = Math.random() * 10 + 5;
        switch(type) {
            case 'box': return new THREE.BoxGeometry(size, size, size);
            case 'sphere': return new THREE.SphereGeometry(size, 16, 16);
            case 'cone': return new THREE.ConeGeometry(size, size * 2, 16);
            case 'torus': return new THREE.TorusGeometry(size, size * 0.3, 8, 16);
            case 'octahedron': return new THREE.OctahedronGeometry(size);
            case 'tetrahedron': return new THREE.TetrahedronGeometry(size);
            case 'cylinder': return new THREE.CylinderGeometry(size, size, size * 2, 16);
            case 'plane': return new THREE.PlaneGeometry(size * 2, size * 2);
            case 'ring': return new THREE.RingGeometry(size * 0.5, size, 16);
            case 'dodecahedron': return new THREE.DodecahedronGeometry(size);
            default: return new THREE.BoxGeometry(size, size, size);
        }
    }
    
    createMaterial() {
        const hue = (this.colorScheme * 0.2 + Math.random() * 0.8) % 1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        
        return new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            wireframe: Math.random() > 0.6,
            emissive: color,
            emissiveIntensity: 0.1
        });
    }
    
    generateArtFromText(text) {
        this.clearShapes();
        this.currentText = text.toLowerCase();
        
        if (!text.trim()) {
            this.createFloatingShapes();
            return;
        }
        
        const characters = text.split('');
        const gridSize = Math.ceil(Math.sqrt(characters.length));
        const spacing = 15;
        
        characters.forEach((char, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            
            const x = (col - gridSize / 2) * spacing;
            const z = (row - gridSize / 2) * spacing;
            const y = Math.sin(index * 0.5) * 5;
            
            const shape = this.createShapeFromCharacter(char, index);
            shape.position.set(x, y, z);
            
            this.artShapes.push(shape);
            this.scene.add(shape);
        });
    }
    
    createShapeFromCharacter(char, index) {
        const charCode = char.charCodeAt(0);
        const geometryType = this.geometryTypes[charCode % this.geometryTypes.length];
        const geometry = this.createGeometry(geometryType);
        
        // Scale based on character
        const scale = 0.5 + (charCode % 10) / 20;
        geometry.scale(scale, scale, scale);
        
        const material = this.createMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        
        // Add character-specific properties
        mesh.userData = {
            type: 'text',
            character: char,
            charCode: charCode,
            rotationSpeed: (charCode % 3 + 1) * 0.005,
            floatSpeed: (charCode % 5 + 1) * 0.002,
            originalY: mesh.position.y,
            pulsePhase: index * 0.5
        };
        
        return mesh;
    }
    
    clearShapes() {
        this.artShapes.forEach(shape => this.scene.remove(shape));
        this.artShapes = [];
    }
    
    update() {
        if (this.isRotationActive && this.artShapes) {
            this.artShapes.forEach((shape, index) => {
                const userData = shape.userData;
                
                // Rotation
                shape.rotation.x += userData.rotationSpeed;
                shape.rotation.y += userData.rotationSpeed * 0.7;
                shape.rotation.z += userData.rotationSpeed * 0.3;
                
                // Floating animation
                shape.position.y = userData.originalY + Math.sin(Date.now() * userData.floatSpeed + index) * 3;
                
                // Pulsing effect for text shapes
                if (userData.type === 'text') {
                    const pulse = 1 + Math.sin(Date.now() * 0.001 + userData.pulsePhase) * 0.2;
                    shape.scale.setScalar(pulse);
                }
                
                // Color cycling
                if (Math.random() < 0.01) { // 1% chance per frame
                    const material = shape.material;
                    if (material.color) {
                        const hue = (material.color.getHSL({}).h + 0.01) % 1;
                        material.color.setHSL(hue, 0.8, 0.6);
                    }
                }
            });
        }
    }
    
    changeGeometry() {
        // Cycle through color schemes
        this.colorScheme = (this.colorScheme + 1) % 5;
        this.regenerateArt();
    }
    
    toggleRotation() {
        this.isRotationActive = !this.isRotationActive;
        console.log('Geometry Rotation:', this.isRotationActive ? 'Active' : 'Inactive');
    }
    
    regenerateArt() {
        if (this.currentText) {
            this.generateArtFromText(this.currentText);
        } else {
            this.createFloatingShapes();
        }
    }
    
    setAnimationSpeed(speed) {
        this.animationSpeed = speed;
        this.artShapes.forEach(shape => {
            if (shape.userData.rotationSpeed) {
                shape.userData.rotationSpeed = (Math.random() - 0.5) * speed;
            }
        });
    }
    
    // Method for modal integration
    startInModal(canvas) {
        // This demo works in the main Three.js scene, not a separate canvas
        console.log('Geometric Art Generator ready in main scene');
    }
    
    resize(canvas) {
        // This demo doesn't use a separate canvas
    }
    
    destroy() {
        this.clearShapes();
    }
}

// Export for use in main script
window.GeometryDemo = GeometryDemo;