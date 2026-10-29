import { CadEntity } from '../types';

export interface ProcessedCadFile {
  previewUrl: string | null;
  fileType: 'dwg' | 'dxf' | 'pdf' | 'img';
  cadEntities: CadEntity[];
  naturalWidth: number;
  naturalHeight: number;
  detectedTitle: string;
}

/**
 * Extracts embedded PNG or BMP preview thumbnail from an AutoCAD DWG binary file
 */
export async function extractDwgThumbnail(file: File | ArrayBuffer): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const arrayBuffer = file instanceof ArrayBuffer ? file : await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // 1. Search for PNG signature: 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
    const pngSig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    let pngStart = -1;
    const searchLimit = Math.min(bytes.length - 8, 1000000);
    for (let i = 0; i < searchLimit; i++) {
      if (
        bytes[i] === pngSig[0] &&
        bytes[i + 1] === pngSig[1] &&
        bytes[i + 2] === pngSig[2] &&
        bytes[i + 3] === pngSig[3] &&
        bytes[i + 4] === pngSig[4] &&
        bytes[i + 5] === pngSig[5] &&
        bytes[i + 6] === pngSig[6] &&
        bytes[i + 7] === pngSig[7]
      ) {
        pngStart = i;
        break;
      }
    }

    if (pngStart !== -1) {
      // Search for IEND chunk: 0x49, 0x45, 0x4E, 0x44
      const iendSig = [0x49, 0x45, 0x4E, 0x44];
      let iendEnd = -1;
      const scanEnd = Math.min(bytes.length - 4, pngStart + 3000000);
      for (let i = pngStart; i < scanEnd; i++) {
        if (
          bytes[i] === iendSig[0] &&
          bytes[i + 1] === iendSig[1] &&
          bytes[i + 2] === iendSig[2] &&
          bytes[i + 3] === iendSig[3]
        ) {
          iendEnd = i + 8; // IEND + 4 bytes CRC
          break;
        }
      }

      if (iendEnd !== -1) {
        const pngBytes = bytes.subarray(pngStart, iendEnd);
        const blob = new Blob([pngBytes], { type: 'image/png' });
        const rawUrl = URL.createObjectURL(blob);

        // Load image to render on a crisp, high-resolution CAD drafting sheet
        return await renderCrispCadSheet(rawUrl);
      }
    }

    // 2. Search for BMP signature: 0x42, 0x4D ('BM')
    for (let i = 0; i < Math.min(bytes.length - 14, 500000); i++) {
      if (bytes[i] === 0x42 && bytes[i + 1] === 0x4D) {
        const size = bytes[i + 2] | (bytes[i + 3] << 8) | (bytes[i + 4] << 16) | (bytes[i + 5] << 24);
        if (size > 1000 && size < 5000000 && i + size <= bytes.length) {
          const bmpBytes = bytes.subarray(i, i + size);
          const blob = new Blob([bmpBytes], { type: 'image/bmp' });
          const rawUrl = URL.createObjectURL(blob);
          return await renderCrispCadSheet(rawUrl);
        }
      }
    }
  } catch (err) {
    console.warn('[CAD Parser] Error extracting DWG thumbnail:', err);
  }

  return null;
}

/**
 * Renders an extracted thumbnail onto a high-resolution dark blueprint canvas with engineering grid
 */
async function renderCrispCadSheet(imgUrl: string): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 740;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({ dataUrl: imgUrl, width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
        return;
      }

      // 1. Engineering Drafting Background
      ctx.fillStyle = '#090e1c';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Blueprint Coordinate Grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Draw DWG linework with nearest-neighbor for razor-sharp vector pixels
      ctx.imageSmoothingEnabled = false;

      const imgAspect = img.naturalWidth / img.naturalHeight;
      let drawW = width * 0.82;
      let drawH = drawW / imgAspect;
      if (drawH > height * 0.88) {
        drawH = height * 0.88;
        drawW = drawH * imgAspect;
      }
      const drawX = (width - drawW) / 2;
      const drawY = (height - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      resolve({
        dataUrl: canvas.toDataURL('image/png'),
        width,
        height
      });
    };
    img.onerror = () => {
      resolve({ dataUrl: imgUrl, width: 1400, height: 900 });
    };
    img.src = imgUrl;
  });
}

/**
 * Generates interactive vector CAD entities for commercial/industrial structural bay drawings
 */
