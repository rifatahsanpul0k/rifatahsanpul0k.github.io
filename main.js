// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const initializeAnimations = () => {
    document.querySelectorAll('.glass-panel').forEach(panel => {
        // Initial state before animation if not already animated
        if (!panel.classList.contains('animate-fade-in')) {
            panel.style.opacity = '0';
        }
        observer.observe(panel);
    });
};

// Fetch and load user data
const loadUserData = async () => {
    try {
        const response = await fetch('./user.json');
        const data = await response.json();

        // Update Nav & Footer
        const initials = data.name.split(' ').map(n => n[0]).join('');
        document.getElementById('nav-initials').textContent = initials;
        document.getElementById('footer-text').textContent = `© 2026 ${data.name}. Designed with Apple Aesthetics.`;

        // Update Hero
        document.getElementById('hero-headline').innerHTML = data.headline;
        document.getElementById('hero-subtitle').textContent = `I'm ${data.name.split(' ')[0]}, ${data.role.toLowerCase()} building products with precision and purpose.`;

        // Update About
        document.getElementById('about-role').textContent = data.role;
        document.getElementById('about-bio').textContent = data.bio;

        // Load Skills in About Card
        const skillsContainer = document.getElementById('skills-container');
        const allSkills = [...Object.values(data.skills).flat()];
        skillsContainer.innerHTML = allSkills.slice(0, 6).map(skill => `
            <span style="background: rgba(0,0,0,0.05); padding: 4px 12px; border-radius: 980px; font-size: 12px; font-weight: 500;">${skill}</span>
        `).join('');

        // Load Main Skills Grid
        const skillsGrid = document.getElementById('skills-grid');
        if (skillsGrid) {
            skillsGrid.innerHTML = Object.entries(data.skills).map(([category, skills], i) => `
                <div class="glass-panel animate-fade-in" style="animation-delay: ${0.1 * i}s;">
                    <h3 style="text-transform: capitalize; font-size: 18px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                        <span style="width: 8px; height: 8px; background: var(--accent-blue); border-radius: 50%;"></span>
                        ${category}
                    </h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${skills.map(skill => `
                            <span style="color: var(--text-secondary); font-size: 14px; font-weight: 400; background: rgba(0,0,0,0.03); padding: 6px 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05);">
                                ${skill}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        // Populate Featured Projects in Bento Grid
        const projectsBento = document.getElementById('projects-bento-grid');
        if (projectsBento && data.projects) {
            projectsBento.innerHTML = data.projects.slice(0, 4).map((project, index) => {
                const isLarge = index === 0 || index === 3;
                return `
            <div class="glass-panel bento-item ${isLarge ? 'span-2 row-2' : ''} animate-fade-in" style="animation-delay: ${0.2 * index}s;">
                <div style="height: ${isLarge ? '240px' : '140px'}; overflow: hidden; border-radius: 12px; margin-bottom: 20px; background: rgba(0,0,0,0.05);">
                    <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <h3 style="font-size: ${isLarge ? '24px' : '18px'}; margin-bottom: 12px;">${project.title}</h3>
                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">${project.description}</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
                    ${project.tech.map(t => `<span style="font-size: 11px; background: rgba(0,0,0,0.05); padding: 4px 8px; border-radius: 4px;">${t}</span>`).join('')}
                </div>
                <a href="${project.link}" class="btn btn-primary" style="font-size: 13px; padding: 10px 20px; width: fit-content;">View Case Study</a>
            </div>
            `;
            }).join('');
        }

        // Populate Global Footer Socials
        if (data.contact) {
            const contact = data.contact;
            if (document.getElementById('footer-github')) document.getElementById('footer-github').href = contact.github ? `https://github.com/${contact.github}` : '#';
            if (document.getElementById('footer-linkedin')) document.getElementById('footer-linkedin').href = contact.linkedin || '#';
            if (document.getElementById('footer-twitter')) document.getElementById('footer-twitter').href = contact.twitter || '#';
            if (document.getElementById('footer-instagram')) document.getElementById('footer-instagram').href = contact.instagram || '#';
        }

        // Initialize Lucide icons after dynamic content is loaded
        lucide.createIcons();
        // Load Education
        const educationContainer = document.getElementById('education-container');
        if (educationContainer) {
            educationContainer.innerHTML = data.education.map(edu => `
                <div class="animate-fade-in">
                    <div style="display: flex; justify-content: space-between; align-items: baseline;">
                        <h3 style="font-size: 22px;">${edu.degree}</h3>
                        <span style="font-size: 14px; color: var(--text-tertiary); font-weight: 500;">${edu.period}</span>
                    </div>
                    <p style="color: var(--accent-blue); font-weight: 500; font-size: 16px; margin-top: 4px;">${edu.school}</p>
                    <p style="color: var(--text-secondary); font-size: 15px; margin-top: 12px;">${edu.details}</p>
                </div>
            `).join('');
        }

        // Load Certifications
        const certsContainer = document.getElementById('certs-container');
        if (certsContainer) {
            certsContainer.innerHTML = data.certifications.map(cert => `
                <div class="animate-fade-in" style="display: flex; gap: 20px; align-items: center;">
                    <div style="background: white; padding: 12px; border-radius: 12px; border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center;">
                        <i data-lucide="award" style="color: var(--accent-blue);"></i>
                    </div>
                    <div>
                        <h3 style="font-size: 16px; margin-bottom: 2px;">${cert.title}</h3>
                        <p style="color: var(--text-secondary); font-size: 13px;">${cert.issuer} • ${cert.date}</p>
                    </div>
                </div>
            `).join('');
        }

        // Update Stats
        document.getElementById('github-stat').textContent = data.stats.github;

        // Load Experience
        const experienceContainer = document.getElementById('experience-container');
        experienceContainer.innerHTML = data.experience.map(exp => `
            <div style="margin-bottom: 12px;">
                <p style="font-weight: 600; font-size: 15px;">${exp.role} @ ${exp.company}</p>
                <p style="font-size: 13px; color: var(--text-secondary);">${exp.period}</p>
            </div>
        `).join('');

        // Update Contact & Socials
        document.getElementById('email-link').href = `mailto:${data.contact.email}`;
        document.getElementById('linkedin-link').href = data.contact.linkedin;
        document.getElementById('twitter-link').href = data.contact.twitter;
        document.getElementById('instagram-link').href = data.contact.instagram;

        // Re-initialize animations for any new elements
        initializeAnimations();

        // Update document title
        document.title = `${data.name} | ${data.role}`;

    } catch (error) {
        console.error("Failed to load user data:", error);
    }
};

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// Subtle background mouse follower (light flare)
const createFlare = () => {
    const flare = document.createElement('div');
    flare.id = 'bg-flare';
    Object.assign(flare.style, {
        position: 'fixed',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0, 102, 204, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '-1',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.1s ease-out',
        top: '0',
        left: '0'
    });
    document.body.appendChild(flare);

    window.addEventListener('mousemove', (e) => {
        flare.style.left = `${e.clientX}px`;
        flare.style.top = `${e.clientY}px`;
    });
};

createFlare();

document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
});

console.log("Rifat Ahsan Pulok Portfolio Initialized. Designed by Apple (Style) and Antigravity (Assistant).");
