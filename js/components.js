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

function toggleDetails(card) {
  card.classList.toggle("expanded");
}

const experienceData = [
  {
    company: "Cohyve",
    role: "Artificial Intelligence Intern",
    duration: "Jun 2025 – Present",
    details: [
      
    ]
  },
  {
    company: "Aegion Dynamic Solutions",
    role: "Machine Learning Intern",
    duration: "Mar 2025 – Present",
    details: [
      "Built and deployed scalable ML pipelines using Flyte on AWS EC2, enabling reproducible, modular, and cloud-native workflow execution.",
      "Focused on designing a custom top-layer interface over Flyte to simplify pipeline execution for non-technical users.",
      "Containerized workflows using Docker and implemented CI/CD automation for seamless deployment and testing.",
      "Developed and deployed a serverless application using AWS Lambda, and REST API Gateway integration"
    ]
  },
  {
    company: "KanaQ Innovations",
    role: "Python Developer Intern",
    duration: "Jan 2025 – May 2025",
    details: [
      "Developed custom Odoo modules for Master Data Management.",
      "Automated customer/vendor profile management with Python.",
      "Integrated modules with Odoo for real-time data sync.",
      "Utilized PostgreSQL and Odoo ORM for data integrity.",
      "Managed Odoo servers on Linux, optimized performance."
    ]
  },
  {
    company: "Indian Institute of Technology, Indore",
    role: "ML Research Intern",
    duration: "Aug 2024 – Mar 2025",
    details: [
      "Designed 7 GAN architectures, boosting adversarial malware classification efficiency by 15%.",
      "Implemented a Dual GAN to decrease the mode collapse score and improve generated sample quality.",
      "Enhanced dataset quality, increasing classifier robustness by 30% through synthetic malware generation.",
      "Reduced false positives in cybersecurity detection by 20% using mimicry attack techniques.",
      "Increased malware detection accuracy by 10% through fine-tuned Random Forest models across 36 datasets.",
      "Utilized MLflow for model tracking and hyperparameter tuning, optimizing model performance."
    ]
  }
];

function openModal(index) {
  const modal = document.getElementById("experience-modal");
  const title = document.getElementById("modal-title");
  const role = document.getElementById("modal-role");
  const duration = document.getElementById("modal-duration");
  const detailsList = document.getElementById("modal-details");

  const data = experienceData[index];
  title.textContent = data.company;
  role.textContent = data.role;
  duration.textContent = data.duration;

  detailsList.innerHTML = "";
  data.details.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    detailsList.appendChild(li);
  });

  modal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.querySelector(".close-modal");
  const modal = document.getElementById("experience-modal");

  closeBtn.onclick = () => (modal.style.display = "none");
  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
});


const overallCtx = document.getElementById('skillRadar').getContext('2d');
  new Chart(overallCtx, {
    type: 'radar',
    data: {
      labels: ['MLOps', 'Research', 'API Dev', 'Cloud Deploy', 'Optimization', 'Data Eng'],
      datasets: [
        {
          label: 'Overall Experience',
          data: [66.25, 72.5, 65, 70, 66.25, 73.75],
          backgroundColor: 'rgba(34,197,94,0.2)',
          borderColor: 'rgba(34,197,94,1)',
          borderWidth: 2
        }
      ]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          angleLines: { color: '#ddd' },
          grid: { color: '#eee' },
          pointLabels: { color: '#444', font: { size: 12 } },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#333',
            font: { weight: 'bold' }
          },
          onClick: () => {}
        }
      }
    }
  });