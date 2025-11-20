import './arc.css';

const data = [
    { name: 'Security', img: '/icon_security_1763541652905.png' },
    { name: 'Traffic', img: '/icon_traffic_1763541686068.png' },
    { name: 'Monitoring', img: '/icon_monitoring_1763541695133.png' },
    { name: 'Analytics', img: '/icon_data_1763541705196.png' },
    { name: 'Location', img: '/icon_location_1763541716366.png' },
    { name: 'System', img: '/icon_system_1763541727413.png' }
];

const container = document.getElementById('arc-container');
const radiusX = 350;

const items = [];
const total = data.length;
const step = 30;
const startAngle = -((total - 1) * step) / 2;

data.forEach((itemData, index) => {
    const el = document.createElement('div');
    el.className = 'arc-item';
    el.innerHTML = `
    <img src="${itemData.img}" alt="${itemData.name}">
    <h3>${itemData.name}</h3>
  `;
    container.appendChild(el);
    items.push({
        el,
        baseAngle: startAngle + index * step
    });
});

let time = 0;

function animate() {
    time += 0.03;

    const swingAmplitude = 60;
    const globalOffset = Math.sin(time) * swingAmplitude;

    items.forEach(item => {
        let currentAngle = item.baseAngle + globalOffset;
        const rad = currentAngle * (Math.PI / 180);

        const x = Math.sin(rad) * radiusX;
        const z_depth = Math.cos(rad) * radiusX;

        const scale = 0.6 + ((z_depth + radiusX) / (2 * radiusX)) * 0.6;

        let opacity = (Math.cos(rad) + 1) / 2;
        opacity = Math.max(0, Math.min(1, opacity));

        item.el.style.transform = `translate3d(${x}px, 0, ${z_depth}px) scale(${scale})`;
        item.el.style.zIndex = Math.floor(z_depth);
        item.el.style.opacity = opacity;
    });

    requestAnimationFrame(animate);
}

animate();
