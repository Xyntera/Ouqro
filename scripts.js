document.addEventListener('DOMContentLoaded', () => {
    // Initialize page loader
    const pageLoader = document.querySelector('.page-loader');
    
    // Initialize GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Animation for page loader
    const loaderAnimation = lottie.loadAnimation({
        container: document.getElementById('loader-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets1.lottiefiles.com/packages/lf20_zbowu6wz.json' // Tech loading animation
    });
    
    // Hide loader after animations are loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            gsap.to(pageLoader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    pageLoader.style.display = 'none';
                    initAnimations();
                }
            });
        }, 1000);
    });
    
    // Initialize all animations after page load
    function initAnimations() {
        initLogoAnimation();
        initHeroAnimation();
        initVenturesAnimation();
        initAboutAnimation();
        initMagneticButtons();
        initParticles();
        initThreeJS();
        initMobileMenu();
        setupIdeatorFunctionality();
    }
    
    // Logo Animation
    function initLogoAnimation() {
        const logoAnimation = lottie.loadAnimation({
            container: document.getElementById('logo-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets2.lottiefiles.com/packages/lf20_wguj3xkz.json' // Abstract tech logo
        });
        
        const footerLogoAnimation = lottie.loadAnimation({
            container: document.getElementById('footer-logo-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets2.lottiefiles.com/packages/lf20_wguj3xkz.json' // Same logo for footer
        });
        
        // Logo text animation
        gsap.from('.logo-text', {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out'
        });
    }
    
    // Hero Section Animation
    function initHeroAnimation() {
        const heroTimeline = gsap.timeline();
        
        heroTimeline
            .from('.hero-title', {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            })
            .from('.hero-subtitle', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.hero-text', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6')
            .from('.hero-btn-primary, .hero-btn-secondary', {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.6');
            
        // Navbar items animation
        gsap.from('.nav-item', {
            opacity: 0,
            y: -20,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out'
        });
    }
    
    // Ventures Section Animation
    function initVenturesAnimation() {
        // Animation for the section title
        gsap.from('.section-title', {
            scrollTrigger: {
                trigger: '.section-title',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Staggered animation for venture cards
        gsap.from('.stagger-item', {
            scrollTrigger: {
                trigger: '.ventures-grid',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Load venture icon animations
        const aiAnimation = lottie.loadAnimation({
            container: document.getElementById('ai-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_ikvz7qhc.json' // AI animation
        });
        
        const web3Animation = lottie.loadAnimation({
            container: document.getElementById('web3-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_m9zragkd.json' // Blockchain animation
        });
        
        const infraAnimation = lottie.loadAnimation({
            container: document.getElementById('infra-animation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets5.lottiefiles.com/packages/lf20_y2hxPM.json' // Network animation
        });
    }
    
    // About Section Animation
    function initAboutAnimation() {
        // Animation for the About section text
        gsap.from('.about-text .section-title, .about-text .section-text', {
            scrollTrigger: {
                trigger: '.about-text',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        // Staggered animation for value cards
        gsap.from('.values-grid .stagger-item', {
            scrollTrigger: {
                trigger: '.values-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power3.out'
        });
        
        // AI Brain animation for Ideator section
        const aiBrainAnimation = lottie.loadAnimation({
            container: document.getElementById('ai-brain-container'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets2.lottiefiles.com/packages/lf20_twnj9fob.json' // AI brain animation
        });
    }
    
    // Magnetic Button Effect
    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic-button');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(button, {
                    x: x * 0.2,
                    y: y * 0.2,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }
    
    // Particles.js for Background
    function initParticles() {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#3B82F6'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    },
                    polygon: {
                        nb_sides: 5
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#3B82F6',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
    
    // Three.js for 3D Graphics
    function initThreeJS() {
        // Hero section 3D background
        initHeroThree();
        
        // About section 3D visualization
        initAboutThree();
    }
    
    // Hero Section Three.js Background
    function initHeroThree() {
        const canvas = document.getElementById('hero-canvas');
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        canvas.appendChild(renderer.domElement);
        
        // Create geometry
        const geometry = new THREE.IcosahedronGeometry(2, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x3B82F6,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            mesh.rotation.x += 0.003;
            mesh.rotation.y += 0.005;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    // About Section Three.js Visualization
    function initAboutThree() {
        const container = document.getElementById('tech-visual');
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 3;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Create a globe
        const globeGeometry = new THREE.SphereGeometry(1, 32, 32);
        const globeMaterial = new THREE.MeshBasicMaterial({
            color: 0x3B82F6,
            wireframe: true,
            transparent: true,
            opacity: 0.7
        });
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);
        
        // Add dots on globe surface
        const dotsGroup = new THREE.Group();
        scene.add(dotsGroup);
        
        for (let i = 0; i < 100; i++) {
            const dotGeometry = new THREE.SphereGeometry(0.02, 16, 16);
            const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x8B5CF6 });
            const dot = new THREE.Mesh(dotGeometry, dotMaterial);
            
            // Random position on sphere
            const phi = Math.acos(-1 + (2 * Math.random()));
            const theta = 2 * Math.PI * Math.random();
            
            dot.position.x = 1 * Math.sin(phi) * Math.cos(theta);
            dot.position.y = 1 * Math.sin(phi) * Math.sin(theta);
            dot.position.z = 1 * Math.cos(phi);
            
            dotsGroup.add(dot);
        }
        
        // Add connections between some dots
        const linesGroup = new THREE.Group();
        scene.add(linesGroup);
        
        for (let i = 0; i < 30; i++) {
            const index1 = Math.floor(Math.random() * dotsGroup.children.length);
            const index2 = Math.floor(Math.random() * dotsGroup.children.length);
            
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                dotsGroup.children[index1].position,
                dotsGroup.children[index2].position
            ]);
            
            const lineMaterial = new THREE.LineBasicMaterial({ 
                color: 0x3B82F6,
                transparent: true,
                opacity: 0.3
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            linesGroup.add(line);
        }
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            globe.rotation.y += 0.003;
            dotsGroup.rotation.y += 0.003;
            linesGroup.rotation.y += 0.003;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        // Activate on scroll
        ScrollTrigger.create({
            trigger: '#about',
            start: 'top center',
            onEnter: () => {
                gsap.to(globe.scale, {
                    x: 1.2,
                    y: 1.2,
                    z: 1.2,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)'
                });
            },
            onLeaveBack: () => {
                gsap.to(globe.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.5
                });
            }
        });
    }
    
    // Mobile Menu Functionality
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            if (!mobileMenu.classList.contains('hidden')) {
                gsap.from('#mobile-menu a', {
                    opacity: 0,
                    y: 20,
                    stagger: 0.1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // AI Ideator Functionality
    function setupIdeatorFunctionality() {
        const ideaInput = document.getElementById('ideaInput');
        const generateBtn = document.getElementById('generateBtn');
        const outputArea = document.getElementById('outputArea');
        const outputContainer = document.getElementById('outputContainer');

        generateBtn.addEventListener('click', async () => {
            const idea = ideaInput.value.trim();
            if (!idea) {
                outputArea.innerHTML = `<p class="text-gray-600">Please enter a business idea to get started!</p>`;
                outputContainer.classList.remove('hidden');
                return;
            }

            // Show loading animation with Lottie
            outputContainer.classList.remove('hidden');
            outputArea.innerHTML = `<div class="flex flex-col items-center justify-center">
                                        <div id="generating-animation" class="w-24 h-24"></div>
                                        <p class="mt-4 text-sm text-gray-600">Generating blueprint...</p>
                                    </div>`;
                                    
            // Add loading animation
            const generatingAnimation = lottie.loadAnimation({
                container: document.getElementById('generating-animation'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: 'https://assets6.lottiefiles.com/packages/lf20_kuhijlvx.json' // Processing animation
            });

            const prompt = `Act as a business consultant and generate a high-level venture blueprint for a multi-venture tech company. The blueprint should be based on the following business idea: "${idea}".

The output should be a single, detailed response formatted in Markdown, with the following sections:
1.  **Venture Name & Tagline:** A creative, professional name and a concise, impactful tagline.
2.  **Market Opportunity:** A brief analysis of the target market and the problem the venture solves.
3.  **Core Technology:** A description of how AI, Web3, or digital infrastructure (or a combination) would be used. Be specific.
4.  **Monetization Strategy:** A clear plan for how the venture will generate revenue.`;

            let chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = "AIzaSyDaZpvE6yQnczQoaoAn4BF3MKMWZ6lG54I" 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();
                
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    
                    // Simulate a loading delay for effect
                    setTimeout(() => {
                        // Remove loading animation
                        generatingAnimation.destroy();
                        
                        // Show result with fade-in animation
                        outputArea.innerHTML = `<pre class="whitespace-pre-wrap text-gray-800 opacity-0">${text}</pre>`;
                        
                        // Animate the result appearing
                        gsap.to(outputArea.querySelector('pre'), {
                            opacity: 1,
                            duration: 0.8,
                            ease: 'power2.out'
                        });
                    }, 1500);
                } else {
                    outputArea.innerHTML = `<p class="text-red-400">Error: Could not retrieve a valid response. Please try again.</p>`;
                }
            } catch (error) {
                console.error('API call failed:', error);
                outputArea.innerHTML = `<p class="text-red-400">Error: Something went wrong. Check the console for details.</p>`;
            }
        });
        
        // Focus animation for the textarea
        ideaInput.addEventListener('focus', () => {
            gsap.to(ideaInput, {
                borderColor: '#3B82F6',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
                duration: 0.3
            });
        });
        
        ideaInput.addEventListener('blur', () => {
            gsap.to(ideaInput, {
                borderColor: '#E5E7EB',
                boxShadow: 'none',
                duration: 0.3
            });
        });
        
        // Button animation
        generateBtn.addEventListener('mouseenter', () => {
            gsap.to(generateBtn, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        generateBtn.addEventListener('mouseleave', () => {
            gsap.to(generateBtn, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
});
