import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useBrandTheme } from '../context/BrandThemeContext';

interface RGB {
  r: number;
  g: number;
  b: number;
}

// Brand color definitions:
// Rich Vibrant Magenta/Purple (Pogo) - Prominent, electric and deep
const PURPLE_CORE: RGB = { r: 192, g: 38, b: 211 };   // #c026d3 (Vivid Magenta)
const PURPLE_BRIGHT: RGB = { r: 232, g: 121, b: 249 }; // #e879f9 (Neon Magenta Glow)
const PURPLE_DEEP: RGB = { r: 134, g: 25, b: 143 };   // #86198f (Deep Plum/Purple)

// Electric Cyan/Blue (RhumbNav)
const BLUE_CORE: RGB = { r: 6, g: 182, b: 212 };      // #06b6d4 (Cyan)
const BLUE_BRIGHT: RGB = { r: 0, g: 242, b: 254 };    // #00f2fe (Electric Cyan)
const BLUE_DEEP: RGB = { r: 14, g: 165, b: 233 };     // #0ea5e9 (Vivid Sky Blue)

function lerpRGB(c1: RGB, c2: RGB, factor: number): RGB {
  const f = Math.max(0, Math.min(1, factor));
  return {
    r: Math.round(c1.r + (c2.r - c1.r) * f),
    g: Math.round(c1.g + (c2.g - c1.g) * f),
    b: Math.round(c1.b + (c2.b - c1.b) * f),
  };
}

function rgbaStr(c: RGB, alpha: number): string {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha.toFixed(3)})`;
}

function hexStr(c: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`;
}

// 2 Contrasting Variations (0 = Purple/Magenta, 1 = Blue/Cyan):
// Variation 0: Blue/Greenish-Cyan background -> Purple/Magenta lines
// Variation 1: Purple/Magenta background -> Blue/Cyan lines
const VARIATIONS = [
  { bgFactor: 1.0, stripFactor: 0.0 }, // Fondo azul/verdoso -> líneas moradas
  { bgFactor: 0.0, stripFactor: 1.0 }, // Fondo morado -> líneas azules
];

function getNextVariationIndex(): number {
  try {
    const stored = sessionStorage.getItem('rhumb_bg_variation');
    const currentIndex = stored !== null ? parseInt(stored, 10) : -1;
    const nextIndex = (currentIndex + 1) % VARIATIONS.length;
    sessionStorage.setItem('rhumb_bg_variation', nextIndex.toString());
    return nextIndex;
  } catch {
    return Math.floor(Math.random() * VARIATIONS.length);
  }
}

