import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useBrandTheme } from '../context/BrandThemeContext';

export const BrandSmokeCanvas: React.FC = () => {
  const { brandSmokeEnabled } = useBrandTheme();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const path = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  const base = (import.meta.env.BASE_URL || '/').toLowerCase().replace(/\/$/, '');
  const cleanPath = path.startsWith(base) ? path.slice(base.length) || '/' : path;

  // Determine effect theme based on current route
  let routeMode: 'dual' | 'products' | 'cyan' | 'magenta' | 'legal' = 'dual';

  const isLegalOrDeletionRoute = 
    cleanPath.includes('legal') ||
    cleanPath.includes('privacy') ||
    cleanPath.includes('terms') ||
    cleanPath.includes('delete-account') ||
    cleanPath.includes('data-deletion');

  if (isLegalOrDeletionRoute) {
    routeMode = 'legal';
  } else if (cleanPath === '/products') {
    routeMode = 'products'; // Left Cyan (RhumbNav), Right Magenta (Pogo)
  } else if (cleanPath === '/rhumbnav') {
    routeMode = 'cyan'; // Electric Cyan Nebula
  } else if (cleanPath === '/pogo') {
    routeMode = 'magenta'; // Deep Magenta/Plum Nebula
  } else {
    routeMode = 'dual'; // Magenta & Cyan dual glow (Home, Contact, About)
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let scrollOffset = 0;

    // Floating dust particles (only animated when brandSmokeEnabled is true)
    interface DustParticle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      side: 'left' | 'right';
    }

    const particles: DustParticle[] = [];
    const particleCount = 26;

    for (let i = 0; i < particleCount; i++) {
      const side = Math.random() > 0.5 ? 'left' : 'right';
      
      let particleColor = side === 'left' ? '#86198f' : '#00f2fe';
      if (routeMode === 'cyan') particleColor = '#00f2fe';
      if (routeMode === 'magenta') particleColor = '#a21caf';
      if (routeMode === 'products') particleColor = side === 'left' ? '#00f2fe' : '#86198f';

      particles.push({
        x: side === 'left' 
          ? Math.random() * (window.innerWidth * 0.35) 
          : window.innerWidth * 0.65 + Math.random() * (window.innerWidth * 0.35),
        y: Math.random() * window.innerHeight,
        radius: 1 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.15 - Math.random() * 0.35,
        alpha: 0.15 + Math.random() * 0.3,
        color: particleColor,
        side,
      });
    }

    // Render multi-strand flowing cable/ribbon curve
    const drawCableStrand = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      side: 'left' | 'right',
      strandIndex: number,
      totalStrands: number,
      t: number,
      scrollY: number
    ) => {
      ctx.beginPath();

      const numPoints = 20;
      const stepY = (height + 200) / (numPoints - 1);
      const isLeft = side === 'left';

      // Base X offset
      const baseX = isLeft ? width * 0.08 : width * 0.92;
      const maxAmplitude = width * 0.08;

      const magentaColors = [
        'rgba(168, 85, 247, 0.22)',
        'rgba(134, 25, 143, 0.20)',
        'rgba(192, 38, 211, 0.18)',
        'rgba(112, 26, 117, 0.15)'
      ];

      const cyanColors = [
        'rgba(0, 242, 254, 0.28)',
        'rgba(6, 182, 212, 0.25)',
        'rgba(56, 189, 248, 0.22)',
        'rgba(14, 165, 233, 0.18)'
      ];

      let strokeColor = '';
      if (routeMode === 'cyan') {
        strokeColor = cyanColors[strandIndex % cyanColors.length];
      } else if (routeMode === 'magenta') {
        strokeColor = magentaColors[strandIndex % magentaColors.length];
      } else if (routeMode === 'products') {
        strokeColor = isLeft
          ? cyanColors[strandIndex % cyanColors.length]
          : 'rgba(134, 25, 143, 0.16)';
      } else {
        strokeColor = isLeft
          ? magentaColors[strandIndex % magentaColors.length]
          : cyanColors[strandIndex % cyanColors.length];
      }

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

      ctx.lineWidth = 2.0 + (strandIndex % 2);
      ctx.strokeStyle = strokeColor;
      
      const isCyanStrand = routeMode === 'cyan' || 
        (routeMode === 'dual' && !isLeft) || 
        (routeMode === 'products' && isLeft);
      ctx.shadowColor = isCyanStrand ? '#00f2fe' : '#a855f7';
      ctx.shadowBlur = isCyanStrand ? 12 : 6;
      ctx.stroke();
    };

    const drawFrame = (currentT: number, currentScroll: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isDark = document.documentElement.classList.contains('dark');

      ctx.clearRect(0, 0, width, height);

      // Ambient multiplier based on light vs dark mode
      const opacityScale = isDark ? 1.0 : 0.6;
      const isLegal = routeMode === 'legal';
      const legalScale = isLegal ? 0.75 : 1.0;

      // 1. Left Side Top Ambient Glow
      const isLeftCyan = routeMode === 'cyan';
      const leftShiftY = brandSmokeEnabled ? Math.sin(currentT * 0.5) * 35 : 0;
      
      const gradLeftTop = ctx.createRadialGradient(
        width * 0.05,
        height * 0.32 + leftShiftY,
        5,
        width * 0.05,
        height * 0.32,
        width * 0.44
      );

      if (isLeftCyan) {
        gradLeftTop.addColorStop(0, `rgba(6, 182, 212, ${0.16 * opacityScale * legalScale})`);
        gradLeftTop.addColorStop(0.6, `rgba(0, 242, 254, ${0.05 * opacityScale * legalScale})`);
      } else {
        gradLeftTop.addColorStop(0, `rgba(112, 26, 117, ${0.16 * opacityScale * legalScale})`);
        gradLeftTop.addColorStop(0.6, `rgba(147, 51, 234, ${0.05 * opacityScale * legalScale})`);
      }
      gradLeftTop.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradLeftTop;
      ctx.fillRect(0, 0, width, height);

      // 2. Left Side Bottom Ambient Glow (Dual contrast across whole scroll/page)
      if (routeMode === 'dual' || routeMode === 'legal' || routeMode === 'products') {
        const leftBottomShiftY = brandSmokeEnabled ? Math.cos(currentT * 0.5) * 35 : 0;
        const gradLeftBottom = ctx.createRadialGradient(
          width * 0.08,
          height * 0.78 + leftBottomShiftY,
          5,
          width * 0.08,
          height * 0.78,
          width * 0.45
        );
        gradLeftBottom.addColorStop(0, `rgba(6, 182, 212, ${0.13 * opacityScale * legalScale})`);
        gradLeftBottom.addColorStop(0.6, `rgba(0, 242, 254, ${0.04 * opacityScale * legalScale})`);
        gradLeftBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradLeftBottom;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Right Side Top Ambient Glow
      const isRightMagenta = routeMode === 'magenta';
      const isRightProducts = routeMode === 'products';
      const rightShiftY = brandSmokeEnabled ? Math.cos(currentT * 0.5) * 35 : 0;

      const gradRightTop = ctx.createRadialGradient(
        width * 0.94,
        height * 0.32 + rightShiftY,
        5,
        width * 0.94,
        height * 0.32,
        width * 0.48
      );

      if (isRightProducts || isRightMagenta) {
        gradRightTop.addColorStop(0, `rgba(134, 25, 143, ${0.15 * opacityScale * legalScale})`);
        gradRightTop.addColorStop(0.6, `rgba(168, 85, 247, ${0.05 * opacityScale * legalScale})`);
      } else {
        gradRightTop.addColorStop(0, `rgba(14, 165, 233, ${0.16 * opacityScale * legalScale})`);
        gradRightTop.addColorStop(0.6, `rgba(56, 189, 248, ${0.05 * opacityScale * legalScale})`);
      }
      gradRightTop.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradRightTop;
      ctx.fillRect(0, 0, width, height);

      // 4. Right Side Bottom Ambient Glow (Balance across full page height)
      if (routeMode === 'dual' || routeMode === 'legal' || routeMode === 'products') {
        const rightBottomShiftY = brandSmokeEnabled ? Math.sin(currentT * 0.5) * 35 : 0;
        const gradRightBottom = ctx.createRadialGradient(
          width * 0.90,
          height * 0.80 + rightBottomShiftY,
          5,
          width * 0.90,
          height * 0.80,
          width * 0.45
        );
        gradRightBottom.addColorStop(0, `rgba(134, 25, 143, ${0.11 * opacityScale * legalScale})`);
        gradRightBottom.addColorStop(0.6, `rgba(168, 85, 247, ${0.04 * opacityScale * legalScale})`);
        gradRightBottom.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradRightBottom;
        ctx.fillRect(0, 0, width, height);
      }

      // If FX animation is enabled, render animated cables and particles on top
      if (brandSmokeEnabled && routeMode !== 'legal') {
        const totalStrands = 3;
        for (let i = 0; i < totalStrands; i++) {
          drawCableStrand(ctx, width, height, 'left', i, totalStrands, currentT, currentScroll);
          drawCableStrand(ctx, width, height, 'right', i, totalStrands, currentT, currentScroll);
        }

        for (const p of particles) {
          p.y += p.vy;
          p.x += p.vx + Math.sin(currentT + p.y * 0.01) * 0.2;

          if (p.y < -20) {
            p.y = height + 20;
            p.x = p.side === 'left'
              ? Math.random() * (width * 0.35)
              : width * 0.65 + Math.random() * (width * 0.35);
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha * (0.6 + Math.sin(currentT * 1.5 + p.y) * 0.35);
          ctx.shadowColor = p.color;
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
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      if (!brandSmokeEnabled) {
        drawFrame(0, 0);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Watch for dark/light mode class changes on <html>
    const observer = new MutationObserver(() => {
      if (!brandSmokeEnabled) {
        drawFrame(0, 0);
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (brandSmokeEnabled) {
      const render = () => {
        time += 0.009;
        drawFrame(time, scrollOffset);
        animationFrameId = requestAnimationFrame(render);
      };
      render();
    } else {
      // Draw stationary static background immediately
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


