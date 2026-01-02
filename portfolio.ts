/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// --- SHARED TYPES, DATA, AND UTILITY FUNCTIONS ---

export interface Project {
    id: number;
    title: string;
    shortDescription: string;
    fullDescription: string;
    stack: string[];
    image: string;
    links: {
        live?: string;
        repo?: string;
    };
}

const API_BASE_URL = 'https://api.lagostechboy.com/wp-json';

/**
 * Fetches project data from the WordPress REST API.
 * @returns A promise that resolves to an array of Project objects.
 */
export async function fetchProjects(): Promise<Project[]> {
    try {
        // Use _embed to include featured image data in the same request
        const response = await fetch(`${API_BASE_URL}/wp/v2/project?_embed=true`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawProjects = await response.json();
        
        // Map the raw API data to the cleaner Project interface
        return rawProjects.map((project: any): Project => {
            const shortDesc = project.excerpt?.rendered
                .replace(/<p>|<\/p>/g, '') // Remove paragraph tags from excerpt
                .trim() || '';

            // A fallback image in case one isn't set in WordPress
            const fallbackImage = 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop';

            return {
                id: project.id,
                title: project.title?.rendered || 'Untitled Project',
                shortDescription: shortDesc,
                fullDescription: project.content?.rendered || '<p>No description available.</p>',
                stack: project.acf?.stack ? project.acf.stack.split(',').map((s: string) => s.trim()) : [],
                image: project._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallbackImage,
                links: {
                    live: project.acf?.live_url || '',
                    repo: project.acf?.repo_url || '',
                }
            };
        });
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return []; // Return an empty array on failure to prevent app crash
    }
}


/**
 * Creates a project card HTML element.
 * @param project The project data object.
 * @returns An HTMLElement representing the project card.
 */
export function createProjectCard(project: Project): HTMLElement {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    card.dataset.id = project.id.toString();
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View details for ${project.title}`);


    const desc = project.shortDescription || 'View details for more info.';
    const stackBadge = project.stack.length > 0 ? project.stack[0] : 'Dev';

    card.innerHTML = `
        <div class="card-image-wrapper">
            <img src="${project.image}" alt="Preview image of the ${project.title} project" loading="lazy" />
        </div>
        <div class="card-content">
            <div class="card-meta">// ${stackBadge}</div>
            <h3 class="card-title">${project.title}</h3>
            <p class="card-desc">${desc}</p>
            <div class="card-links">
                 <a href="${project.links.live || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" aria-label="View live site for ${project.title}">View Site</a>
                 <a href="${project.links.repo || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" aria-label="View source code for ${project.title}">View Code</a>
            </div>
        </div>
    `;
    return card;
}

/**
 * Initializes the project viewer modal.
 * @param workSectionSelector A selector for the element that contains the project cards.
 * @param projects The array of project data to use.
 */
export function initializeProjectViewer(workSectionSelector: string, projects: Project[]) {
    const workSection = document.querySelector(workSectionSelector);
    if (!workSection) return;

    const projectsContainer = workSection.querySelector('.projects-carousel-viewport') as HTMLElement;
    const modalEl = document.getElementById('project-modal') as HTMLElement;
    const closeBtn = document.getElementById('modal-close-btn');
    const backdrop = modalEl.querySelector('.modal-backdrop');

    if (!projectsContainer || !modalEl || !closeBtn || !backdrop) {
        console.error("Required modal elements not found.");
        return;
    }
    
    let lastFocusedElement: HTMLElement | null = null;

    const focusableElements = Array.from(
        modalEl.querySelectorAll('a[href]:not([disabled]), button:not([disabled])')
    ) as HTMLElement[];
    const firstFocusableEl = focusableElements[0];
    const lastFocusableEl = focusableElements[focusableElements.length - 1];

    const handleTrapFocus = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) { // shift + tab
            if (document.activeElement === firstFocusableEl) {
                e.preventDefault();
                lastFocusableEl.focus();
            }
        } else { // tab
            if (document.activeElement === lastFocusableEl) {
                e.preventDefault();
                firstFocusableEl.focus();
            }
        }
    };
    
    const getProjectSlug = (project: Project) => project.title.toLowerCase().replace(/\s+/g, '-');

    const openProject = (projectId: number) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        // --- Populate viewer content ---
        const title = modalEl.querySelector('#project-viewer-title');
        const stack = modalEl.querySelector('#project-viewer-stack');
        const desc = modalEl.querySelector('#project-viewer-description');
        const img = modalEl.querySelector('#project-viewer-image') as HTMLImageElement;
        const liveBtn = modalEl.querySelector('#project-viewer-live-link') as HTMLAnchorElement;
        const repoBtn = modalEl.querySelector('#project-viewer-repo-link') as HTMLAnchorElement;

        if (title) title.textContent = project.title;
        if (stack) stack.textContent = project.stack.length ? `// ${project.stack.join(' + ')}` : '// Development';
        if (desc) desc.innerHTML = project.fullDescription;
        if (img) {
            img.src = project.image;
            img.alt = `Hero image for the ${project.title} project`;
        }
        
        if (liveBtn) {
            liveBtn.href = project.links.live || '#';
            liveBtn.style.display = project.links.live ? 'inline-flex' : 'none';
            liveBtn.setAttribute('aria-label', `View live site for ${project.title}`);
        }
        if (repoBtn) {
            repoBtn.href = project.links.repo || '#';
            repoBtn.style.display = project.links.repo ? 'inline-flex' : 'none';
            repoBtn.setAttribute('aria-label', `View source code for ${project.title}`);
        }

        // --- Show modal ---
        document.body.classList.add('modal-open');
        modalEl.setAttribute('aria-hidden', 'false');
        modalEl.classList.add('visible');
        modalEl.addEventListener('keydown', handleTrapFocus);
        setTimeout(() => firstFocusableEl?.focus(), 50); // Focus on the close button
        
        window.location.hash = `work/${getProjectSlug(project)}`;
    };

    const closeProject = () => {
        if (!modalEl.classList.contains('visible')) return;

        document.body.classList.remove('modal-open');
        modalEl.setAttribute('aria-hidden', 'true');
        modalEl.classList.remove('visible');
        modalEl.removeEventListener('keydown', handleTrapFocus);

        if (window.location.hash.startsWith('#work/')) {
            const url = new URL(window.location.href);
            url.hash = '';
            history.replaceState(null, '', url.toString());
        }

        lastFocusedElement?.focus(); // Restore focus to the element that opened the modal
    };

    // --- Event Listeners ---
    projectsContainer.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.closest('.card-links a')) {
            return; // Don't open modal if clicking a link inside the card
        }
        const card = target.closest<HTMLElement>('.project-card');
        if (card) {
            lastFocusedElement = card;
            openProject(parseInt(card.dataset.id || '0'));
        }
    });

    projectsContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const card = (e.target as HTMLElement).closest<HTMLElement>('.project-card');
            if (card) {
                e.preventDefault(); // Prevent space from scrolling
                lastFocusedElement = card;
                openProject(parseInt(card.dataset.id || '0'));
            }
        }
    });

    closeBtn.addEventListener('click', closeProject);
    backdrop.addEventListener('click', closeProject);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalEl.classList.contains('visible')) {
            closeProject();
        }
    });

    window.addEventListener('hashchange', () => {
        if (!window.location.hash.startsWith('#work/')) {
            closeProject();
        }
    });

}