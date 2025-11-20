import './circle.css'

const data = [
  { name: 'Security', img: '/icon_security_1763541652905.png' },
  { name: 'Traffic', img: '/icon_traffic_1763541686068.png' },
  { name: 'Monitoring', img: '/icon_monitoring_1763541695133.png' },
  { name: 'Analytics', img: '/icon_data_1763541705196.png' },
  { name: 'Location', img: '/icon_location_1763541716366.png' },
  { name: 'System', img: '/icon_system_1763541727413.png' }
];

const carousel = document.getElementById('carousel');
const radius = 400; // Match CSS variable or adjust dynamically
const total = data.length;
const theta = 360 / total;

data.forEach((item, index) => {
  const card = document.createElement('div');
  card.className = 'card';

  // Calculate position
  const angle = theta * index;
  // Rotate the card to face the center (or outwards) and translate it out
  card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;

  card.innerHTML = `
    <div class="card-content">
      <img src="${item.img}" alt="${item.name}">
      <div class="platform"></div>
      <h3>${item.name}</h3>
    </div>
  `;

  carousel.appendChild(card);
});

// Optional: Add mouse interaction to rotate manually
let isDragging = false;
let startX;
let currentRotation = 0;
let previousRotation = 0;

document.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  carousel.style.animation = 'none'; // Stop auto-rotation on interaction
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  currentRotation = previousRotation + dx * 0.5;
  carousel.style.transform = `rotateY(${currentRotation}deg)`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  previousRotation = currentRotation;
  // Optional: Resume animation or keep it static
  // carousel.style.animation = 'rotate 20s infinite linear'; 
});
