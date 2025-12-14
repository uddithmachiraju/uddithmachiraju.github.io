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

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });

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
                if (suffix === '×') {
                    element.innerHTML = Math.floor(current) + '<span class="plus">×</span>';
                } else if (suffix === '+') {
                    element.innerHTML = Math.floor(current) + '<span class="plus">+</span>';
                } else {
                    element.innerHTML = Math.floor(current) + '<span class="plus">%</span>';
                }
            } else if (element.classList.contains('experience-number')) {
                // show experience with decimals and unit (e.g. 1.5yrs)
                element.innerHTML = current.toFixed(decimals) + '<span class="experience-unit">' + suffix + '</span>';
            }
        }, 16);
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
                    const text = entry.target.textContent;
                    let targetValue, suffix;
                    
                    if (text.includes('40')) {
                        targetValue = 40;
                        suffix = '%';
                    } else if (text.includes('99')) {
                        targetValue = 99;
                        suffix = '%';
                    } else if (text.includes('85')) {
                        targetValue = 85;
                        suffix = '%';
                    } else if (text.includes('2')) {
                        targetValue = 2;
                        suffix = '×';
                    } else if (text.includes('70')) {
                        targetValue = 70;
                        suffix = '%';
                    } else if (text.includes('50')) {
                        targetValue = 50;
                        suffix = '+';
                    }
                    
                    animateCounter(entry.target, targetValue, 0, suffix);
                }
            }
        });
    }, observerOptions);
    
    const statNumber = document.querySelector('.stat-number');
    const metricNumbers = document.querySelectorAll('.metric-number');
    const experienceNumber = document.querySelector('.experience-number');
    
    if (statNumber) observer.observe(statNumber);
    metricNumbers.forEach(metric => observer.observe(metric));
    if (experienceNumber) observer.observe(experienceNumber);

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
});