import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Maximize2,
  Check,
  RefreshCw,
  Sparkles,
  Sliders,
  Grid,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

/**
 * ImageAdjusterModal
 * Interactive Pan, Zoom, Rotate, Crop & Aspect Ratio adjustment tool for gallery marble photos.
 */
export default function ImageAdjusterModal({
  isOpen,
  onClose,
  imageSrc, // File object or URL string
  onSaveAdjusted, // Callback when image is adjusted & uploaded: (uploadedUrl) => void
}) {
  const canvasRef = useRef(null);
  const [loadedImage, setLoadedImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState('fit'); // 'fit', '3:4', '1:1', '4:3', 'free'
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [bgColor, setBgColor] = useState('#ffffff');
  const [showGrid, setShowGrid] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  // Target canvas viewport dimensions for preview
  const VIEW_WIDTH = 480;
  const getViewHeight = () => {
    switch (aspectRatio) {
      case '3:4':
        return Math.round((VIEW_WIDTH * 4) / 3); // 640
      case '1:1':
        return VIEW_WIDTH; // 480
      case '4:3':
        return Math.round((VIEW_WIDTH * 3) / 4); // 360
      case 'fit':
      case 'free':
      default:
        return 420;
    }
  };

  const viewHeight = getViewHeight();

  // Load Image when imageSrc changes
  useEffect(() => {
    if (!isOpen || !imageSrc) return;

    let objectUrl = null;
    let srcUrl = '';

    if (imageSrc instanceof File || imageSrc instanceof Blob) {
      objectUrl = URL.createObjectURL(imageSrc);
      srcUrl = objectUrl;
    } else if (typeof imageSrc === 'string') {
      srcUrl = imageSrc;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setLoadedImage(img);
      resetAdjustments(img, aspectRatio);
    };
    img.onerror = () => {
      setErrorNotice('फोटो लोड करने में असमर्थ। कृपया दूसरी फोटो चुनें।');
    };
    img.src = srcUrl;

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [isOpen, imageSrc]);

  // Reset adjustments
  const resetAdjustments = (img = loadedImage, currentRatio = aspectRatio) => {
    if (!img) return;

    // In 'fit' mode, auto-calculate scale so the entire photo fits within the viewport with no cropping
    const currentViewHeight = (() => {
      switch (currentRatio) {
        case '3:4': return Math.round((VIEW_WIDTH * 4) / 3);
        case '1:1': return VIEW_WIDTH;
        case '4:3': return Math.round((VIEW_WIDTH * 3) / 4);
        default: return 420;
      }
    })();

    const scaleX = VIEW_WIDTH / img.width;
    const scaleY = currentViewHeight / img.height;
    
    // Auto-fit initial scale
    const fitScale = Math.min(scaleX, scaleY) * 0.95;
    
    setZoom(fitScale > 0 ? Number(fitScale.toFixed(2)) : 1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setErrorNotice('');
  };

  // Re-fit when aspect ratio changes
  const handleRatioChange = (newRatio) => {
    setAspectRatio(newRatio);
    if (loadedImage) {
      resetAdjustments(loadedImage, newRatio);
    }
  };

  // Redraw Canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImage) return;

    const ctx = canvas.getContext('2d');
    const width = VIEW_WIDTH;
    const height = viewHeight;

    canvas.width = width;
    canvas.height = height;

    // 1. Clear & Background Fill
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Save transform state
    ctx.save();

    // 3. Move origin to center of viewport
    ctx.translate(width / 2 + position.x, height / 2 + position.y);

    // 4. Apply Rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // 5. Apply Zoom Scale
    ctx.scale(zoom, zoom);

    // 6. Draw Image centered
    ctx.drawImage(
      loadedImage,
      -loadedImage.width / 2,
      -loadedImage.height / 2,
      loadedImage.width,
      loadedImage.height
    );

    ctx.restore();

    // 7. Optional Rule of Thirds / Center Grid
    if (showGrid) {
      ctx.save();
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)'; // Amber gold grid
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(width / 3, 0);
      ctx.lineTo(width / 3, height);
      ctx.moveTo((width * 2) / 3, 0);
      ctx.lineTo((width * 2) / 3, height);

      // Horizontal lines
      ctx.moveTo(0, height / 3);
      ctx.lineTo(width, height / 3);
      ctx.moveTo(0, (height * 2) / 3);
      ctx.lineTo(width, (height * 2) / 3);

      // Center crosshair
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)';
      ctx.moveTo(width / 2 - 12, height / 2);
      ctx.lineTo(width / 2 + 12, height / 2);
      ctx.moveTo(width / 2, height / 2 - 12);
      ctx.lineTo(width / 2, height / 2 + 12);

      ctx.stroke();
      ctx.restore();
    }
  }, [loadedImage, viewHeight, zoom, rotation, position, bgColor, showGrid]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Drag Handlers (Mouse)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Drag Handlers (Touch for mobile / tablet)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Zoom helpers
  const handleZoomChange = (newVal) => {
    setZoom(parseFloat(newVal));
  };

  const zoomIn = () => setZoom(prev => Math.min(Number((prev + 0.1).toFixed(2)), 3.0));
  const zoomOut = () => setZoom(prev => Math.max(Number((prev - 0.1).toFixed(2)), 0.2));

  // Save / Apply Changes
  const handleApply = async () => {
    if (!loadedImage) return;

    setIsProcessing(true);
    setErrorNotice('');

    try {
      // 1. Render high-resolution export canvas (1000px base width for razor-sharp marble carving details)
      const exportWidth = 1000;
      const exportScale = exportWidth / VIEW_WIDTH;
      const exportHeight = Math.round(viewHeight * exportScale);

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = exportWidth;
      exportCanvas.height = exportHeight;
      const ctx = exportCanvas.getContext('2d');

      // Fill background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      ctx.save();
      ctx.translate(
        exportWidth / 2 + position.x * exportScale,
        exportHeight / 2 + position.y * exportScale
      );
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom * exportScale, zoom * exportScale);

      ctx.drawImage(
        loadedImage,
        -loadedImage.width / 2,
        -loadedImage.height / 2,
        loadedImage.width,
        loadedImage.height
      );
      ctx.restore();

      // 2. Convert to JPEG Blob
      exportCanvas.toBlob(async (blob) => {
        if (!blob) {
          setErrorNotice('फोटो प्रोसेस करने में समस्या हुई।');
          setIsProcessing(false);
          return;
        }

        try {
          // 3. Upload to server
          const uploadRes = await api.uploadPhoto(blob, `krushna_marble_${Date.now()}.jpg`);
          if (uploadRes.success && uploadRes.url) {
            onSaveAdjusted(uploadRes.url);
            onClose();
          } else {
            setErrorNotice(uploadRes.message || 'फोटो अपलोड नहीं हो सकी।');
          }
        } catch (err) {
          setErrorNotice('सर्वर पर फोटो अपलोड करने में त्रुटि।');
        } finally {
          setIsProcessing(false);
        }
      }, 'image/jpeg', 0.92);
    } catch (err) {
      console.error('Adjust export error:', err);
      setErrorNotice('फोटो एडजस्टमेंट लागू करने में समस्या आई।');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-stone-900 to-stone-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-amber-100 flex items-center gap-2">
                <span>फोटो साइज़ और रेश्यो एडजस्ट करें</span>
                <span className="text-[10px] bg-amber-500/30 text-amber-300 font-sans px-2 py-0.5 rounded-full">
                  Image Adjuster
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                फ़ोटो को अपनी पसंद के अनुसार ज़ूम, रोटेट, और सेंटर में सेट करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-700/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {errorNotice && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
              {errorNotice}
            </div>
          )}

          {/* Ratio Selection Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-stone-700">
                फ़्रेम रेश्यो चुनें (Aspect Ratio):
              </label>
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-lg border transition ${
                  showGrid
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-stone-50 text-stone-600 border-stone-200'
                }`}
              >
                <Grid className="w-3 h-3" />
                <span>सेंटर ग्रिड {showGrid ? 'चालू' : 'बंद'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleRatioChange('fit')}
                className={`p-2.5 rounded-xl border text-center transition font-semibold flex flex-col items-center gap-1 ${
                  aspectRatio === 'fit'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500/30 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Maximize2 className="w-4 h-4 text-amber-600" />
                <span>पूरी फोटो दिखाएं</span>
                <span className="text-[10px] text-stone-500 font-normal">No Cut / 100% Fit</span>
              </button>

              <button
                type="button"
                onClick={() => handleRatioChange('3:4')}
                className={`p-2.5 rounded-xl border text-center transition font-semibold flex flex-col items-center gap-1 ${
                  aspectRatio === '3:4'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500/30 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="w-4 h-5 border-2 border-current rounded-xs"></span>
                <span>ऊँचा मंदिर (3:4)</span>
                <span className="text-[10px] text-stone-500 font-normal">Tall Shrine / Idol</span>
              </button>

              <button
                type="button"
                onClick={() => handleRatioChange('1:1')}
                className={`p-2.5 rounded-xl border text-center transition font-semibold flex flex-col items-center gap-1 ${
                  aspectRatio === '1:1'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500/30 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="w-4 h-4 border-2 border-current rounded-xs"></span>
                <span>चौकोर (1:1)</span>
                <span className="text-[10px] text-stone-500 font-normal">Square Product</span>
              </button>

              <button
                type="button"
                onClick={() => handleRatioChange('4:3')}
                className={`p-2.5 rounded-xl border text-center transition font-semibold flex flex-col items-center gap-1 ${
                  aspectRatio === '4:3'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 ring-2 ring-amber-500/30 shadow-xs'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <span className="w-5 h-4 border-2 border-current rounded-xs"></span>
                <span>चौड़ा (4:3)</span>
                <span className="text-[10px] text-stone-500 font-normal">Landscape Shrine</span>
              </button>
            </div>
          </div>

          {/* Interactive Canvas Viewport */}
          <div className="flex flex-col items-center">
            <div
              className="relative max-w-full overflow-hidden rounded-2xl border-2 border-stone-300 shadow-inner bg-stone-100 flex items-center justify-center select-none"
              style={{
                width: `${VIEW_WIDTH}px`,
                height: `${viewHeight}px`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
              />

              {/* Helper badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-md font-medium pointer-events-none flex items-center gap-1">
                <Move className="w-3 h-3 text-amber-400" />
                <span>फोटो खिसकाने के लिए ड्रैग करें</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>ऊपर-नीचे या दायें-बायें खिसकाकर मंदिर/मूर्ति को सेंटर में लाएं</span>
            </p>
          </div>

          {/* Zoom & Adjustment Sliders */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800">
              <span className="flex items-center gap-1">
                <ZoomIn className="w-4 h-4 text-amber-600" />
                <span>फ़ोटो ज़ूम (Zoom In / Out):</span>
              </span>
              <span className="font-mono text-amber-800">{Math.round(zoom * 100)}%</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={zoomOut}
                className="p-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => handleZoomChange(e.target.value)}
                className="flex-1 accent-amber-600 cursor-pointer h-2 bg-stone-200 rounded-lg"
              />

              <button
                type="button"
                onClick={zoomIn}
                className="p-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions (Rotate, Background Color, Reset) */}
            <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-800 rounded-xl font-semibold flex items-center gap-1.5 shadow-2xs transition"
                >
                  <RotateCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>90° घुमाएं ({rotation}°)</span>
                </button>

                <button
                  type="button"
                  onClick={() => resetAdjustments()}
                  className="px-3 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl font-medium flex items-center gap-1 shadow-2xs transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>रीसेट</span>
                </button>
              </div>

              {/* Background Color choice for letterbox */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-stone-500 font-medium">बैकग्राउंड:</span>
                <button
                  type="button"
                  onClick={() => setBgColor('#ffffff')}
                  className={`w-6 h-6 rounded-full border-2 ${
                    bgColor === '#ffffff' ? 'border-amber-600 scale-110 shadow' : 'border-stone-300'
                  } bg-white`}
                  title="White"
                />
                <button
                  type="button"
                  onClick={() => setBgColor('#fbf9f5')}
                  className={`w-6 h-6 rounded-full border-2 ${
                    bgColor === '#fbf9f5' ? 'border-amber-600 scale-110 shadow' : 'border-stone-300'
                  } bg-[#fbf9f5]`}
                  title="Warm Stone"
                />
                <button
                  type="button"
                  onClick={() => setBgColor('#f4ede4')}
                  className={`w-6 h-6 rounded-full border-2 ${
                    bgColor === '#f4ede4' ? 'border-amber-600 scale-110 shadow' : 'border-stone-300'
                  } bg-[#f4ede4]`}
                  title="Soft Sand"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-semibold text-xs transition"
          >
            रद्द करें (Cancel)
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isProcessing || !loadedImage}
            className="gold-btn px-6 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>फोटो तैयार और अपलोड हो रही है...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>एडजस्ट की गई फोटो सेट करें (Apply & Save)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
