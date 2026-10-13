import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, RotateCcw, 
  Ruler, Eye, Layers, Crosshair, 
  AlertTriangle, ShieldAlert, Sparkles
} from 'lucide-react';
import { BlueprintDataset, DefectAnnotation, CadEntity } from '../types';

interface CadViewerProps {
  dataset: BlueprintDataset;
  selectedDefectId: string | null;
  onSelectDefect: (defectId: string) => void;
  activeLayers: Record<string, boolean>;
  onToggleLayer: (layer: string) => void;
}

export const CadViewer: React.FC<CadViewerProps> = ({
  dataset,
  selectedDefectId,
  onSelectDefect,
  activeLayers,
  onToggleLayer,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Viewport transforms (pan & zoom)
  const [scale, setScale] = useState<number>(0.85);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Measurement Tool State
  const [measureMode, setMeasureMode] = useState<boolean>(false);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null);
  const [measureCurrent, setMeasureCurrent] = useState<{ x: number; y: number } | null>(null);

  // Crosshair coordinate HUD
  const [cursorCoord, setCursorCoord] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredDefectId, setHoveredDefectId] = useState<string | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'blueprint' | 'matrix' | 'monochrome'>('blueprint');

  // Animation frame ref for smooth camera fly-to
  const animRef = useRef<number | null>(null);

  // Center & Fit canvas
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const dw = dataset.dimensions.width;
    const dh = dataset.dimensions.height;

    const scaleX = (clientWidth - 80) / dw;
    const scaleY = (clientHeight - 80) / dh;
    const newScale = Math.min(scaleX, scaleY, 1.2);

    const newOffsetX = (clientWidth - dw * newScale) / 2;
    const newOffsetY = (clientHeight - dh * newScale) / 2;

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  }, [dataset.dimensions]);

  useEffect(() => {
    fitToScreen();
  }, [dataset.id, fitToScreen]);

  // Smooth camera fly-to when selected defect changes
  const animateToDefect = useCallback((defect: DefectAnnotation) => {
    if (!containerRef.current) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const { clientWidth, clientHeight } = containerRef.current;
    const targetScale = 1.6; // High-detail inspection zoom
    const defCenterX = defect.boundingBox.x + defect.boundingBox.width / 2;
    const defCenterY = defect.boundingBox.y + defect.boundingBox.height / 2;

    const targetOffsetX = clientWidth / 2 - defCenterX * targetScale;
    const targetOffsetY = clientHeight / 2 - defCenterY * targetScale;

    const startScale = scale;
    const startOffsetX = offset.x;
    const startOffsetY = offset.y;
    const startTime = performance.now();
    const duration = 650; // ms

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);

      const curScale = startScale + (targetScale - startScale) * eased;
      const curOffX = startOffsetX + (targetOffsetX - startOffsetX) * eased;
      const curOffY = startOffsetY + (targetOffsetY - startOffsetY) * eased;

      setScale(curScale);
      setOffset({ x: curOffX, y: curOffY });

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      }
    };

    animRef.current = requestAnimationFrame(step);
  }, [scale, offset]);

  useEffect(() => {
    if (!selectedDefectId) return;
    const defect = dataset.defects.find(d => d.id === selectedDefectId);
    if (defect) {
      animateToDefect(defect);
    }
  }, [selectedDefectId, dataset.defects, animateToDefect]);

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.2), 5.0);

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Zoom centered on cursor
    const newOffsetX = mouseX - (mouseX - offset.x) * (newScale / scale);
    const newOffsetY = mouseY - (mouseY - offset.y) * (newScale / scale);

    setScale(newScale);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  // Convert canvas pixel distance to real-world units
  const pixelsToRealWorld = (px: number) => {
    const scaleRatio = dataset.dimensions.realWidthMm / dataset.dimensions.width;
    const realMm = Math.round(px * scaleRatio);
    const feet = (realMm / 304.8).toFixed(1);
    return `${realMm.toLocaleString()} mm (${feet} ft)`;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && measureMode) {
      // Measurement tool start
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const canvasX = (e.clientX - rect.left - offset.x) / scale;
      const canvasY = (e.clientY - rect.top - offset.y) / scale;
      if (!measureStart) {
        setMeasureStart({ x: canvasX, y: canvasY });
        setMeasureCurrent({ x: canvasX, y: canvasY });
      } else {
        // Measurement finished
        setMeasureStart(null);
        setMeasureCurrent(null);
      }
      return;
    }

    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const canvasX = (e.clientX - rect.left - offset.x) / scale;
      const canvasY = (e.clientY - rect.top - offset.y) / scale;
      
      const realRatio = dataset.dimensions.realWidthMm / dataset.dimensions.width;
      setCursorCoord({
        x: Math.round(canvasX * realRatio),
        y: Math.round(canvasY * realRatio)
      });

      if (measureMode && measureStart) {
        setMeasureCurrent({ x: canvasX, y: canvasY });
      }

      // Check hovered defect
      if (activeLayers['DEFECTS']) {
        const hovered = (dataset.defects || []).find(d => {
          const box = d.boundingBox || (d as any).bounds;
          if (!box) return false;
          const { x, y, width, height } = box;
          return canvasX >= x && canvasX <= x + width && canvasY >= y && canvasY <= y + height;
        });
        setHoveredDefectId(hovered ? hovered.id : null);
      }
    }

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Canvas Click to Select Defect
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (measureMode) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const canvasX = (e.clientX - rect.left - offset.x) / scale;
    const canvasY = (e.clientY - rect.top - offset.y) / scale;

    const clickedDefect = (dataset.defects || []).find(d => {
      const box = d.boundingBox || (d as any).bounds;
      if (!box) return false;
      const { x, y, width, height } = box;
      return canvasX >= x && canvasX <= x + width && canvasY >= y && canvasY <= y + height;
    });

    if (clickedDefect) {
      onSelectDefect(clickedDefect.id);
    }
  };

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear background
    const bgColors = {
      blueprint: '#090e1c',
      matrix: '#06130d',
      monochrome: '#11141a',
    };
    ctx.fillStyle = bgColors[themeMode];
    ctx.fillRect(0, 0, width, height);

    // Apply viewport transformation
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // 1. Draw Architectural Drawing Sheet Border
    ctx.strokeStyle = themeMode === 'blueprint' ? '#1e293b' : '#1e3a29';
    ctx.lineWidth = 2 / scale;
    ctx.strokeRect(60, 40, dataset.dimensions.width - 120, dataset.dimensions.height - 80);

    // Drawing Title Block Box in Bottom Right
    const tbX = dataset.dimensions.width - 440;
    const tbY = dataset.dimensions.height - 180;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(tbX, tbY, 360, 120);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5 / scale;
    ctx.strokeRect(tbX, tbY, 360, 120);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 13px JetBrains Mono';
    ctx.fillText(`PROJECT: ${dataset.name.toUpperCase()}`, tbX + 14, tbY + 28);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px JetBrains Mono';
    ctx.fillText(`CAD FILE: ${dataset.filename}`, tbX + 14, tbY + 52);
    ctx.fillText(`SCALE: ${dataset.dimensions.scaleLabel}`, tbX + 14, tbY + 74);
    ctx.fillText(`DISCIPLINE: HEALTHCARE ARCH / MEP / LIFE-SAFETY`, tbX + 14, tbY + 96);

    // 2. Draw Custom Uploaded Blueprint Image (if any)
    if (dataset.customImageUrl) {
      const img = new Image();
      img.src = dataset.customImageUrl;
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 100, 80, dataset.dimensions.width - 200, dataset.dimensions.height - 160);
      } else {
        img.onload = () => {
          // Trigger canvas repaint when image finishes loading
          const c = canvasRef.current;
          if (c) {
            const context = c.getContext('2d');
            if (context) {
              context.save();
              context.translate(offset.x, offset.y);
              context.scale(scale, scale);
              context.drawImage(img, 100, 80, dataset.dimensions.width - 200, dataset.dimensions.height - 160);
              context.restore();
            }
          }
        };
      }
    }

    // 3. Render CAD Vector Entities
    (dataset.cadEntities || []).forEach(ent => {
      // Check layer visibility
      if (ent.layer === 'A-WALL' && !activeLayers['A-WALL']) return;
      if (ent.layer === 'A-ROOM' && !activeLayers['A-ROOM']) return;
      if (ent.layer === 'A-DOOR' && !activeLayers['A-DOOR']) return;
      if ((ent.layer === 'E-EQUIP' || ent.layer === 'A-RACK' || ent.layer === 'A-FURN') && !activeLayers['EQUIPMENT']) return;

      if (ent.type === 'wall' && ent.x2 !== undefined && ent.y2 !== undefined) {
        ctx.beginPath();
        ctx.moveTo(ent.x, ent.y);
        ctx.lineTo(ent.x2, ent.y2);
        ctx.strokeStyle = themeMode === 'blueprint' ? '#38bdf8' : themeMode === 'matrix' ? '#10b981' : '#cbd5e1';
        ctx.lineWidth = 6;
        ctx.lineCap = 'square';
        ctx.stroke();

        // Inner core line
        ctx.beginPath();
        ctx.moveTo(ent.x, ent.y);
        ctx.lineTo(ent.x2, ent.y2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      if (ent.type === 'room' && ent.width && ent.height) {
        // Room boundary wash
        ctx.fillStyle = 'rgba(56, 189, 248, 0.03)';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);

        // Room label
        if (ent.label) {
          ctx.fillStyle = '#67e8f9';
          ctx.font = 'bold 12px Inter';
          ctx.textAlign = 'center';
          ctx.fillText(ent.label, ent.x + ent.width / 2, ent.y + ent.height / 2);
          ctx.textAlign = 'start';
        }
      }

      if (ent.type === 'equipment' && ent.width && ent.height) {
        ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);

        // Diagonal cross to denote equipment block
        ctx.beginPath();
        ctx.moveTo(ent.x, ent.y);
        ctx.lineTo(ent.x + ent.width, ent.y + ent.height);
        ctx.moveTo(ent.x + ent.width, ent.y);
        ctx.lineTo(ent.x, ent.y + ent.height);
        ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)';
        ctx.stroke();

        if (ent.label) {
          ctx.fillStyle = '#c7d2fe';
          ctx.font = '10px JetBrains Mono';
          ctx.fillText(ent.label, ent.x + 6, ent.y + ent.height / 2 + 4);
        }
      }

      if (ent.type === 'bed' && ent.width && ent.height) {
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);
        ctx.fillStyle = 'rgba(0, 229, 255, 0.1)';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        // Pillow indicator
        ctx.strokeRect(ent.x + 8, ent.y + 6, ent.width - 16, 22);

        if (ent.label) {
          ctx.fillStyle = '#94a3b8';
          ctx.font = '9px JetBrains Mono';
          ctx.fillText(ent.label, ent.x + 10, ent.y + ent.height - 12);
        }
      }

      if (ent.type === 'sink' && ent.width && ent.height) {
        // Stainless Steel Prep Sink
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);

        // Double Basins
        const bw = (ent.width - 24) / 2;
        const bh = ent.height - 16;
        [0, 1].forEach(i => {
          const bx = ent.x + 8 + i * (bw + 8);
          const by = ent.y + 8;
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, bw, bh);
          // Drain circle
          ctx.beginPath();
          ctx.arc(bx + bw / 2, by + bh / 2, 4, 0, Math.PI * 2);
          ctx.strokeStyle = '#00e5ff';
          ctx.stroke();
        });

        if (ent.label) {
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 9px JetBrains Mono';
          ctx.fillText(ent.label, ent.x + 6, ent.y - 4);
        }
        if (ent.subDetails) {
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 8px JetBrains Mono';
          ctx.fillText(ent.subDetails, ent.x + 6, ent.y + ent.height + 11);
        }
      }

      if (ent.type === 'fryer' && ent.width && ent.height) {
        // Deep Fryers & Heavy Cookline Battery
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);

        // Vats
        const vatW = (ent.width - 20) / 2;
        const vatH = (ent.height || 60) - 12;
        [0, 1].forEach(i => {
          const vx = ent.x + 6 + i * (vatW + 8);
          ctx.strokeStyle = '#f87171';
          ctx.strokeRect(vx, ent.y + 6, vatW, vatH);
        });

        if (ent.label) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px JetBrains Mono';
          ctx.fillText(ent.label, ent.x + 4, ent.y + (ent.height || 60) / 2 + 3);
        }
      }

      if (ent.type === 'table' && ent.width && ent.height) {
        // Restaurant Table with Surrounding Chairs
        ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
        ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);

        // 4 Surrounding Chairs
        const chairSize = 14;
        // Top & Bottom
        ctx.fillStyle = '#78350f';
        ctx.fillRect(ent.x + ent.width / 2 - 10, ent.y - chairSize - 2, 20, chairSize);
        ctx.fillRect(ent.x + ent.width / 2 - 10, ent.y + ent.height + 2, 20, chairSize);
        // Left & Right
        ctx.fillRect(ent.x - chairSize - 2, ent.y + ent.height / 2 - 10, chairSize, 20);
        ctx.fillRect(ent.x + ent.width + 2, ent.y + ent.height / 2 - 10, chairSize, 20);

        if (ent.label) {
          ctx.fillStyle = '#fef3c7';
          ctx.font = 'bold 9px JetBrains Mono';
          ctx.textAlign = 'center';
          ctx.fillText(ent.label, ent.x + ent.width / 2, ent.y + ent.height / 2 + 3);
          ctx.textAlign = 'start';
        }
      }

      if (ent.type === 'shutter') {
        // Automatic Rolling Fire Shutter Line
        ctx.beginPath();
        ctx.moveTo(ent.x, ent.y);
        ctx.lineTo(ent.x2 || ent.x + 100, ent.y2 || ent.y);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (ent.label) {
          ctx.fillStyle = '#fca5a5';
          ctx.font = 'bold 10px JetBrains Mono';
          ctx.fillText(ent.label, ent.x + 8, ent.y - 6);
        }
      }

      if (ent.type === 'door' && ent.width) {
        // CAD Door Swing Arc
        ctx.beginPath();
        ctx.arc(ent.x, ent.y, ent.width, 0, Math.PI / 2, false);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Door leaf
        ctx.beginPath();
        ctx.moveTo(ent.x, ent.y);
        ctx.lineTo(ent.x, ent.y + ent.width);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#f59e0b';
        ctx.stroke();
      }
    });

    // 4. Render Defect Overlay Markings & Real CAD Dimension Lines
    if (activeLayers['DEFECTS']) {
      (dataset.defects || []).forEach(defect => {
        const box = defect.boundingBox || (defect as any).bounds || { x: 450, y: 350, width: 200, height: 100 };
        const { x, y, width, height } = box;
        const isSelected = defect.id === selectedDefectId;
        const isHovered = defect.id === hoveredDefectId;

        // Bounding Box Wash & Outline
        if (isSelected) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.28)';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3.5 / scale;
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 18;
        } else if (isHovered) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
          ctx.strokeStyle = '#f87171';
          ctx.lineWidth = 2.5 / scale;
          ctx.shadowColor = '#f87171';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.10)';
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
          ctx.lineWidth = 2 / scale;
          ctx.shadowBlur = 0;
        }

        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        ctx.shadowBlur = 0; // reset shadow

        // Corner Reticle Brackets on Selected Defect
        if (isSelected) {
          const bLen = Math.min(24, width * 0.3);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3 / scale;
          
          ctx.beginPath();
          ctx.moveTo(x - 6, y - 6 + bLen);
          ctx.lineTo(x - 6, y - 6);
          ctx.lineTo(x - 6 + bLen, y - 6);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(x + width + 6 - bLen, y + height + 6);
          ctx.lineTo(x + width + 6, y + height + 6);
          ctx.lineTo(x + width + 6, y + height + 6 - bLen);
          ctx.stroke();
        }

        // Defect Header Badge Callout
        const badgeW = 160;
        const badgeH = 24;
        const badgeX = x;
        const badgeY = y - badgeH - 6;

        ctx.fillStyle = isSelected ? '#ef4444' : '#b91c1c';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4) : ctx.rect(badgeX, badgeY, badgeW, badgeH);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(`⚠️ ${defect.id}: ${defect.severity}`, badgeX + 8, badgeY + 16);

        // Subtitle Target Tag
        ctx.fillStyle = isSelected ? '#ffc9c9' : '#fca5a5';
        ctx.font = '10px Inter';
        ctx.fillText(defect.targetLabel, badgeX, y + height + 16);

        // 5. Draw REAL CAD DIMENSION LINE & CALLOUT on the Canvas
        if (defect.dimensionCallout) {
          const dim = defect.dimensionCallout;
          const arrowSize = 6 / scale;

          // Dimension Line
          ctx.beginPath();
          ctx.moveTo(dim.x1, dim.y1);
          ctx.lineTo(dim.x2, dim.y2);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5 / scale;
          ctx.stroke();

          // Extension Tick Marks at Endpoints
          const tickLen = 10 / scale;
          if (dim.orientation === 'vertical') {
            ctx.beginPath();
            ctx.moveTo(dim.x1 - tickLen, dim.y1);
            ctx.lineTo(dim.x1 + tickLen, dim.y1);
            ctx.moveTo(dim.x2 - tickLen, dim.y2);
            ctx.lineTo(dim.x2 + tickLen, dim.y2);
            ctx.strokeStyle = '#f87171';
            ctx.lineWidth = 1.5 / scale;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.moveTo(dim.x1, dim.y1 - tickLen);
            ctx.lineTo(dim.x1, dim.y1 + tickLen);
            ctx.moveTo(dim.x2, dim.y2 - tickLen);
            ctx.lineTo(dim.x2, dim.y2 + tickLen);
            ctx.strokeStyle = '#f87171';
            ctx.lineWidth = 1.5 / scale;
            ctx.stroke();
          }

          // Arrowheads at endpoints
          const dx = dim.x2 - dim.x1;
          const dy = dim.y2 - dim.y1;
          const angle = Math.atan2(dy, dx);

          // Arrow 1 (at x1, y1)
          ctx.beginPath();
          ctx.moveTo(dim.x1, dim.y1);
          ctx.lineTo(dim.x1 + arrowSize * 2 * Math.cos(angle - Math.PI / 6), dim.y1 + arrowSize * 2 * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(dim.x1 + arrowSize * 2 * Math.cos(angle + Math.PI / 6), dim.y1 + arrowSize * 2 * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fillStyle = '#ef4444';
          ctx.fill();

          // Arrow 2 (at x2, y2)
          ctx.beginPath();
          ctx.moveTo(dim.x2, dim.y2);
          ctx.lineTo(dim.x2 - arrowSize * 2 * Math.cos(angle - Math.PI / 6), dim.y2 - arrowSize * 2 * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(dim.x2 - arrowSize * 2 * Math.cos(angle + Math.PI / 6), dim.y2 - arrowSize * 2 * Math.sin(angle + Math.PI / 6));
          ctx.closePath();
          ctx.fillStyle = '#ef4444';
          ctx.fill();

          // Prominent Measurement Banner Tag in center
          const midX = (dim.x1 + dim.x2) / 2;
          const midY = (dim.y1 + dim.y2) / 2;
          const boxW = 210;
          const boxH = 34;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
          ctx.strokeStyle = isSelected ? '#ef4444' : '#f87171';
          ctx.lineWidth = 1.5 / scale;
          ctx.strokeRect(midX - boxW / 2, midY - boxH / 2, boxW, boxH);
          ctx.fillRect(midX - boxW / 2, midY - boxH / 2, boxW, boxH);

          // Line 1: Actual Measured
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 10px JetBrains Mono';
          ctx.textAlign = 'center';
          ctx.fillText(`MEASURED: ${dim.measuredLabel}`, midX, midY - 3);

          // Line 2: Required Code
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 9px JetBrains Mono';
          ctx.fillText(`REQ CODE: ${dim.requiredLabel}`, midX, midY + 11);
          ctx.textAlign = 'start';
        }
      });
    }

    // 5. Render Measurement Tool Active Line
    if (measureMode && measureStart && measureCurrent) {
      ctx.beginPath();
      ctx.moveTo(measureStart.x, measureStart.y);
      ctx.lineTo(measureCurrent.x, measureCurrent.y);
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2 / scale;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Start & end tick crosshairs
      const crossSize = 10 / scale;
      [measureStart, measureCurrent].forEach(pt => {
        ctx.beginPath();
        ctx.moveTo(pt.x - crossSize, pt.y);
        ctx.lineTo(pt.x + crossSize, pt.y);
        ctx.moveTo(pt.x, pt.y - crossSize);
        ctx.lineTo(pt.x, pt.y + crossSize);
        ctx.strokeStyle = '#00e5ff';
        ctx.stroke();
      });

      // Calculate distance
      const dx = measureCurrent.x - measureStart.x;
      const dy = measureCurrent.y - measureStart.y;
      const pixelDist = Math.sqrt(dx * dx + dy * dy);
      const dimensionStr = pixelsToRealWorld(pixelDist);

      // Measurement tag
      const midX = (measureStart.x + measureCurrent.x) / 2;
      const midY = (measureStart.y + measureCurrent.y) / 2;
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.5 / scale;
      const tagW = 160;
      const tagH = 26;
      ctx.fillRect(midX - tagW / 2, midY - tagH / 2, tagW, tagH);
      ctx.strokeRect(midX - tagW / 2, midY - tagH / 2, tagW, tagH);

      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(dimensionStr, midX, midY + 4);
      ctx.textAlign = 'start';
    }

    ctx.restore();
  }, [
    dataset, scale, offset, selectedDefectId, hoveredDefectId, 
    activeLayers, measureMode, measureStart, measureCurrent, themeMode
  ]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full cad-grid-bg flex flex-col overflow-hidden select-none"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      style={{ cursor: measureMode ? 'crosshair' : isDragging ? 'grabbing' : 'grab' }}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />

      {/* Floating CAD HUD Header */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
        <div className="glass-panel px-3 py-1.5 rounded-lg flex items-center space-x-2.5 text-xs text-slate-300 shadow-xl border border-cyan-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-semibold text-cyan-300 font-mono">AUTOCAD ENGINE</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-mono">{dataset.filename}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
            {dataset.dimensions.scaleLabel}
          </span>
        </div>

        {/* Live Coordinate HUD */}
        <div className="glass-panel px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 flex items-center space-x-3 shadow-xl">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span>X: <strong className="text-white">{cursorCoord.x.toLocaleString()} mm</strong></span>
          <span>Y: <strong className="text-white">{cursorCoord.y.toLocaleString()} mm</strong></span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-400 font-semibold">{Math.round(scale * 100)}% ZOOM</span>
        </div>
      </div>

      {/* CAD Floating Toolbar */}
      <div className="absolute bottom-6 left-6 flex items-center space-x-2 z-10">
        <div className="glass-panel p-1.5 rounded-xl flex items-center space-x-1.5 shadow-2xl border border-white/10">
          {/* Zoom In */}
          <button
            onClick={() => setScale(s => Math.min(s * 1.25, 5))}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => setScale(s => Math.max(s * 0.8, 0.2))}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Fit to Screen */}
          <button
            onClick={fitToScreen}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
            title="Fit to Screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Reset 100% */}
          <button
            onClick={() => { setScale(1.0); setOffset({ x: 50, y: 50 }); }}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition"
            title="Reset 100%"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

          {/* Measurement Tape */}
          <button
            onClick={() => {
              setMeasureMode(!measureMode);
              setMeasureStart(null);
              setMeasureCurrent(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition ${
              measureMode 
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30' 
                : 'hover:bg-slate-800 text-slate-300 hover:text-cyan-400'
            }`}
            title="Interactive Measurement Tape"
          >
            <Ruler className="w-4 h-4" />
            <span>MEASURE TAPE</span>
          </button>

          <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

          {/* Layers Drawer Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition flex items-center space-x-1"
              title="CAD Layer Control"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Layer Popover Menu */}
            {showLayerMenu && (
              <div className="absolute bottom-12 left-0 w-56 glass-panel-darker rounded-xl p-3 shadow-2xl border border-slate-700 z-30">
                <div className="text-xs font-bold text-slate-300 mb-2 font-mono flex items-center justify-between">
                  <span>CAD LAYERS</span>
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(activeLayers).map(([layer, isVisible]) => (
                    <label key={layer} className="flex items-center justify-between p-1 rounded hover:bg-slate-800/60 cursor-pointer">
                      <span className="font-mono text-slate-300">{layer}</span>
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => onToggleLayer(layer)}
                        className="rounded border-slate-600 text-cyan-500 focus:ring-0 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 mb-1">CANVAS THEME</div>
                  <div className="grid grid-cols-3 gap-1">
                    {(['blueprint', 'matrix', 'monochrome'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setThemeMode(t)}
                        className={`text-[10px] uppercase py-1 rounded font-mono ${
                          themeMode === t ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Defect Floating Quick Zoom Badge */}
        {selectedDefectId && (
          <div className="glass-panel px-3 py-1.5 rounded-xl border border-red-500/40 flex items-center space-x-2 text-xs text-red-300 shadow-xl animate-pulse-glow">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>FOCUSED: <strong className="font-mono text-white">{selectedDefectId}</strong></span>
          </div>
        )}
      </div>

      {/* In-Canvas Defect Legend Pill */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        <div className="glass-panel px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-4 border border-red-500/30">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-red-500 shadow-sm shadow-red-500"></span>
            <span className="text-slate-300">RED = SPEC VIOLATION</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
            <span className="text-slate-300">CYAN = CAD ENTITY</span>
          </div>
        </div>
      </div>
    </div>
  );
};
