import React, { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { UploadCloud, Trash2, CheckCircle2, Loader2, Edit3, ArrowUpRight } from 'lucide-react';
import { uploadImageApi } from '../services/adminApi';

interface ImageDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  category?: string;
  label?: string;
  helperText?: string;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  value = '',
  onChange,
  category = 'general',
  label,
  helperText = 'Drag and drop an image here, or click to browse. Automatically compressed to high-performance WebP.',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<{ original: number; compressed: number; percent: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, WEBP, SVG, etc.).');
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setUploadStats(null);

    try {
      // Pass the previous value as oldUrl so backend unlinks it if it was in /uploads/
      const result = await uploadImageApi(file, value, category);

      if (result.success && result.url) {
        onChange(result.url);
        if (result.originalSize && result.compressedSize) {
          setUploadStats({
            original: result.originalSize,
            compressed: result.compressedSize,
            percent: result.savedPercent || Math.round(((result.originalSize - result.compressedSize) / result.originalSize) * 100),
          });
        }
      } else {
        setErrorMessage(result.error || 'Failed to upload and compress image.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Upload failed. Please check backend connection.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setUploadStats(null);
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1' }}>{label}</label>
          <button
            type="button"
            onClick={() => setManualMode(!manualMode)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontSize: '0.74rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Edit3 size={12} />
            {manualMode ? 'Switch to Dropzone' : 'Direct URL'}
          </button>
        </div>
      )}

      {manualMode ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/... or https://..."
            style={{
              flex: 1,
              padding: '0.65rem 0.85rem',
              background: '#1A1A18',
              border: '1px solid #333330',
              borderRadius: '6px',
              color: '#FFFFFF',
              fontSize: '0.85rem',
            }}
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: '#2B2B28',
                border: 'none',
                color: '#EF4444',
                padding: '0 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
              title="Clear Image"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            position: 'relative',
            border: isDragging ? '2px dashed #AA2E1F' : '1px dashed #40403C',
            borderRadius: '8px',
            background: isDragging ? 'rgba(170, 46, 31, 0.08)' : '#181816',
            padding: value ? '0.75rem' : '1.5rem 1rem',
            textAlign: 'center',
            cursor: isUploading ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileChange}
            style={{ display: 'none' }}
            disabled={isUploading}
          />

          {isUploading ? (
            <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
              <Loader2 size={32} className="spin-animate" style={{ color: '#AA2E1F' }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#EDE6D4' }}>Compressing &amp; Optimizing Image...</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Converting to high-performance WebP</div>
            </div>
          ) : value ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
              <div
                style={{
                  width: '90px',
                  height: '65px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  background: '#0A0A09',
                  border: '1px solid #333330',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={value}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {value.split('/').pop() || 'Current Image'}
                  </span>
                  {value.startsWith('/uploads/') && (
                    <span style={{ fontSize: '0.65rem', background: '#AA2E1F', color: '#FFFFFF', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                      OPTIMIZED WEBP
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Drop new image to replace</span>
                  <span>&bull;</span>
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: '#60A5FA', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}
                  >
                    View <ArrowUpRight size={11} />
                  </a>
                </div>

                {uploadStats && (
                  <div style={{ marginTop: '0.35rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#4ADE80', background: 'rgba(74, 222, 128, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                    <CheckCircle2 size={12} />
                    <span>
                      Compressed: {formatBytes(uploadStats.original)} &rarr; {formatBytes(uploadStats.compressed)} (-{uploadStats.percent}%)
                    </span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
                title="Remove image"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#262624',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#AA2E1F',
                  marginBottom: '0.2rem',
                }}
              >
                <UploadCloud size={20} />
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#EDE6D4' }}>
                Drag &amp; drop image here, or <span style={{ color: '#AA2E1F', textDecoration: 'underline' }}>browse</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', maxWidth: '340px' }}>
                PNG, JPG, WEBP, or SVG up to 25MB. Auto-converts to optimized WebP.
              </div>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div style={{ color: '#EF4444', fontSize: '0.74rem', marginTop: '0.35rem', fontWeight: 500 }}>
          {errorMessage}
        </div>
      )}
      {!errorMessage && helperText && !uploadStats && (
        <div style={{ color: '#64748B', fontSize: '0.72rem', marginTop: '0.3rem' }}>
          {helperText}
        </div>
      )}
    </div>
  );
};