export const BrandSmokeCanvas: React.FC = () => {
  const { brandSmokeEnabled } = useBrandTheme();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Pick a variation on load/navigation so each reload/refresh rotates through the 4 variations cleanly
  const variationRef = useRef<number>(getNextVariationIndex());

  const path = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const base = (import.meta.env.BASE_URL || '/').toLowerCase().replace(/\/$/, '');
  const cleanPath = path.startsWith(base) ? path.slice(base.length) || '/' : path;

  // Determine effect theme based on current route
  let routeMode: 'dual' | 'cyan' | 'magenta' | 'legal' = 'dual';

  const isLegalOrDeletionRoute = 
    cleanPath.includes('legal') ||
    cleanPath.includes('privacy') ||
    cleanPath.includes('terms') ||
    cleanPath.includes('delete-account') ||
    cleanPath.includes('data-deletion');

  if (isLegalOrDeletionRoute) {
    routeMode = 'legal';
  } else if (cleanPath === '/rhumbnav') {
    routeMode = 'cyan'; // Dedicated Blue background + Blue strips
  } else if (cleanPath === '/pogo') {
    routeMode = 'magenta'; // Dedicated Purple background + Purple strips
  } else {
    // "Home" (/), "Our Products" (/products), "About" (/about), "Contact" (/contact)
    routeMode = 'dual'; // Alternates between (Blue bg + Purple lines) and (Purple bg + Blue lines)
  }

  // Update variation on path change so navigating or reloading transitions between the variations
  useEffect(() => {
    variationRef.current = getNextVariationIndex();
  }, [cleanPath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let scrollOffset = 0;

    // Floating dust particles
    interface DustParticle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      side: 'left' | 'right';
    }

    const particles: DustParticle[] = [];
    const particleCount = 26;

    for (let i = 0; i < particleCount; i++) {
      const side = Math.random() > 0.5 ? 'left' : 'right';
      particles.push({
        x: side === 'left' 
          ? Math.random() * (window.innerWidth * 0.35) 
          : window.innerWidth * 0.65 + Math.random() * (window.innerWidth * 0.35),
        y: Math.random() * window.innerHeight,
        radius: 1.2 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.15 - Math.random() * 0.35,
        alpha: 0.2 + Math.random() * 0.3,
        side,
      });
    }

    // Render multi-strand flowing cable/ribbon curve
    // Supports 4 variations: Purple bg + Purple strips, Purple bg + Blue strips, Blue bg + Purple strips, Blue bg + Blue strips
    const drawCableStrand = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      side: 'left' | 'right',
      strandIndex: number,
      totalStrands: number,
      t: number,
      scrollY: number,
      stripColorFactor: number,
      opacityScale: number
    ) => {
      ctx.beginPath();

      const numPoints = 20;
      const stepY = (height + 200) / (numPoints - 1);
      const isLeft = side === 'left';

      // Base X offset
      const baseX = isLeft ? width * 0.08 : width * 0.92;
      const maxAmplitude = width * 0.08;

      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < numPoints; i++) {
        const py = -100 + i * stepY;
        const normY = py / height;

        const freq1 = 1.4 + strandIndex * 0.2;
        const freq2 = 2.5 - strandIndex * 0.15;
        const phase1 = t * (0.5 + strandIndex * 0.1) + scrollY * 0.0008;
        const phase2 = t * (0.3 - strandIndex * 0.08) - scrollY * 0.001;

        const wave = Math.sin(normY * Math.PI * freq1 + phase1) * 0.6 +
                     Math.cos(normY * Math.PI * freq2 + phase2) * 0.4;

        const xOffset = wave * maxAmplitude * (0.5 + Math.sin(t * 0.3 + normY) * 0.3);
        const px = baseX + xOffset + (strandIndex - totalStrands / 2) * 8;

        points.push({ x: px, y: py });
      }

      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      if (points.length > 2) {
        ctx.quadraticCurveTo(
          points[points.length - 2].x,
          points[points.length - 2].y,
          points[points.length - 1].x,
          points[points.length - 1].y
        );
      }

      // Determine strand color based on routeMode and stripColorFactor (0 = Purple, 1 = Blue)
      let factor = stripColorFactor;
      if (routeMode === 'cyan') factor = 1.0;
      if (routeMode === 'magenta') factor = 0.0;

      const strandColorCore = lerpRGB(PURPLE_CORE, BLUE_CORE, factor);
      const strandColorBright = lerpRGB(PURPLE_BRIGHT, BLUE_BRIGHT, factor);
      const alphaBase = (0.28 + (strandIndex % 2) * 0.08) * opacityScale;

      // Linear gradient along cable length for smooth aesthetic depth
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, rgbaStr(strandColorBright, alphaBase * 0.9));
      grad.addColorStop(0.5, rgbaStr(strandColorCore, alphaBase * 1.15));
      grad.addColorStop(1, rgbaStr(strandColorBright, alphaBase * 0.85));

      ctx.lineWidth = 2.2 + (strandIndex % 2);
      ctx.strokeStyle = grad;
      ctx.shadowColor = hexStr(strandColorBright);
      ctx.shadowBlur = 10 + (strandIndex % 2) * 4;
      ctx.stroke();
    };

    const drawFrame = (currentT: number, currentScroll: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isDark = document.documentElement.classList.contains('dark');

      ctx.clearRect(0, 0, width, height);

      // Ambient multiplier based on light vs dark mode
      const opacityScale = isDark ? 1.0 : 0.65;
      const isLegal = routeMode === 'legal';
      const legalScale = isLegal ? 0.75 : 1.0;

      // Select the active variation factors (0 = Purple/Magenta, 1 = Blue/Cyan)
      const selectedVariation = VARIATIONS[variationRef.current % VARIATIONS.length];
      const bgFactor = selectedVariation.bgFactor;
      const stripFactor = selectedVariation.stripFactor;

      // Determine background color factor for each side
      let leftBgFactor = bgFactor;
      let rightBgFactor = bgFactor;

      if (routeMode === 'cyan') {
        leftBgFactor = 1.0;
        rightBgFactor = 1.0;
      } else if (routeMode === 'magenta') {
        leftBgFactor = 0.0;
        rightBgFactor = 0.0;
      }

      // Left Side Background Ambient Colors
      const leftBgCore = lerpRGB(PURPLE_DEEP, BLUE_DEEP, leftBgFactor);
      const leftBgOuter = lerpRGB(PURPLE_CORE, BLUE_CORE, leftBgFactor);

      // Right Side Background Ambient Colors
      const rightBgCore = lerpRGB(PURPLE_CORE, BLUE_CORE, rightBgFactor);
      const rightBgOuter = lerpRGB(PURPLE_BRIGHT, BLUE_BRIGHT, rightBgFactor);

      // 1. Left Side Top Ambient Glow
      const leftShiftY = brandSmokeEnabled ? Math.sin(currentT * 0.5) * 35 : 0;
      const gradLeftTop = ctx.createRadialGradient(
        width * 0.05,
        height * 0.32 + leftShiftY,
        5,
        width * 0.05,
        height * 0.32,
        width * 0.45
      );
      gradLeftTop.addColorStop(0, rgbaStr(leftBgCore, 0.22 * opacityScale * legalScale));
      gradLeftTop.addColorStop(0.55, rgbaStr(leftBgOuter, 0.08 * opacityScale * legalScale));
      gradLeftTop.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradLeftTop;
      ctx.fillRect(0, 0, width, height);

      // 2. Left Side Bottom Ambient Glow
      if (routeMode === 'dual' || routeMode === 'legal') {
        const leftBottomShiftY = brandSmokeEnabled ? Math.cos(currentT * 0.5) * 35 : 0;
        const gradLeftBottom = ctx.createRadialGradient(
          width * 0.08,
          height * 0.78 + leftBottomShiftY,
          5,
          width * 0.08,
          height * 0.78,
          width * 0.45
        );
        gradLeftBottom.addColorStop(0, rgbaStr(leftBgCore, 0.18 * opacityScale * legalScale));
        gradLeftBottom.addColorStop(0.55, rgbaStr(leftBgOuter, 0.06 * opacityScale * legalScale));
        gradLeftBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradLeftBottom;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Right Side Top Ambient Glow
      const rightShiftY = brandSmokeEnabled ? Math.cos(currentT * 0.5) * 35 : 0;
      const gradRightTop = ctx.createRadialGradient(
        width * 0.94,
        height * 0.32 + rightShiftY,
        5,
        width * 0.94,
        height * 0.32,
        width * 0.48
      );
      gradRightTop.addColorStop(0, rgbaStr(rightBgCore, 0.20 * opacityScale * legalScale));
      gradRightTop.addColorStop(0.55, rgbaStr(rightBgOuter, 0.08 * opacityScale * legalScale));
      gradRightTop.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradRightTop;
      ctx.fillRect(0, 0, width, height);

      // 4. Right Side Bottom Ambient Glow
      if (routeMode === 'dual' || routeMode === 'legal') {
        const rightBottomShiftY = brandSmokeEnabled ? Math.sin(currentT * 0.5) * 35 : 0;
        const gradRightBottom = ctx.createRadialGradient(
          width * 0.90,
          height * 0.80 + rightBottomShiftY,
          5,
          width * 0.90,
          height * 0.80,
          width * 0.45
        );
        gradRightBottom.addColorStop(0, rgbaStr(rightBgCore, 0.16 * opacityScale * legalScale));
        gradRightBottom.addColorStop(0.55, rgbaStr(rightBgOuter, 0.05 * opacityScale * legalScale));
        gradRightBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradRightBottom;
        ctx.fillRect(0, 0, width, height);
      }

      // 5. Cable Ribbon Strands & Floating Ambient Dust
      if (brandSmokeEnabled && routeMode !== 'legal') {
        const totalStrands = 3;
        for (let i = 0; i < totalStrands; i++) {
          drawCableStrand(ctx, width, height, 'left', i, totalStrands, currentT, currentScroll, stripFactor, opacityScale);
          drawCableStrand(ctx, width, height, 'right', i, totalStrands, currentT, currentScroll, stripFactor, opacityScale);
        }

        // Floating ambient dust particles
        for (const p of particles) {
          p.y += p.vy;
          p.x += p.vx + Math.sin(currentT + p.y * 0.01) * 0.2;

          if (p.y < -20) {
            p.y = height + 20;
            p.x = p.side === 'left'
              ? Math.random() * (width * 0.35)
              : width * 0.65 + Math.random() * (width * 0.35);
          }

          let pFactor = stripFactor;
          if (routeMode === 'cyan') pFactor = 1.0;
          if (routeMode === 'magenta') pFactor = 0.0;

          const pColorRGB = lerpRGB(PURPLE_BRIGHT, BLUE_BRIGHT, pFactor);
          const pColorHex = hexStr(pColorRGB);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = pColorHex;
          ctx.globalAlpha = p.alpha * (0.7 + Math.sin(currentT * 1.5 + p.y) * 0.3) * opacityScale;
          ctx.shadowColor = pColorHex;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }
    };

    const handleScroll = () => {
      scrollOffset = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      drawFrame(time, window.scrollY || 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Watch for dark/light mode class changes on <html>
    const observer = new MutationObserver(() => {
      drawFrame(time, window.scrollY || 0);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (brandSmokeEnabled) {
      let lastTimestamp = performance.now();
      const render = (now: number) => {
        const delta = Math.min((now - lastTimestamp) / 1000, 0.1);
        lastTimestamp = now;
        time += delta;
        drawFrame(time, scrollOffset);
        animationFrameId = requestAnimationFrame(render);
      };
      animationFrameId = requestAnimationFrame(render);
    } else {
      drawFrame(0, 0);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resize);
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [brandSmokeEnabled, routeMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};



