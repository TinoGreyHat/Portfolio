import { useEffect, useRef, useState } from 'react';

const MATRIX_CHARS = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';

export default function NetworkBackground() {
  const canvasRef = useRef(null);
  const [bgMode, setBgMode] = useState(() => {
    try {
      return localStorage.getItem('tinogreyhat_bg_mode') || 'network';
    } catch {
      return 'network';
    }
  });

  useEffect(() => {
    const handleToggle = () => {
      setBgMode((prev) => {
        const next = prev === 'network' ? 'matrix' : 'network';
        try {
          localStorage.setItem('tinogreyhat_bg_mode', next);
        } catch { /* ignore */ }
        return next;
      });
    };

    window.addEventListener('toggle-matrix-bg', handleToggle);
    return () => window.removeEventListener('toggle-matrix-bg', handleToggle);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId;

    if (bgMode === 'network') {
      // --- PARTICLE NETWORK MODE ---
      let points = [];

      const createPoints = () => {
        const numPoints = Math.floor((width * height) / 18000);
        points = [];
        for (let i = 0; i < numPoints; i++) {
          points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
          });
        }
      };

      const resize = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createPoints();
      };

      const drawNetwork = () => {
        ctx.clearRect(0, 0, width, height);

        // Get computed accent color from CSS
        const accent = getComputedStyle(document.documentElement)
          .getPropertyValue('--accent')
          .trim() || '#00e89b';

        ctx.fillStyle = accent;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 0.8;

        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Draw point
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Draw connections
          for (let j = i + 1; j < points.length; j++) {
            const p2 = points[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              ctx.globalAlpha = (1 - dist / 110) * 0.12;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
        animationFrameId = requestAnimationFrame(drawNetwork);
      };

      window.addEventListener('resize', resize);
      resize();
      drawNetwork();

      return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
      };
    } else {
      // --- MATRIX RAIN MODE ---
      const fontSize = 14;
      let columns = Math.floor(width / fontSize);
      let drops = new Array(columns).fill(1);

      const resizeMatrix = () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = new Array(columns).fill(1);
      };

      const drawMatrix = () => {
        // Get computed background color for trail
        const bgColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--bg-cyber')
          .trim() || '#05070c';
        // Convert to rgba for trail effect
        const trailColor = bgColor.startsWith('#')
          ? `rgba(${parseInt(bgColor.slice(1,3),16)}, ${parseInt(bgColor.slice(3,5),16)}, ${parseInt(bgColor.slice(5,7),16)}, 0.08)`
          : 'rgba(5, 7, 12, 0.08)';

        ctx.fillStyle = trailColor;
        ctx.fillRect(0, 0, width, height);

        const accent = getComputedStyle(document.documentElement)
          .getPropertyValue('--accent')
          .trim() || '#00e89b';

        ctx.fillStyle = accent;
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillText(char, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
        animationFrameId = requestAnimationFrame(drawMatrix);
      };

      window.addEventListener('resize', resizeMatrix);
      resizeMatrix();
      drawMatrix();

      return () => {
        window.removeEventListener('resize', resizeMatrix);
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [bgMode]);

  return <canvas ref={canvasRef} id="network-bg" />;
}
