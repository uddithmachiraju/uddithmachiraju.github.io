// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links (handles in-page anchors and accounts for fixed navbar)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // if it's an external link (starts with http) or a full page, allow default
            if (!href || href.startsWith('http') || href.indexOf('#') === -1) return;

            e.preventDefault();
            // close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');

            const targetId = href;
            if (targetId === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navbar = document.querySelector('.navbar');
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const rect = targetEl.getBoundingClientRect();
                const scrollTop = window.scrollY + rect.top - navHeight - 12; // small offset
                // set active class immediately for visual feedback
                navLinks.forEach(n => n.classList.remove('active'));
                link.classList.add('active');
                window.scrollTo({ top: scrollTop, behavior: 'smooth' });
            } else {
                // fallback: go to href (might be a page)
                window.location.href = href;
            }
        });
    });

    // Scrollspy: compute section offsets and update active nav link reliably
    const computeSections = () => {
        const list = [];
        navLinks.forEach(lnk => {
            const href = lnk.getAttribute('href');
            if (!href || href.indexOf('#') === -1) return;
            const id = href.split('#')[1];
            if (id === 'home') {
                // home maps to top of the document
                list.push({ link: lnk, id, top: 0 });
            } else {
                const el = document.getElementById(id);
                if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY;
                    list.push({ link: lnk, id, el, top });
                }
            }
        });
        // sort by top offset
        list.sort((a, b) => (a.top || 0) - (b.top || 0));
        return list;
    };

    let sectionList = computeSections();

    const updateSectionPositions = () => {
        sectionList = computeSections();
    };

    const updateActiveOnScroll = () => {
        const navbar = document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const scrollPos = window.scrollY + navHeight + 24; // threshold

        // If we're near the top, activate Home; otherwise choose the last section whose top <= scrollPos
        const nearTopThreshold = navHeight + 40;
        if (window.scrollY <= nearTopThreshold) {
            // set home active (if present)
            navLinks.forEach(n => n.classList.remove('active'));
            const homeLink = Array.from(navLinks).find(l => l.getAttribute('href') === '#home');
            if (homeLink) homeLink.classList.add('active');
            return;
        }

        // exclude 'home' from selection when scrolled down
        let current = null;
        for (const item of sectionList) {
            if (item.id === 'home') continue;
            if ((item.top || 0) <= scrollPos) current = item;
        }

        if (current) {
            if (!current.link.classList.contains('active')) {
                navLinks.forEach(n => n.classList.remove('active'));
                current.link.classList.add('active');
            }
        }
    };

    // update positions on resize (sections may move)
    window.addEventListener('resize', () => {
        // recompute after layout stabilizes
        setTimeout(updateSectionPositions, 120);
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    // run once on load
    updateSectionPositions();
    updateActiveOnScroll();

    // Better scrollspy using IntersectionObserver (fallbacks to scroll-based method above)
    try {
        const navbar = document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const ioOptions = {
            root: null,
            rootMargin: `-${Math.round(window.innerHeight/3)}px 0px -${Math.round(window.innerHeight/3)}px 0px`,
            threshold: 0.0
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.target || !entry.target.id) return;
                const id = entry.target.id;
                const matchingLink = Array.from(navLinks).find(l => l.getAttribute('href') === `#${id}`);
                if (entry.isIntersecting && matchingLink) {
                    navLinks.forEach(n => n.classList.remove('active'));
                    matchingLink.classList.add('active');
                }
            });
        }, ioOptions);

        // observe visible sections (those referenced by nav)
        sectionList.forEach(item => { if (item.el) io.observe(item.el); });
    } catch (e) {
        // ignore observer failures
        console.warn('scrollspy observer init failed', e.message);
    }

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Animate elements on page load
    const cards = document.querySelectorAll('.stat-card, .info-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * (index + 1));
    });
    
    // Animate heading
    const headingName = document.querySelector('.heading-name');
    const headingLight = document.querySelector('.heading-light');
    const headingBold = document.querySelector('.heading-bold');
    
    if (headingName && headingLight && headingBold) {
        headingName.style.opacity = '0';
        headingName.style.transform = 'translateX(-20px)';
        headingName.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        headingLight.style.opacity = '0';
        headingLight.style.transform = 'translateX(-20px)';
        headingLight.style.transition = 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s';
        
        headingBold.style.opacity = '0';
        headingBold.style.transform = 'translateX(-20px)';
        headingBold.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
        
        setTimeout(() => {
            headingName.style.opacity = '1';
            headingName.style.transform = 'translateX(0)';
            headingLight.style.opacity = '1';
            headingLight.style.transform = 'translateX(0)';
            headingBold.style.opacity = '1';
            headingBold.style.transform = 'translateX(0)';
        }, 50);
    }
    
    // Add hover effect to stat cards
    const statCards = document.querySelectorAll('.stat-card, .info-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            if (card.classList.contains('dark-card')) {
                card.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.4)';
            } else {
                card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            if (card.classList.contains('dark-card')) {
                card.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            } else {
                card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }
        });
    });
    
    // Counter animation for CGPA and metrics
    const animateCounter = (element, target, decimals = 0, suffix = '%', duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (element.classList.contains('stat-number')) {
                element.innerHTML = current.toFixed(decimals) + '<span class="stat-unit">/10</span>';
            } else if (element.classList.contains('metric-number')) {
                // support scaled display (e.g., thousands 'K') via data-scale attribute
                const scale = (element.getAttribute('data-scale') || '').toLowerCase();
                const base = Math.floor(current);
                if (scale === 'k') {
                    // show like '50K+'
                    element.innerHTML = base + 'K' + '<span class="plus">' + (suffix || '+') + '</span>';
                } else {
                    if (suffix === '×') {
                        element.innerHTML = base + '<span class="plus">×</span>';
                    } else if (suffix === '+') {
                        element.innerHTML = base + '<span class="plus">+</span>';
                    } else {
                        element.innerHTML = base + '<span class="plus">%</span>';
                    }
                }
            } else if (element.classList.contains('experience-number')) {
                // show experience with decimals and unit (e.g. 1.5yrs)
                element.innerHTML = current.toFixed(decimals) + '<span class="experience-unit">' + suffix + '</span>';
            }
        }, 16);
    };

    // Animate company-month badges (updates the inner `.company-number-value`)
    const animateCompanyBadge = (el, duration = 1200) => {
        const dataVal = el.getAttribute('data-value');
        const target = dataVal ? (parseInt(dataVal.replace(/[^0-9]/g, ''), 10) || 0) : (parseInt(el.textContent.replace(/[^0-9]/g, ''), 10) || 0);
        const valueSpan = el.querySelector('.company-number-value');
        const start = 0;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const current = Math.floor(progress * (target - start) + start);

            if (valueSpan) {
                valueSpan.textContent = current;
            } else {
                // fallback: replace text node while preserving unit span
                const unit = el.querySelector('.company-unit');
                if (unit) {
                    el.textContent = current;
                    el.appendChild(unit);
                } else {
                    el.textContent = current;
                }
            }

            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };
    
    // Trigger counter animations when elements are visible
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target, 8.0, 1, '%');
                } else if (entry.target.classList.contains('experience-number')) {
                    // animate experience (1.2 years)
                    animateCounter(entry.target, 1.2, 1, 'yrs');
                } else if (entry.target.classList.contains('metric-number')) {
                    // Prefer explicit `data-value` attribute; fall back to parsing numbers from text
                    const dataVal = entry.target.getAttribute('data-value');
                    let targetValue = 0;
                    if (dataVal !== null && dataVal !== undefined && dataVal !== '') {
                        targetValue = parseInt(dataVal.replace(/[^0-9]/g, ''), 10) || 0;
                    } else {
                        targetValue = parseInt(entry.target.textContent.replace(/[^0-9]/g, ''), 10) || 0;
                    }

                    // infer suffix from visible text
                    const text = entry.target.textContent || '';
                    let suffix = '+';
                    if (text.includes('%')) suffix = '%';
                    else if (text.includes('×')) suffix = '×';
                    else if (text.includes('+')) suffix = '+';

                    animateCounter(entry.target, targetValue, 0, suffix);
                } else if (entry.target.classList.contains('company-number')) {
                    const el = entry.target;
                    animateCompanyBadge(el, 1000);
                }
            }
        });
    }, observerOptions);
    
    const statNumber = document.querySelector('.stat-number');
    const metricNumbers = document.querySelectorAll('.metric-number');
    const experienceNumber = document.querySelector('.experience-number');
    const companyNumbers = document.querySelectorAll('.company-number');
    
    if (statNumber) observer.observe(statNumber);
    metricNumbers.forEach(metric => observer.observe(metric));
    if (experienceNumber) observer.observe(experienceNumber);
    companyNumbers.forEach(cn => observer.observe(cn));

    // Typing effect for mission badge (optional enhancement)
    const missionBadge = document.querySelector('.mission-badge');
    if (missionBadge) {
        const text = missionBadge.textContent;
        missionBadge.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                missionBadge.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // --- Experience radar chart + skill-bar animation (if elements exist) ---
    try {
        // Radar Chart (updated to use gradient and tooltip styling per user's design)
        const radarCanvas = document.getElementById('radarChart');
        if (radarCanvas && typeof Chart !== 'undefined') {
            const radarCtx = radarCanvas.getContext('2d');
            // ensure canvas has some height in case CSS hasn't applied yet
            radarCanvas.parentElement.style.minHeight = radarCanvas.parentElement.style.minHeight || '260px';

            const gradient = radarCtx.createLinearGradient(0, 0, 0, 400);
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0.2)');

            new Chart(radarCtx, {
                type: 'radar',
                data: {
                    labels: ['LLMs', 'MLOps', 'Backend', 'Cloud', 'Gen AI', 'Data Eng'],
                    datasets: [{
                        label: 'Skill Level',
                        data: [95, 40, 92, 85, 90, 82],
                        backgroundColor: gradient,
                        borderColor: '#6366f1',
                        borderWidth: 3,
                        pointBackgroundColor: '#6366f1',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#6366f1',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#6366f1',
                            borderWidth: 1,
                            displayColors: false,
                            callbacks: {
                                label: function(context) { return context.parsed.r + '%'; }
                            }
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            min: 0,
                            ticks: {
                                stepSize: 20,
                                color: 'rgba(255, 255, 255, 0.6)',
                                backdropColor: 'transparent',
                                font: { size: 11 }
                            },
                            grid: { color: 'rgba(255, 255, 255, 0.15)', circular: true },
                            angleLines: { color: 'rgba(255, 255, 255, 0.15)' },
                            pointLabels: { color: '#fff', font: { size: 13, weight: '600' }, padding: 10 }
                        }
                    },
                    animation: { duration: 2000, easing: 'easeOutQuart' }
                }
            });
        }

        // Animate skill bars (if present)
        const skillFills = document.querySelectorAll('.skill-fill');
        if (skillFills.length) {
            skillFills.forEach((fill, index) => {
                const width = fill.style.width || '0%';
                fill.style.width = '0%';
                setTimeout(() => { fill.style.width = width; }, 120 * (index + 1));
            });
        }

        // API counter: persist and increment on each page load using localStorage
        const apiCountEl = document.getElementById('apiCount');
        if (apiCountEl) {
            try {
                const key = 'apiCount';
                let current = parseInt(localStorage.getItem(key) || '20', 10);
                if (isNaN(current)) current = 20;
                // increment on each load
                current = current + 1;
                localStorage.setItem(key, String(current));
                // update DOM (show plus sign separately)
                apiCountEl.innerHTML = current + '<span class="plus">+</span>';
            } catch (e) {
                // ignore storage errors
                console.warn('apiCount storage error', e.message);
            }
        }
        
        // Animate the new metric cards (data-target attr expected)
        const animateLargeMetric = (el, duration = 1200) => {
            const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/[^0-9]/g, ''), 10) || 0;
            const start = 0;
            const startTime = performance.now();

            const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const current = Math.floor(progress * (target - start) + start);

                // format large numbers (k)
                if (target >= 1000) {
                    const k = Math.floor(current / 1000);
                    el.textContent = k + 'K+';
                } else {
                    el.textContent = current + (el.querySelector('.plus') ? '+' : '');
                }

                if (progress < 1) requestAnimationFrame(step);
            };

            requestAnimationFrame(step);
        };

        // Start animations for all metric-number-large when visible
        const largeMetrics = document.querySelectorAll('.metric-number-large');
        largeMetrics.forEach((m) => {
            // run immediately (they're visible in the card)
            animateLargeMetric(m, 1400);
        });

        // Project Impact Heatmap generation
        const heatmapEl = document.getElementById('heatmap');
        if (heatmapEl) {
            // create a deterministic-ish dataset for 12 months x 7 rows
            const months = 12;
            const rows = 7; // days of week visual layout

            // clear
            heatmapEl.innerHTML = '';

            for (let r = 0; r < rows; r++) {
                for (let m = 0; m < months; m++) {
                    const cell = document.createElement('div');
                    // simple value generator (can be replaced with real data)
                    const value = Math.floor((Math.abs(Math.sin((m + 1) * (r + 2))) * 100) % 5);
                    cell.className = 'cell level-' + value;
                    cell.setAttribute('title', `Month ${m + 1} — intensity ${value}`);
                    heatmapEl.appendChild(cell);
                }
            }
        }
    } catch (e) {
        // Quietly ignore if Chart.js isn't loaded or canvas not present
        console.warn('Experience radar init skipped:', e.message);
    }
});