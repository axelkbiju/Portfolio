// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);


// Initial Fade-in Sequence
const tlLoader = gsap.timeline();

tlLoader.to("#loader", {
    opacity: 0,
    duration: 2,
    ease: "power2.inOut",
    onComplete: () => {
        const loader = document.getElementById("loader");
        if (loader) loader.style.display = "none";
    }
})
// Trigger hero animations after loader
.call(initHeroAnimations);

// Cinematic Dolly Zoom: Plays on load, reverses on scroll up
const heroDolly = gsap.to(".hero-bg", {
    scale: 1.15,
    duration: 15,
    ease: "sine.out",
    paused: false
});

let lastScrollTopDolly = 0;
window.addEventListener("scroll", () => {
    let st = window.pageYOffset || document.documentElement.scrollTop;
    if (st < lastScrollTopDolly) {
        // Scrolling UP -> Dolly backwards smoothly
        gsap.to(heroDolly, { timeScale: -1.2, duration: 1.5, ease: "power2.out" });
    } else if (st > lastScrollTopDolly) {
        // Scrolling DOWN -> Dolly forward smoothly
        gsap.to(heroDolly, { timeScale: 1, duration: 1.5, ease: "power2.out" });
    }
    lastScrollTopDolly = st <= 0 ? 0 : st;
}, { passive: true });

function initHeroAnimations() {
    const tlHero = gsap.timeline();
    
    tlHero.to(".hero-title .block-reveal", {
        y: 0,
        duration: 1.8,
        stagger: 0.2,
        ease: "expo.out"
    })
    .to(".hero-subtitle .block-reveal", {
        y: 0,
        duration: 1.8,
        stagger: 0.15,
        ease: "expo.out"
    }, "-=1.5")
    .to(".hero-small-text", {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
    }, "-=1.2")
    .to(".scroll-indicator", {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
    }, "-=1");

    // Scroll Indicator Animation
    gsap.to(".scroll-line-anim", {
        yPercent: 100,
        duration: 1.5,
        repeat: -1,
        ease: "power2.inOut"
    });
}

// Parallax Hero Video
gsap.to(".hero-bg", {
    yPercent: 20,
    ease: "none",
    scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "bottom top",
        scrub: true
    }
});

// About Section Animations
const tlAbout = gsap.timeline({
    scrollTrigger: {
        trigger: "#about",
        start: "top 70%",
    }
});

tlAbout.to(".about-img", {
    filter: "grayscale(0%)",
    scale: 1,
    duration: 1.5,
    ease: "power2.out"
})
.to(".about-text .text-reveal", {
    y: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
}, "-=1")
.to(".line-reveal", {
    width: "48px",
    duration: 0.8,
    ease: "power2.out"
}, "-=0.5")
.to(".fade-in-up", {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
}, "-=0.5");

// Initial state for fade-in-up elements
gsap.set(".fade-in-up", { y: 30, opacity: 0 });
gsap.set(".line-reveal", { width: 0 });

// Showreel Section Video Autoplay (Smooth Scrubbing)
const showreelVideo = document.getElementById("showreel-video");
if (showreelVideo) {
    // Ensure video starts silent for the fade-in effect
    showreelVideo.volume = 0;
    
    // Create a timeline bound to the scroll position of the showreel section
    const showreelTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#showreel",
            start: "top 75%", // Start fading in when top of section hits 75% of viewport
            end: "bottom 25%", // Finish fading out when bottom hits 25%
            scrub: 1, // Adds a 1-second smoothing effect (eliminates lag/jitter)
            onEnter: () => showreelVideo.play().catch(e => console.log(e)),
            onEnterBack: () => showreelVideo.play().catch(e => console.log(e)),
            onLeave: () => showreelVideo.pause(),
            onLeaveBack: () => showreelVideo.pause()
        }
    });

    // 1. Fade IN (opacity 0 -> 1, volume 0 -> 1)
    showreelTl.to(showreelVideo, { opacity: 1, volume: 1, duration: 1, ease: "none" })
    // 2. HOLD (stay fully visible and loud while scrolling through the middle)
              .to(showreelVideo, { opacity: 1, volume: 1, duration: 4, ease: "none" })
    // 3. Fade OUT (opacity 1 -> 0, volume 1 -> 0)
              .to(showreelVideo, { opacity: 0, volume: 0, duration: 1, ease: "none" });
}