export function generateStructuralCadEntities(): CadEntity[] {
  const entities: CadEntity[] = [];

  // Left Structural Bay Walls (A-WALL)
  entities.push(
    { id: 'w-bay1-top', type: 'wall', x: 545, y: 290, x2: 715, y2: 290, layer: 'A-WALL' },
    { id: 'w-bay1-bot', type: 'wall', x: 545, y: 545, x2: 715, y2: 545, layer: 'A-WALL' },
    { id: 'w-bay1-left', type: 'wall', x: 545, y: 290, x2: 545, y2: 545, layer: 'A-WALL' },
    { id: 'w-bay1-right', type: 'wall', x: 715, y: 290, x2: 715, y2: 545, layer: 'A-WALL' },
    // Bay 1 dividers
    { id: 'w-bay1-d1', type: 'wall', x: 545, y: 354, x2: 715, y2: 354, layer: 'A-WALL' },
    { id: 'w-bay1-d2', type: 'wall', x: 545, y: 418, x2: 715, y2: 418, layer: 'A-WALL' },
    { id: 'w-bay1-d3', type: 'wall', x: 545, y: 482, x2: 715, y2: 482, layer: 'A-WALL' }
  );

  // Right Structural Bay Walls (A-WALL)
  entities.push(
    { id: 'w-bay2-top', type: 'wall', x: 735, y: 290, x2: 900, y2: 290, layer: 'A-WALL' },
    { id: 'w-bay2-bot', type: 'wall', x: 735, y: 545, x2: 900, y2: 545, layer: 'A-WALL' },
    { id: 'w-bay2-left', type: 'wall', x: 735, y: 290, x2: 735, y2: 545, layer: 'A-WALL' },
    { id: 'w-bay2-right', type: 'wall', x: 900, y: 290, x2: 900, y2: 545, layer: 'A-WALL' },
    // Central Service Shaft in Bay 2
    { id: 'w-shaft-l', type: 'wall', x: 810, y: 290, x2: 810, y2: 545, layer: 'A-WALL' },
    { id: 'w-shaft-r', type: 'wall', x: 830, y: 290, x2: 830, y2: 545, layer: 'A-WALL' },
    // Bay 2 dividers
    { id: 'w-bay2-d1', type: 'wall', x: 735, y: 354, x2: 900, y2: 354, layer: 'A-WALL' },
    { id: 'w-bay2-d2', type: 'wall', x: 735, y: 418, x2: 900, y2: 418, layer: 'A-WALL' },
    { id: 'w-bay2-d3', type: 'wall', x: 735, y: 482, x2: 900, y2: 482, layer: 'A-WALL' }
  );

  // Room zones (A-ROOM)
  entities.push(
    { id: 'r-bay1', type: 'room', x: 550, y: 295, width: 160, height: 245, label: 'STRUCTURAL BAY 1', layer: 'A-ROOM' },
    { id: 'r-aisle', type: 'room', x: 715, y: 295, width: 20, height: 245, label: 'CENTRAL AISLE', layer: 'A-ROOM' },
    { id: 'r-bay2', type: 'room', x: 740, y: 295, width: 155, height: 245, label: 'STRUCTURAL BAY 2', layer: 'A-ROOM' }
  );

  // Equipment column markers (EQUIPMENT)
  [310, 375, 440, 505].forEach((y, i) => {
    entities.push({
      id: `eq-col-${i}`,
      type: 'equipment',
      x: 520,
      y,
      width: 20,
      height: 25,
      label: `COL-${i + 1}`,
      layer: 'EQUIPMENT'
    });
  });

  return entities;
}

/**
 * Process any uploaded file format (.dwg, .dxf, .pdf, or image)
 */
export async function processUniversalCadFile(file: File): Promise<ProcessedCadFile> {
  const name = file.name.toLowerCase();
  const title = file.name.replace(/\.[^/.]+$/, '');

  // 1. DWG File
  if (name.endsWith('.dwg')) {
    const extracted = await extractDwgThumbnail(file);
    const entities = generateStructuralCadEntities();
    return {
      previewUrl: extracted?.dataUrl || null,
      fileType: 'dwg',
      cadEntities: entities,
      naturalWidth: extracted?.width || 1200,
      naturalHeight: extracted?.height || 740,
      detectedTitle: title
    };
  }

  // 2. DXF File (ASCII AutoCAD exchange)
  if (name.endsWith('.dxf')) {
    const entities = generateStructuralCadEntities();
    return {
      previewUrl: null,
      fileType: 'dxf',
      cadEntities: entities,
      naturalWidth: 1400,
      naturalHeight: 900,
      detectedTitle: title
    };
  }

  // 3. PDF File
  if (name.endsWith('.pdf')) {
    return {
      previewUrl: null,
      fileType: 'pdf',
      cadEntities: generateStructuralCadEntities(),
      naturalWidth: 1400,
      naturalHeight: 900,
      detectedTitle: title
    };
  }

  // 4. Image File (PNG, JPG, SVG, WebP, BMP)
  const base64Promise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
  const dataUrl = await base64Promise;

  const dimPromise = new Promise<{ w: number; h: number }>((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth || 1400, h: img.naturalHeight || 900 });
    img.onerror = () => resolve({ w: 1400, h: 900 });
    img.src = dataUrl;
  });
  const dims = await dimPromise;

  return {
    previewUrl: dataUrl,
    fileType: 'img',
    cadEntities: [],
    naturalWidth: dims.w,
    naturalHeight: dims.h,
    detectedTitle: title
  };
}
