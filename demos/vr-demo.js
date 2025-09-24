// VR Demo
class VRDemo {
    constructor(scene) {
        this.scene = scene;
        this.vrSession = null;
        this.vrScene = null;
        this.vrCamera = null;
    }
    
    async launch() {
        if (!navigator.xr) {
            alert('WebXR not supported in this browser. Please use a compatible browser like Chrome with WebXR enabled.');
            return;
        }
        
        const vrButton = document.createElement('button');
        vrButton.textContent = 'Enter VR';
        vrButton.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #EF7B10, #1084EF);
            color: white;
            border: none;
            padding: 20px 40px;
            border-radius: 25px;
            font-family: 'Orbitron', monospace;
            font-size: 18px;
            cursor: pointer;
            z-index: 10000;
        `;
        
        vrButton.onclick = async () => {
            try {
                this.vrSession = await navigator.xr.requestSession('immersive-vr');
                vrButton.remove();
                this.startVRExperience();
            } catch (error) {
                console.error('VR session failed:', error);
                alert('Failed to start VR session. Make sure you have a VR headset connected.');
            }
        };
        
        document.body.appendChild(vrButton);
    }
    
    startVRExperience() {
        // Create VR-specific scene
        this.vrScene = new THREE.Scene();
        this.vrCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Add VR content
        const vrGeometry = new THREE.SphereGeometry(5, 32, 32);
        const vrMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xEF7B10,
            emissive: 0xEF7B10,
            emissiveIntensity: 0.2
        });
        const vrSphere = new THREE.Mesh(vrGeometry, vrMaterial);
        this.vrScene.add(vrSphere);
        
        // Add floating objects
        for (let i = 0; i < 20; i++) {
            const objGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const objMaterial = new THREE.MeshPhongMaterial({ 
                color: new THREE.Color().setHSL(i / 20, 0.8, 0.6) 
            });
            const obj = new THREE.Mesh(objGeometry, objMaterial);
            obj.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            this.vrScene.add(obj);
        }
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.vrScene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xEF7B10, 1);
        directionalLight.position.set(50, 50, 50);
        this.vrScene.add(directionalLight);
        
        // Animate VR scene
        this.animateVR();
    }
    
    animateVR() {
        if (this.vrSession && this.vrScene) {
            // Find the sphere and animate it
            const sphere = this.vrScene.children.find(child => child.geometry instanceof THREE.SphereGeometry);
            if (sphere) {
                sphere.rotation.x += 0.01;
                sphere.rotation.y += 0.01;
            }
            
            // Animate floating objects
            this.vrScene.children.forEach((child, index) => {
                if (child.geometry instanceof THREE.BoxGeometry) {
                    child.rotation.x += 0.005 * (index + 1);
                    child.rotation.y += 0.003 * (index + 1);
                    child.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
                }
            });
            
            requestAnimationFrame(() => this.animateVR());
        }
    }
    
    destroy() {
        if (this.vrSession) {
            this.vrSession.end();
        }
        this.vrSession = null;
        this.vrScene = null;
        this.vrCamera = null;
    }
}

// Export for use in main script
window.VRDemo = VRDemo;
