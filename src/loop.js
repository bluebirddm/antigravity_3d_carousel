import './loop.css';

const data = [
    { name: 'Security', img: '/icon_security_1763541652905.png' },
    { name: 'Traffic', img: '/icon_traffic_1763541686068.png' },
    { name: 'Monitoring', img: '/icon_monitoring_1763541695133.png' },
    { name: 'Analytics', img: '/icon_data_1763541705196.png' },
    { name: 'Location', img: '/icon_location_1763541716366.png' },
    { name: 'System', img: '/icon_system_1763541727413.png' }
];

const container = document.getElementById('loop-container');
const radiusX = 350;

const items = [];
// We want items to flow from 0 to 180 degrees.
// 0 degrees = Right. 180 degrees = Left.
// We need to space them out so they cover the arc or a portion of it.
// Let's say we want them to be evenly spaced in the "visible" window (0-180).
// But for infinite loop, we might need more items or recycle them.
// Let's space them by 45 degrees.
const spacing = 45;

data.forEach((itemData, index) => {
    const el = document.createElement('div');
    el.className = 'loop-item';
    el.innerHTML = `
    <img src="${itemData.img}" alt="${itemData.name}">
    <h3>${itemData.name}</h3>
  `;
    container.appendChild(el);

    // Initial position: Start them spaced out.
    // Some might start "off screen" (negative angle or > 180) if we want a full train.
    // Let's start them at 0, -45, -90, etc. so they flow in.
    items.push({
        el,
        angle: -index * spacing // Start behind 0
    });
});

function animate() {
    // Move items forward (increase angle)
    const speed = 0.5;

    items.forEach(item => {
        item.angle += speed;

        // Reset if > 180 (plus some buffer to let it fade out completely)
        // If we reset to exactly 0, it might pop if spacing isn't perfect relative to total items.
        // We want a continuous stream.
        // If we have N items spaced by S, the total length is N*S.
        // If we want them to loop, when one goes off 180, it should go to the "back" of the line.
        // The "back" is (smallest_angle - spacing).
        // But simpler: just wrap modulo?
        // If we wrap modulo 360, they will go 0->180->360(0).
        // But we only want them visible 0->180.
        // If we wrap at 180 back to 0?
        // Then it pops from left to right.
        // User said: "The first image will appear from right to left, reaching 180 degrees before returning to 0 degrees."
        // "returning to 0 degrees" -> does it fly back? or just disappear and reappear at 0?
        // "Infinite loop list" implies disappear and reappear.

        // Let's try: if angle > 180, angle = 0.
        // To avoid overlap, we need to ensure the "tail" is clear.
        // If we have 6 items spaced by 45, 6*45 = 270.
        // So when item 1 is at 180, item 6 is at 180 - 5*45 = -45.
        // So we can just wrap around a virtual circle of 270+ degrees?
        // Let's just wrap at a specific point.
        // Let's say the cycle length is 360 for simplicity, but we only show 0-180.
        // If angle > 180, we can let it go to 360 (invisible) then wrap to 0?
        // Or just wrap to start of line.

        // Let's try wrapping at 225 (180 + 45) back to -45?
        // If we wrap 225 -> -45, delta is 270.
        // 6 items * 45 = 270. Perfect.

        if (item.angle > 200) {
            item.angle -= 270;
        }

        // Calculate position
        // 0 deg = Right (x=r, z=0) or Front?
        // "Right to left".
        // Standard circle: 0 is Right (x=r). 180 is Left (x=-r).
        // 90 is Top/Back/Front?
        // Let's use standard: x = cos(rad)*r.
        // If 0 is right, x=r.
        // If 180 is left, x=-r.
        // We want them to arc "out" or "in"?
        // Usually 3D carousel arcs "out" towards viewer in the middle.
        // So 90 deg should be closest (z=r).
        // x = cos(rad) * r.
        // z = sin(rad) * r.
        // At 0: x=r, z=0.
        // At 90: x=0, z=r (Front).
        // At 180: x=-r, z=0.
        // This creates a semi-circle arc coming towards the viewer.

        const rad = item.angle * (Math.PI / 180);

        // Adjust projection if needed.
        // Let's try x = cos(angle) * r, z = sin(angle) * r.
        // But wait, usually 0 is "front" in previous code?
        // Previous code: x=sin(rad)*r, z=cos(rad)*r.
        // 0 deg -> x=0, z=r (Front).
        // We want "Right to Left".
        // Right is x > 0. Left is x < 0.
        // So we want to start at x=r (Right) -> angle?
        // If x=sin(angle)*r, then angle=90 gives x=r.
        // If we want 0 to be Right, we can shift the math.
        // Let's stick to "Angle 0 is Right".
        // x = cos(angle) * r. (0->r, 180->-r). Correct.
        // z = sin(angle) * r. (0->0, 90->r, 180->0).
        // So 90 is closest.

        const x = Math.cos(rad) * radiusX;
        const z_depth = Math.sin(rad) * radiusX;

        const scale = 0.6 + ((z_depth + radiusX) / (2 * radiusX)) * 0.6;

        // Opacity
        // "reaching 180 degrees before returning to 0 degrees"
        // "first image will appear from right to left"
        // So visible range is roughly 0 to 180.
        // Fade in at 0? Fade out at 180?
        // Or maybe fade in 0-45, visible 45-135, fade out 135-180?
        // Let's use a simple sine curve for opacity peaking at 90.
        // sin(0)=0, sin(90)=1, sin(180)=0.
        // Perfect.

        let opacity = Math.sin(rad);
        // Clamp
        opacity = Math.max(0, opacity);

        // Only show if within range (roughly)
        if (item.angle < 0 || item.angle > 180) {
            opacity = 0;
        }

        item.el.style.transform = `translate3d(${x}px, 0, ${z_depth}px) scale(${scale})`;
        item.el.style.zIndex = Math.floor(z_depth);
        item.el.style.opacity = opacity;
    });

    requestAnimationFrame(animate);
}

animate();
