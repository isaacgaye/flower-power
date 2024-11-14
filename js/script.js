        const canvas = document.getElementById('flowerCanvas');
        const ctx = canvas.getContext('2d');
        const size = 2000;
        canvas.width = size;
        canvas.height = size;
        
        let scale = 1, offsetX = 0, offsetY = 0, isDragging = false, lastX = 0, lastY = 0;
        let isAnimating = false, currentGeneration = 0, animationFrameId = null;
        let flowers = [];
        let savedPatterns = [];
        let currentColorPalette = null;

        class Flower {
            constructor(x, y, generation, color) {
                this.x = x;
                this.y = y;
                this.generation = generation;
                this.color = color;
                this.radius = 5;
                this.alpha = 0;
            }

            draw() {
                const screenX = this.x * scale + offsetX;
                const screenY = this.y * scale + offsetY;
                ctx.beginPath();
                ctx.arc(screenX, screenY, this.radius * scale, 0, Math.PI * 2);
                ctx.fillStyle = this.color.replace('1)', `${this.alpha})`);
                ctx.fill();
                ctx.strokeStyle = `rgba(0,0,0,${this.alpha * 0.2})`;
                ctx.stroke();
            }
        }

        function resizeCanvasContainer() {
            const container = canvas.parentElement;
            container.style.width = '100%';
            container.style.height = '600px';
            container.style.position = 'relative';
        }
        resizeCanvasContainer();

        ['petals', 'distance', 'generations', 'wind'].forEach(id => {
            const input = document.getElementById(id);
            const valueSpan = document.getElementById(`${id}Value`);
            input.addEventListener('input', () => valueSpan.textContent = input.value);
        });

        function hexToRgb(hex) {
            hex = hex.replace(/^#/, '');
            if(hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            const bigint = parseInt(hex, 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        }

        function interpolateColors(color1, color2, factor) {
            const rgb1 = hexToRgb(color1);
            const rgb2 = hexToRgb(color2);
            return `rgb(${
                Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor)},${
                Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor)},${
                Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor)
            })`;
        }

        function getColorFromPalette(ratio) {
            if (!currentColorPalette) return `hsla(${ratio * 300}, 100%, 50%, 1)`;
            
            const colors = currentColorPalette;
            const position = ratio * (colors.length - 1);
            const index = Math.floor(position);
            
            if (index >= colors.length - 1) return `#${colors[colors.length - 1]}`;
            
            return interpolateColors(
                `#${colors[index]}`,
                `#${colors[index + 1]}`,
                position - index
            );
        }

        function updateColorPreview() {
            const preview = document.getElementById('colorPreview');
            preview.innerHTML = '';
            
            if (currentColorPalette) {
                currentColorPalette.forEach(color => {
                    const div = document.createElement('div');
                    div.style.backgroundColor = `#${color}`;
                    preview.appendChild(div);
                });
            } else {
                const div = document.createElement('div');
                div.style.background = 'linear-gradient(to right, hsl(0,100%,50%), hsl(300,100%,50%))';
                preview.appendChild(div);
            }
        }

        function gaussianRandom(mean = 0, std = 1) {
            let u = 0, v = 0;
            while (u === 0) u = Math.random();
            while (v === 0) v = Math.random();
            return mean + (Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v)) * std;
        }

        function generateFlowers(animate = false) {
            if (isAnimating) cancelAnimationFrame(animationFrameId);
            
            const P = parseInt(document.getElementById('petals').value);
            const SD = parseFloat(document.getElementById('distance').value) * 50;
            const G = parseInt(document.getElementById('generations').value);
            const W = parseInt(document.getElementById('wind').value);
            const center = size / 2;
            
            flowers = [new Flower(center, center, 0, currentColorPalette ? `#${currentColorPalette[0]}` : 'hsl(0, 100%, 50%)')];
            if (!animate) flowers[0].alpha = 1;

            for (let g = 0; g < G; g++) {
                const parentFlowers = flowers.filter(f => f.generation === g);
                for (const parent of parentFlowers) {
                    for (let p = 0; p < P; p++) {
                        const baseAngle = (2 * Math.PI * p) / P;
                        const angle = baseAngle + gaussianRandom(0, (Math.PI / P) * (W / 100));
                        const distance = SD + gaussianRandom(0, SD * 0.2 * (W / 100));
                        const newX = parent.x + Math.cos(angle) * distance;
                        const newY = parent.y + Math.sin(angle) * distance;
                        
                        if (newX < 0 || newX > size || newY < 0 || newY > size) continue;
                        
                        const distFromCenter = Math.sqrt((newX - center) ** 2 + (newY - center) ** 2);
                        const colorRatio = distFromCenter / (Math.sqrt(2) * size / 2);
                        const flower = new Flower(newX, newY, g + 1, getColorFromPalette(colorRatio));
                        if (!animate) flower.alpha = 1;
                        flowers.push(flower);
                    }
                }
            }

            if (animate) startAnimation();
            else redraw();
        }

        function startAnimation() {
            isAnimating = true;
            currentGeneration = 0;
            animateNextGeneration();
        }

        function animateNextGeneration() {
            if (!isAnimating) return;
            const currentFlowers = flowers.filter(f => f.generation === currentGeneration);
            let progress = 0;
            
            function animate() {
                if (!isAnimating) return;
                if (progress >= 1) {
                    currentGeneration++;
                    if (currentGeneration <= parseInt(document.getElementById('generations').value)) {
                        animateNextGeneration();
                    } else {
                        isAnimating = false;
                    }
                    return;
                }
                progress += 0.05;
                currentFlowers.forEach(flower => flower.alpha = progress);
                redraw();
                animationFrameId = requestAnimationFrame(animate);
            }
            animate();
        }

        function redraw() {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
            flowers.forEach(flower => flower.draw());
        }

        // Event Listeners
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const x = (mouseX / rect.width) * canvas.width;
            const y = (mouseY / rect.height) * canvas.height;
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = scale * zoomFactor;
            if (newScale >= 0.1 && newScale <= 5) {
                offsetX = offsetX * zoomFactor - (x * (zoomFactor - 1));
                offsetY = offsetY * zoomFactor - (y * (zoomFactor - 1));
                scale = newScale;
                document.getElementById('zoomLevel').textContent = Math.round(scale * 100);
                redraw();
            }
        });

        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                offsetX += dx / scale;
                offsetY += dy / scale;
                lastX = e.clientX;
                lastY = e.clientY;
                redraw();
            }
        });

        canvas.addEventListener('mouseup', () => isDragging = false);
        canvas.addEventListener('mouseleave', () => isDragging = false);

        document.getElementById('resetView').addEventListener('click', () => {
            scale = 1;
            offsetX = 0;
            offsetY = 0;
            document.getElementById('zoomLevel').textContent = '100';
            redraw();
        });

        document.getElementById('animate').addEventListener('click', () => {
            isAnimating = false;
            setTimeout(() => generateFlowers(true), 100);
        });

        document.getElementById('regenerate').addEventListener('click', () => {
            isAnimating = false;
            generateFlowers(false);
        });

        document.getElementById('updateColors').addEventListener('click', () => {
            const input = document.getElementById('colorPalette').value.trim();
            currentColorPalette = input ? input.split(',') : null;
            updateColorPreview();
            generateFlowers(false);
        });

        document.getElementById('saveImage').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'flower-power-pattern.png';
            link.href = canvas.toDataURL();
            link.click();
        });

        updateColorPreview();
        generateFlowers();