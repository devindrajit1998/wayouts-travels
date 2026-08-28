'use client';

import { useState, useRef } from 'react';

export default function ImageUpload({ onUploaded, folder = '/wayouts', label = '' }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', file.name);
            formData.append('folder', folder);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            if (onUploaded) {
                onUploaded(data.url, data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    return (
        <div className="image-upload-wrapper" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'none' }}
            />
            <button
                type="button"
                className="admin-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload image to ImageKit"
            >
                {uploading ? (
                    <>
                        <i className="fa-light fa-spinner fa-spin"></i>
                        <span>Uploading…</span>
                    </>
                ) : (
                    <>
                        <i className="fa-light fa-cloud-arrow-up"></i>
                        <span>{label || 'Upload'}</span>
                    </>
                )}
            </button>
            {error && <span style={{ color: '#dc2626', fontSize: '11px' }}>{error}</span>}
        </div>
    );
}
