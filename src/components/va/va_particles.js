import { useEffect, useRef } from "react";

/**
 * VAThemedParticles - Animated background for Vulnerabilities Assessment page
 * Theme: Dark web, modern, "cyber" with glowing hexagons and flowing lines
 */
export default function VAThemedParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Responsive setup
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Config
    const config = {
      hexCount: 18,
      hexRadius: 40,
      floatSpeed: 0.25,
      glowColor: "rgba(41, 255, 175, 0.5)", // neon green
      glowColor2: "rgba(0, 173, 238, 0.22)", // blue
      coreColor: "#23a9d5", // blue-cyan
      lineColor: "rgba(140, 204, 255, 0.09)",
      gridColor: "rgba(50,55,70,0.11)",
      bgAlpha: 0.13,
      particleCount: 40,
      particleTrail: 0.18,
      particleColor: "#9b59b6",
    };

    // --- Hexagon grid & floaters ---
    function drawHexagon(x, y, radius, color, glow = true) {
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 3 * i - Math.PI / 6;
        ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
      }
      ctx.closePath();
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = radius * 0.9;
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    function drawGlowDot(x, y, r, color) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.shadowColor = color;
      ctx.shadowBlur = r * 5;
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    // --- Data Particles ---
    class StreamParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.pathType = Math.random() > 0.5 ? "curve" : "line";
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = 1.7 + Math.random() * 2.2;
        this.speed = 0.7 + Math.random() * 1.1;
        this.angle = Math.random() * Math.PI * 2;
        this.color =
          Math.random() > 0.5
            ? config.particleColor
            : "rgba(45,255,204,0.8)";
        this.t = Math.random() * Math.PI * 2;
        this.ampl = 16 + Math.random() * 25;
      }
      update() {
        if (this.pathType === "curve") {
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed + Math.cos(this.t) * 0.6;
          this.t += 0.08 + Math.random() * 0.04;
        } else {
          this.x += Math.cos(this.angle) * this.speed;
          this.y += Math.sin(this.angle) * this.speed;
        }
        if (
          this.x < -50 ||
          this.x > width + 50 ||
          this.y < -50 ||
          this.y > height + 50
        )
          this.reset();
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.62;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }
    }

    // --- Hexagon objects ---
    const hexs = [];
    for (let i = 0; i < config.hexCount; i++) {
      const baseX =
        (width / config.hexCount) * (i + 0.7) +
        (Math.random() - 0.5) * 90;
      const baseY =
        (height / 3) +
        (Math.random() - 0.5) * (height / 3.2);
      const floatPhase = Math.random() * Math.PI * 2;
      hexs.push({
        baseX,
        baseY,
        radius: config.hexRadius * (0.85 + Math.random() * 0.3),
        floatPhase,
        floatSpeed: config.floatSpeed * (0.5 + Math.random()),
      });
    }

    // --- Particles ---
    const particles = Array.from(
      { length: config.particleCount },
      () => new StreamParticle()
    );

    // --- Animation loop ---
    let animationFrame;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(13,16,24,${config.bgAlpha})`;
      ctx.fillRect(0, 0, width, height);

      // Draw faint hex grid lines
      for (let x = -config.hexRadius * 2; x < width + 2 * config.hexRadius; x += config.hexRadius * 1.7) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.strokeStyle = config.gridColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      for (let y = -config.hexRadius * 2; y < height + 2 * config.hexRadius; y += config.hexRadius * 1.5) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = config.gridColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw floating hexagons
      for (const h of hexs) {
        const floatY = h.baseY + Math.sin(h.floatPhase) * 16;
        drawHexagon(h.baseX, floatY, h.radius, config.glowColor, true);
        drawGlowDot(h.baseX, floatY, h.radius * 0.36, config.glowColor2);
        h.floatPhase += 0.0065 + Math.random() * 0.002;
      }

      // Draw particles (data streams)
      for (const p of particles) {
        p.update();
        p.draw();
      }

      // Animate
      animationFrame = requestAnimationFrame(animate);
    }
    animate();

    // Responsive resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}