'use client';

import { useState } from 'react';

export default function ImageUpload({ onUploaded, folder = '/wayouts', label = 'Upload Image' }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);

    async function handleFileChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
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
        }
    }

    return (
        <div className="image-upload-box" style={{ margin: '10px 0' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                {label}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                    style={{ fontSize: '13px' }}
                />
                {uploading && <span style={{ fontSize: '13px', color: 'var(--admin-primary)' }}>Uploading...</span>}
            </div>
            {preview && (
                <div style={{ marginTop: '10px' }}>
                    <img
                        src={preview}
                        alt="Preview"
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--admin-line)' }}
                    />
                </div>
            )}
            {error && <span style={{ display: 'block', color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
        </div>
    );
}
