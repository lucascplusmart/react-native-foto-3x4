import { PaperSize } from '../components/PrintConfig';

export const generateFoto3x4Html = (
  imageUri: string,
  paperSize: PaperSize,
  quantity: number,
): string => {
  const isA4 = paperSize === 'A4';

  // Dimensions in mm
  const pageWidth = isA4 ? 210 : 215.9;
  const pageHeight = isA4 ? 297 : 279.4;

  // 3x4cm photo in mm
  const photoWidth = 30;
  const photoHeight = 40;

  // Gap between photos (mm)
  const gap = 4;

  // Margins (mm)
  const marginY = 15;
  const marginX = 15;

  // Create image tags
  let imagesHtml = '';
  for (let i = 0; i < quantity; i++) {
    imagesHtml += `
      <div class="photo-container">
        <img src="${imageUri}" />
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Foto 3x4 Sheet</title>
        <style>
            @page {
                size: ${paperSize};
                margin: 0;
            }
            body {
                margin: 0;
                padding: 0;
                background-color: white;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                min-height: 100vh;
            }
            .page-container {
                width: ${pageWidth}mm;
                height: ${pageHeight}mm;
                padding-top: ${marginY}mm;
                padding-left: ${marginX}mm;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-start;
                gap: ${gap}mm;
            }
            .photo-container {
                width: ${photoWidth}mm;
                height: ${photoHeight}mm;
                overflow: hidden;
                border: 0.5px solid #ccc; /* Light border for cutting guide */
                display: flex;
                justify-content: center;
                align-items: center;
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        </style>
    </head>
    <body>
        <div class="page-container">
            ${imagesHtml}
        </div>
    </body>
    </html>
  `;
};

// Calculate max photos that fit on a page
export const calculateMaxPhotos = (paperSize: 'A4' | 'Letter') => {
  // Basic approximate math considering margins
  if (paperSize === 'A4') {
    // 210 - 20 = 190 width available. 190 / (30 + 5) ~= 5.4 -> 5 cols
    // 297 - 20 = 277 height available. 277 / (40 + 5) ~= 6.1 -> 6 rows
    // Total ~ 30
    return 30;
  }
  return 25; // Letter approximate
};
