// --- 1. Scene Setup ---
const canvas = document.getElementById('heroCanvas');
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true // Important: allows the 2D HTML content to show through the canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);


// --- 2. Create 3D Objects (The Environment and Foreground) ---

// A. Background Grid (Simulating the comic book pattern)
const gridHelper = new THREE.GridHelper(20, 20, 0xffa600, 0xffa600);
gridHelper.position.y = -1; // Push down slightly
gridHelper.material.opacity = 0.3;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// B. Floating Yellow Comic Dots (for depth)
const geometry = new THREE.SphereGeometry(0.1, 16, 16);
const material = new THREE.MeshStandardMaterial({ color: 0xf5a623, emissive: 0xf5a623 });

const dots = [];
for (let i = 0; i < 50; i++) {
    const dot = new THREE.Mesh(geometry, material);
    dot.position.x = (Math.random() - 0.5) * 20;
    dot.position.y = (Math.random() - 0.5) * 20;
    dot.position.z = Math.random() * -10; // Place dots behind the main content area
    dots.push(dot);
    scene.add(dot);
}

// C. Rotating Logo/Shield Object (for foreground focus)
const logoGeometry = new THREE.DodecahedronGeometry(1, 0); // A complex shape for a "shield"
const logoMaterial = new THREE.MeshStandardMaterial({ color: 0x8b1016, metalness: 0.8, roughness: 0.3 });
const logo = new THREE.Mesh(logoGeometry, logoMaterial);
logo.position.set(3, 1, 0);
scene.add(logo);

// D. Superhero Lady Image Plane
const textureLoader = new THREE.TextureLoader();
const superheroTexture = textureLoader.load('wind.jpg'); // Loads the image file
superheroTexture.center.set(0.5, 0.5); // Set the center of rotation/scale for the texture

// Calculate dimensions to maintain image aspect ratio
const imageRatio = superheroTexture.image.width / superheroTexture.image.height;
const planeHeight = 4.5; // Visual size adjustment
const planeWidth = planeHeight * imageRatio;

const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const planeMaterial = new THREE.MeshBasicMaterial({ 
    map: superheroTexture, 
    transparent: true,
    side: THREE.DoubleSide // Ensures the image is visible from both sides if needed
});

const superheroPlane = new THREE.Mesh(planeGeometry, planeMaterial);
// Position the superhero plane to the left in the foreground
superheroPlane.position.set(-3, 0, 0); 
superheroPlane.rotation.y = 0.2; // Initial slight rotation for 3D depth

scene.add(superheroPlane);


// --- 3. Cursor Tracking for Interactive Movement ---

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
    // Normalize mouse coordinates to a range of -1 to 1
    mouseX = (event.clientX / sizes.width) * 2 - 1;
    mouseY = -(event.clientY / sizes.height) * 2 + 1;
});


// --- 4. Animation Loop (The Magic) ---

const tick = () => {
    // Calculate the target camera rotation based on mouse
    const targetCameraX = mouseX * 0.5; // Slight horizontal tilt
    const targetCameraY = mouseY * 0.5; // Slight vertical tilt
    
    // Smoothly apply the camera rotation (Interactive 3D Tilt)
    camera.rotation.y += (targetCameraX - camera.rotation.y) * 0.05;
    camera.rotation.x += (targetCameraY - camera.rotation.x) * 0.05;
    
    // Animate the 3D objects continuously
    logo.rotation.x += 0.005;
    logo.rotation.y += 0.007;

    // Animate the Superhero Plane based on cursor movement
    superheroPlane.rotation.x = camera.rotation.x * 0.5;
    superheroPlane.rotation.y = camera.rotation.y * 0.5 + 0.2; // 0.2 is the base rotation

    // NEW: Make the background grid react subtly to cursor movement
    gridHelper.rotation.y = -mouseX * 0.05; // Rotate grid slightly around Y-axis
    gridHelper.rotation.x = -mouseY * 0.05; // Rotate grid slightly around X-axis

    // NEW: Make the floating dots react subtly to cursor movement
    dots.forEach(dot => {
        // Make dots slowly drift
        dot.position.y -= 0.001;
        if (dot.position.y < -10) {
            dot.position.y = 10;
        }

        // Add subtle horizontal/vertical shift based on mouse
        dot.position.x += mouseX * 0.0005; 
        dot.position.y += mouseY * 0.0005;
        // Optionally, reset dots if they drift too far out due to mouse movement
        if (dot.position.x > 10 || dot.position.x < -10) dot.position.x = (Math.random() - 0.5) * 20;
        if (dot.position.y > 10 || dot.position.y < -10) dot.position.y = (Math.random() - 0.5) * 20;
    });

    // Render the scene
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

// Start the animation loop
tick();


// --- 5. Responsiveness Handler ---
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});