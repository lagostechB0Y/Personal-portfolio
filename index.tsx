

import { initializeProjectViewer } from './portfolio.ts';
import { fetchProjects, createProjectCard, Project } from './portfolio.ts';

export {}; 

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- TYPES ---
interface Profile {
    name: string;
    bioHtml: string;
    image: string;
}

// --- STATIC DATA ---
const PROFILE_DATA: Profile = {
    name: 'Abiodun Adeniji (LagosTechBoy)',
    bioHtml: `
        <p>I’m Abiodun Adeniji (LagosTechBoy), a Senior Software Engineer building Laravel backends and headless web architectures that scale, perform, and survive real-world traffic.</p>
        <p>With 4 years of professional experience, I deliver robust backend systems, seamless frontend integration, and maintainable code for growing businesses and modern web products.</p>
        <p><strong>PHP • Laravel • React • WordPress(Headless) • API Design</strong></p>
        <p>Outside of coding, I explore tech trends, contribute to open-source, and constantly tinker with new tools and frameworks.</p>
    `,
    image: 'https://api.lagostechboy.com/wp-content/uploads/2025/11/ade-3.jpeg'
};

// --- THEME TOGGLE LOGIC ---
const initThemeToggle = () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    const getCurrentTheme = () => localStorage.getItem('theme');
    
    const applyTheme = (theme: string | null) => {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };

    // Set initial theme
    const savedTheme = getCurrentTheme();
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.hasAttribute('data-theme') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Listen for OS theme changes if no preference is set
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!getCurrentTheme()) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
};


document.addEventListener('DOMContentLoaded', () => {

    // Selectors
    const projectsGridEl = document.querySelector('.projects-grid') as HTMLElement;
    const aboutSectionEl = document.querySelector('.about-section');
    const header = document.querySelector('.site-header') as HTMLElement;
    const workSection = document.getElementById('work');


    // --- Animation Logic ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    

    // --- Carousel Logic ---
    const initCarousel = (projects: Project[]) => {
        const viewport = workSection?.querySelector('.projects-carousel-viewport');
        const grid = workSection?.querySelector('.projects-grid') as HTMLElement;
        const prevBtn = document.getElementById('carousel-prev') as HTMLButtonElement;
        const nextBtn = document.getElementById('carousel-next') as HTMLButtonElement;
        
        if (!grid || !prevBtn || !nextBtn || !viewport) return;

        let currentIndex = 0;
        const totalItems = projects.length;

        const calculateItemsPerPage = () => {
            if (window.innerWidth < 768) return 1;
            if (window.innerWidth < 900) return 2;
            return 3;
        };

        const updateCarousel = () => {
            const itemsPerPage = calculateItemsPerPage();
            const card = grid.querySelector('.project-card') as HTMLElement;
            if (!card) return;
            
            const cardWidth = card.offsetWidth;
            const gap = parseFloat(getComputedStyle(grid).gap);
            const offset = currentIndex * (cardWidth + gap);
            
            grid.style.transform = `translateX(-${offset}px)`;

            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= totalItems - itemsPerPage;
        };
        
        nextBtn.addEventListener('click', () => {
            const itemsPerPage = calculateItemsPerPage();
            if (currentIndex < totalItems - itemsPerPage) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        window.addEventListener('resize', () => {
            const itemsPerPage = calculateItemsPerPage();
            currentIndex = Math.min(currentIndex, totalItems - itemsPerPage);
            updateCarousel();
        });

        // Use a small timeout to ensure cards have been rendered and have a width
        setTimeout(updateCarousel, 100);
    };

    // --- Rendering Logic ---
    const renderPortfolio = (projects: Project[]) => {
        if (!projectsGridEl) return;
        projectsGridEl.innerHTML = ''; // Clear loading/error states

        if (projects.length === 0) {
            projectsGridEl.innerHTML = `<p class="error-message">Could not load projects. Please try again later.</p>`;
            return;
        }

        projects.forEach((project) => {
            const card = createProjectCard(project);
            projectsGridEl.appendChild(card);
        });
    };

    const renderAbout = () => {
        if (!aboutSectionEl) return;

        const bioEl = document.getElementById('bio-content');
        if(bioEl) bioEl.innerHTML = PROFILE_DATA.bioHtml;

        const avatarImg = aboutSectionEl.querySelector('.about-avatar img') as HTMLImageElement;
        if (avatarImg) {
            avatarImg.src = PROFILE_DATA.image;
        }
    };

    // --- Init ---
    const init = async () => {
        initThemeToggle();
        renderAbout();

        // Asynchronously fetch and render portfolio
        if (projectsGridEl) {
             projectsGridEl.innerHTML = `<p class="loading-message">Loading projects...</p>`;
        }
        
        const projects = await fetchProjects();
        renderPortfolio(projects);

        if (projects.length > 0) {
            initializeProjectViewer('#work', projects);
            initCarousel(projects);
        }

        // Set up animations for all elements after content is loaded
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        }, 0);
        
        // General event listeners
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header?.classList.add('scrolled');
            else header?.classList.remove('scrolled');
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = (this as HTMLAnchorElement).getAttribute('href');
                if (href && href.length > 1) {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                } else if (href === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    };

    init();
});