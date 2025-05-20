// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Update active link on click
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    navLinks.forEach(lnk => lnk.classList.remove('active'));
    this.classList.add('active');
  });
});

// Update active nav link on scroll
const sections = document.querySelectorAll('section, header'); // include header for #home
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 60; // offset for nav height
    const sectionHeight = section.offsetHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Trigger scroll event on page load to set active link correctly
window.dispatchEvent(new Event('scroll'));

window.addEventListener('scroll', () => {
  const scroll = window.pageYOffset;
  document.querySelector('nav').style.transform = `translateZ(${scroll * 0.01}px)`;
});
