'use client';

import ImageUpload from '../../components/ImageUpload';

/**
 * Shared form field components for the page content editors.
 * These keep the admin editors consistent and compact.
 */

export function TextField({ label, value, onChange, placeholder, required = false, id }) {
    return (
        <div className="admin-form-field">
            {label && <label htmlFor={id}>{label}</label>}
            <input
                id={id}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
}

export function TextareaField({ label, value, onChange, placeholder, id }) {
    return (
        <div className="admin-form-field full">
            {label && <label htmlFor={id}>{label}</label>}
            <textarea
                id={id}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}

/**
 * Image URL field with ImageKit upload and thumbnail preview.
 */
export function ImageField({ label, value, onChange, folder = '/wayouts' }) {
    return (
        <div className="admin-form-field full admin-image-field">
            {label && <label>{label}</label>}
            <div className="admin-image-field-row">
                {value ? <img className="admin-thumb" src={value} alt="" /> : <span className="admin-thumb admin-thumb-empty"></span>}
                <input
                    value={value ?? ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="/assets/img/... or https://..."
                    aria-label={label || 'Image URL'}
                />
                <ImageUpload label="" folder={folder} onUploaded={(url) => onChange(url)} />
            </div>
        </div>
    );
}

/**
 * Repeatable list editor. Renders one row per item with add/remove controls.
 * `renderRow(item, updateItem, index)` returns the row's fields.
 */
export function ListEditor({ title, items, defaultItem, onChange, renderRow, addLabel = 'Add item' }) {
    function updateItem(index, updated) {
        onChange(items.map((item, itemIndex) => (itemIndex === index ? updated : item)));
    }

    function addItem() {
        onChange([...items, JSON.parse(JSON.stringify(defaultItem))]);
    }

    function removeItem(index) {
        onChange(items.filter((_, itemIndex) => itemIndex !== index));
    }

    function moveItem(index, direction) {
        const target = index + direction;
        if (target < 0 || target >= items.length) return;
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    }

    return (
        <div className="admin-list-editor">
            <div className="admin-hero-collage-head">
                <strong>{title}</strong>
                <button type="button" className="admin-primary-button" onClick={addItem}>
                    <i className="fa-light fa-plus"></i> {addLabel}
                </button>
            </div>
            {items.length === 0 && <p className="admin-empty">No items yet.</p>}
            <div className="admin-list-editor-rows">
                {items.map((item, index) => (
                    <div className="admin-list-editor-row" key={index}>
                        <div className="admin-list-editor-row-head">
                            <span>#{index + 1}</span>
                            <div className="admin-list-editor-row-actions">
                                <button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label="Move up"><i className="fa-light fa-arrow-up"></i></button>
                                <button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} aria-label="Move down"><i className="fa-light fa-arrow-down"></i></button>
                                <button type="button" className="danger" onClick={() => removeItem(index)} aria-label="Remove"><i className="fa-light fa-trash-can"></i></button>
                            </div>
                        </div>
                        <div className="admin-form-grid">{renderRow(item, (updated) => updateItem(index, updated), index)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Simple string list editor (e.g. ticker items, avatar URLs).
 */
export function StringListEditor({ title, items, onChange, placeholder, addLabel = 'Add item', folder }) {
    function updateItem(index, value) {
        onChange(items.map((item, itemIndex) => (itemIndex === index ? value : item)));
    }

    function addItem() {
        onChange([...items, '']);
    }

    function removeItem(index) {
        onChange(items.filter((_, itemIndex) => itemIndex !== index));
    }

    return (
        <div className="admin-list-editor">
            <div className="admin-hero-collage-head">
                <strong>{title}</strong>
                <button type="button" className="admin-primary-button" onClick={addItem}>
                    <i className="fa-light fa-plus"></i> {addLabel}
                </button>
            </div>
            {items.length === 0 && <p className="admin-empty">No items yet.</p>}
            <div className="admin-list-editor-rows">
                {items.map((item, index) => (
                    <div className="admin-list-editor-row compact" key={index}>
                        <div className="admin-list-editor-row-head">
                            <span>#{index + 1}</span>
                            <div className="admin-list-editor-row-actions">
                                <button type="button" className="danger" onClick={() => removeItem(index)} aria-label="Remove"><i className="fa-light fa-trash-can"></i></button>
                            </div>
                        </div>
                        {folder !== undefined ? (
                            <ImageField label="" value={item} onChange={(value) => updateItem(index, value)} folder={folder} />
                        ) : (
                            <div className="admin-form-field">
                                <input
                                    value={item}
                                    onChange={(e) => updateItem(index, e.target.value)}
                                    placeholder={placeholder}
                                    aria-label={`${title} ${index + 1}`}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Section visibility toggle card.
 */
export function VisibilityToggle({ visible, onChange, label = 'Show this section on the home page' }) {
    return (
        <label className="admin-setting-row">
            <span>
                <strong>Section visibility</strong>
                <small>{label}</small>
            </span>
            <input type="checkbox" checked={visible !== false} onChange={(e) => onChange(e.target.checked)} />
        </label>
    );
}
