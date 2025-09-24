// Main Script - Bitanga Studio Interactive Showcase
// Global variables
let scene, camera, renderer;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Demo instances
let particleDemo, gameDemo, audioDemo, aiDemo, creativeDemo, vrDemo, geometryDemo;
let modalSystem;

// Three.js Scene Setup
function initThreeJS() {
    const container = document.getElementById('three-container');
    
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 100;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Initialize demos
    initDemos();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xEF7B10, 1);
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);
    
    // Mouse interaction
    document.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation loop
    animate();
}

// Initialize all demos
function initDemos() {
    console.log('Initializing demos...');
    particleDemo = new ParticleDemo(scene);
    gameDemo = new GameDemo(scene);
    audioDemo = new AudioDemo();
    aiDemo = new AIDemo();
    creativeDemo = new CreativeDemo();
    vrDemo = new VRDemo(scene);
    geometryDemo = new GeometryDemo(scene);
    modalSystem = new ModalSystem();
    
    // Store demos globally for modal access
    window.gameDemo = gameDemo;
    window.audioDemo = audioDemo;
    window.aiDemo = aiDemo;
    window.creativeDemo = creativeDemo;
    window.vrDemo = vrDemo;
    window.geometryDemo = geometryDemo;
    
    console.log('All demos initialized, geometryDemo available:', !!window.geometryDemo);
}

// Mouse interaction
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.1;
    mouseY = (event.clientY - windowHalfY) * 0.1;
}

// Window resize
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate camera based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Update demos
    if (particleDemo) particleDemo.update();
    if (gameDemo) gameDemo.update();
    if (geometryDemo) geometryDemo.update();
    
    renderer.render(scene, camera);
}

// Demo Functions - Connected to HTML buttons
function toggleParticles() {
    if (particleDemo) particleDemo.toggle();
}

function resetParticles() {
    if (particleDemo) particleDemo.reset();
}

function changeGeometry() {
    if (geometryDemo) geometryDemo.changeGeometry();
}

function toggleRotation() {
    if (geometryDemo) geometryDemo.toggleRotation();
}

function trainNetwork() {
    if (aiDemo) aiDemo.train();
}

function resetNetwork() {
    if (aiDemo) aiDemo.reset();
}

function startAudio() {
    if (audioDemo) audioDemo.start();
}

function changeVisualizer() {
    if (audioDemo) audioDemo.changeVisualizer();
}

function toggleAudio() {
    if (audioDemo) audioDemo.toggle();
}

// Demo launchers
function launchDemo(demoType) {
    console.log('Launching demo:', demoType);
    
    if (!modalSystem) {
        console.error('Modal system not initialized');
        return;
    }
    
    switch(demoType) {
        case 'game':
            modalSystem.openGameModal();
            break;
        case 'vr':
            modalSystem.openVRModal();
            break;
        case 'ai':
            modalSystem.openAIModal();
            break;
        case 'creative':
            modalSystem.openCreativeModal();
            break;
        case 'geometry':
            modalSystem.openGeometryModal();
            break;
        default:
            console.log('Unknown demo type:', demoType);
    }
}

// Navigation functions
function scrollToShowcase() {
    document.getElementById('showcase').scrollIntoView({ behavior: 'smooth' });
}

function startInteractiveMode() {
    console.log('Starting interactive mode...');
    // Add some visual feedback
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
        document.body.style.filter = 'none';
    }, 1000);
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #EF7B10, #1084EF);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize demo canvases for showcase section
function initializeDemoCanvases() {
    // Particle system canvas
    const particleCanvas = document.getElementById('particle-canvas');
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        particleCanvas.width = particleCanvas.offsetWidth;
        particleCanvas.height = particleCanvas.offsetHeight;
        
        function drawParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            const time = Date.now() * 0.001;
            const centerX = particleCanvas.width / 2;
            const centerY = particleCanvas.height / 2;
            
            for (let i = 0; i < 50; i++) {
                const angle = (i / 50) * Math.PI * 2 + time;
                const radius = 30 + Math.sin(time + i) * 20;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(239, 123, 16, ${0.8 - i * 0.01})`;
                ctx.fill();
            }
            
            requestAnimationFrame(drawParticles);
        }
        
        drawParticles();
    }
    
    // Geometry canvas
    const geometryCanvas = document.getElementById('geometry-canvas');
    if (geometryCanvas) {
        const ctx = geometryCanvas.getContext('2d');
        geometryCanvas.width = geometryCanvas.offsetWidth;
        geometryCanvas.height = geometryCanvas.offsetHeight;
        
        function drawGeometry() {
            ctx.clearRect(0, 0, geometryCanvas.width, geometryCanvas.height);
            
            const time = Date.now() * 0.001;
            const centerX = geometryCanvas.width / 2;
            const centerY = geometryCanvas.height / 2;
            
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(time * 0.5);
            
            // Draw rotating geometric shapes
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(0, -20);
                ctx.lineTo(17, 10);
                ctx.lineTo(-17, 10);
                ctx.closePath();
                ctx.strokeStyle = `rgba(16, 132, 239, ${0.8 - i * 0.2})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.rotate(Math.PI / 3);
            }
            
            ctx.restore();
            requestAnimationFrame(drawGeometry);
        }
        
        drawGeometry();
    }
    
    // Neural network canvas
    const neuralCanvas = document.getElementById('neural-canvas');
    if (neuralCanvas) {
        const ctx = neuralCanvas.getContext('2d');
        neuralCanvas.width = neuralCanvas.offsetWidth;
        neuralCanvas.height = neuralCanvas.offsetHeight;
        
        function drawNeuralNetwork() {
            ctx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);
            
            const time = Date.now() * 0.001;
            const centerX = neuralCanvas.width / 2;
            const centerY = neuralCanvas.height / 2;
            
            // Draw neural network nodes
            const nodes = [
                { x: centerX - 40, y: centerY - 20 },
                { x: centerX, y: centerY - 20 },
                { x: centerX + 40, y: centerY - 20 },
                { x: centerX - 20, y: centerY + 20 },
                { x: centerX + 20, y: centerY + 20 }
            ];
            
            // Draw connections
            ctx.strokeStyle = `rgba(239, 123, 16, ${0.3 + Math.sin(time) * 0.2})`;
            ctx.lineWidth = 1;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
            
            // Draw nodes
            nodes.forEach((node, index) => {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(239, 123, 16, ${0.8 + Math.sin(time + index) * 0.2})`;
                ctx.fill();
            });
            
            requestAnimationFrame(drawNeuralNetwork);
        }
        
        drawNeuralNetwork();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js
    initThreeJS();
    
    // Create scroll progress
    createScrollProgress();
    
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize demos
    initDemos();
    
    // Initialize demo canvases
    initializeDemoCanvases();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (particleDemo) particleDemo.destroy();
    if (gameDemo) gameDemo.destroy();
    if (audioDemo) audioDemo.destroy();
    if (aiDemo) aiDemo.destroy();
    if (creativeDemo) creativeDemo.destroy();
    if (vrDemo) vrDemo.destroy();
    if (geometryDemo) geometryDemo.destroy();
});