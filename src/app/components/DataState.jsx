'use client';

/**
 * Shared UI states for Firebase-only data rendering.
 * Used whenever content is missing, still loading, or failed to load —
 * no fallback content is ever rendered from code.
 */
export function LoadingState({ label = 'Loading content…', minHeight = '40vh' }) {
    return (
        <div
            className="data-state"
            style={{
                minHeight,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                color: '#6b7280',
            }}
        >
            <i className="fa-solid fa-circle-notch fa-spin fa-2x" aria-hidden="true"></i>
            <p style={{ margin: 0 }}>{label}</p>
        </div>
    );
}

export function ErrorState({ label = 'We could not load this content. Please check your connection and try again.', onRetry, minHeight = '40vh' }) {
    return (
        <div
            className="data-state"
            style={{
                minHeight,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                color: '#6b7280',
                textAlign: 'center',
                padding: '0 20px',
            }}
        >
            <i className="fa-solid fa-triangle-exclamation fa-2x" style={{ color: '#d97706' }} aria-hidden="true"></i>
            <p style={{ margin: 0 }}>{label}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="butn-arrow"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <span className="btn-text">Try again</span>
                </button>
            )}
        </div>
    );
}

export function EmptyState({ label = 'No content available yet.', minHeight = '40vh' }) {
    return (
        <div
            className="data-state"
            style={{
                minHeight,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
                color: '#6b7280',
                textAlign: 'center',
                padding: '0 20px',
            }}
        >
            <i className="fa-regular fa-folder-open fa-2x" aria-hidden="true"></i>
            <p style={{ margin: 0 }}>{label}</p>
        </div>
    );
}