// Showreel Interactive Play/Pause Button
const srContainer = document.querySelector('.showreel-container');
const srVideo = document.getElementById('showreel-video');
const srBtn = document.getElementById('showreel-btn');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');

if (srContainer && srVideo && srBtn) {
    let srIdleTimer;

    const updateBtnVisibility = () => {
        if (srVideo.paused) {
            srBtn.style.opacity = '1';
            iconPlay.style.opacity = '1';
            iconPause.style.opacity = '0';
            
            clearTimeout(srIdleTimer);
            srIdleTimer = setTimeout(() => {
                srBtn.style.opacity = '0';
            }, 4000);
        } else {
            srBtn.style.opacity = '0';
            iconPlay.style.opacity = '0';
            iconPause.style.opacity = '1';
        }
    };

    srContainer.addEventListener('mousemove', () => {
        if (srVideo.paused) {
            updateBtnVisibility();
        }
    });

    srContainer.addEventListener('click', () => {
        if (srVideo.paused) {
            srVideo.play();
        } else {
            srVideo.pause();
        }
        updateBtnVisibility();
    });

    srVideo.addEventListener('play', updateBtnVisibility);
    srVideo.addEventListener('pause', updateBtnVisibility);
}

// Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        const position = btn.getBoundingClientRect();
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;
        
        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.5,
            duration: 0.2,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', function() {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
});

// Projects Cards Reveal
const projects = document.querySelectorAll('.project-card');

projects.forEach((project, i) => {
    gsap.from(project, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: project,
            start: "top 80%",
        }
    });
});

// Skills Progress Bars
const skillBars = document.querySelectorAll('.skill-progress');

skillBars.forEach(bar => {
    const targetWidth = bar.getAttribute('data-width');
    gsap.to(bar, {
        width: targetWidth,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#skills",
            start: "top 70%",
        }
    });
});

// Particles Generation for Contact Section
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('absolute', 'bg-cinematic-red', 'rounded-full', 'opacity-50');
        
        // Random size between 1px and 3px
        const size = Math.random() * 2 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        particlesContainer.appendChild(particle);
        
        // Animate
        gsap.to(particle, {
            y: `-${Math.random() * 100 + 50}`,
            x: `${Math.random() * 50 - 25}`,
            opacity: 0,
            duration: Math.random() * 5 + 5,
            repeat: -1,
            ease: "none",
            delay: Math.random() * 5
        });
    }
}

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                scrollTo: {
                    y: target,
                    offsetY: 0
                },
                duration: 1.5,
                ease: "power3.inOut"
            });
        }
    });
});

// Other Projects Interactive Audio
const projectVideos = document.querySelectorAll('.project-video');

projectVideos.forEach(video => {
    video.addEventListener('click', () => {
        if (video.muted) {
            // Fade out any other playing videos
            projectVideos.forEach(otherVideo => {
                if (otherVideo !== video && !otherVideo.muted) {
                    gsap.to(otherVideo, {
                        volume: 0,
                        duration: 0.5,
                        ease: "power2.inOut",
                        onComplete: () => {
                            otherVideo.muted = true;
                        }
                    });
                }
            });
            
            // Unmute and fade in clicked video
            video.volume = 0;
            video.muted = false;
            gsap.to(video, {
                volume: 1,
                duration: 0.5,
                ease: "power2.inOut"
            });
        } else {
            // Fade out and mute clicked video
            gsap.to(video, {
                volume: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    video.muted = true;
                }
            });
        }
    });
});
