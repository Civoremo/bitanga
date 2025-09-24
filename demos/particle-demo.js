// Particle System Demo
class ParticleDemo {
    constructor(scene) {
        this.scene = scene;
        this.particleSystem = null;
        this.isActive = true;
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.init();
    }
    
    init() {
        this.createParticleSystem();
        this.setupMouseInteraction();
    }
    
    createParticleSystem() {
        const particleCount = 3000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Position
            positions[i3] = (Math.random() - 0.5) * 300;
            positions[i3 + 1] = (Math.random() - 0.5) * 300;
            positions[i3 + 2] = (Math.random() - 0.5) * 300;
            
            // Velocity
            velocities[i3] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
            
            // Color (orange to blue gradient)
            const color = new THREE.Color();
            color.setHSL(0.1 + Math.random() * 0.6, 0.8, 0.6);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Size
            sizes[i] = Math.random() * 3 + 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.particleSystem.userData = {
            positions: positions,
            velocities: velocities,
            sizes: sizes,
            mouseInfluence: 0.1,
            attractionForce: 0.02,
            repulsionForce: 0.05
        };
        this.scene.add(this.particleSystem);
    }
    
    setupMouseInteraction() {
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX - this.windowHalfX) * 0.1;
            this.mouseY = (event.clientY - this.windowHalfY) * 0.1;
        });
        
        window.addEventListener('resize', () => {
            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;
        });
    }
    
    update() {
        if (!this.isActive || !this.particleSystem) return;
        
        const positions = this.particleSystem.userData.positions;
        const velocities = this.particleSystem.userData.velocities;
        const sizes = this.particleSystem.userData.sizes;
        const mouseInfluence = this.particleSystem.userData.mouseInfluence;
        
        // Convert mouse position to 3D world coordinates
        const mouse3D = new THREE.Vector3(
            (this.mouseX / this.windowHalfX) * 100,
            (-this.mouseY / this.windowHalfY) * 100,
            0
        );
        
        for (let i = 0; i < positions.length; i += 3) {
            const particleIndex = i / 3;
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            // Calculate distance to mouse
            const dx = mouse3D.x - x;
            const dy = mouse3D.y - y;
            const dz = mouse3D.z - z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // Mouse interaction (attraction/repulsion)
            if (distance < 50) {
                const force = (50 - distance) / 50;
                const attraction = this.particleSystem.userData.attractionForce;
                const repulsion = this.particleSystem.userData.repulsionForce;
                
                // Alternate between attraction and repulsion
                const isAttraction = Math.sin(Date.now() * 0.001) > 0;
                const finalForce = isAttraction ? attraction : -repulsion;
                
                velocities[i] += (dx / distance) * force * finalForce * mouseInfluence;
                velocities[i + 1] += (dy / distance) * force * finalForce * mouseInfluence;
                velocities[i + 2] += (dz / distance) * force * finalForce * mouseInfluence;
            }
            
            // Apply velocity
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
            
            // Add some damping
            velocities[i] *= 0.99;
            velocities[i + 1] *= 0.99;
            velocities[i + 2] *= 0.99;
            
            // Boundary conditions (wrap around)
            if (positions[i] > 150) positions[i] = -150;
            if (positions[i] < -150) positions[i] = 150;
            if (positions[i + 1] > 150) positions[i + 1] = -150;
            if (positions[i + 1] < -150) positions[i + 1] = 150;
            if (positions[i + 2] > 150) positions[i + 2] = -150;
            if (positions[i + 2] < -150) positions[i + 2] = 150;
            
            // Dynamic size based on velocity
            const speed = Math.sqrt(velocities[i] * velocities[i] + velocities[i + 1] * velocities[i + 1] + velocities[i + 2] * velocities[i + 2]);
            sizes[particleIndex] = Math.min(5, Math.max(1, speed * 10 + 1));
        }
        
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.size.needsUpdate = true;
    }
    
    toggle() {
        this.isActive = !this.isActive;
        console.log('Particles:', this.isActive ? 'Active' : 'Inactive');
    }
    
    reset() {
        if (this.particleSystem) {
            const positions = this.particleSystem.userData.positions;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] = (Math.random() - 0.5) * 300;
                positions[i + 1] = (Math.random() - 0.5) * 300;
                positions[i + 2] = (Math.random() - 0.5) * 300;
            }
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    }
    
    destroy() {
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
        }
    }
}

// Export for use in main script
window.ParticleDemo = ParticleDemo;
