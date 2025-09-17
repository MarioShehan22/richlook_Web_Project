import { useState } from "react";

export default function VariantEditor({ value = [], onChange }) {
    const [rows, setRows] = useState(value);

    const update = (next) => {
        setRows(next);
        onChange?.(next);
    };

    const addRow = () =>
        update([
            ...rows,
            { sku: "", size: "M", color: "", quantity: 0, price: undefined, barcode: "" },
        ]);

    const removeRow = (idx) => update(rows.filter((_, i) => i !== idx));

    const edit = (idx, field, val) =>
        update(
            rows.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
        );

    return (
        <div className="border rounded p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Variants</h6>
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={addRow}>
                    + Add variant
                </button>
            </div>

            {rows.length === 0 && <div className="text-muted">No variants yet.</div>}

            {rows.map((v, idx) => (
                <div key={idx} className="row g-2 align-items-end mb-2">
                    <div className="col-6 col-md-2">
                        <label className="form-label">SKU</label>
                        <input value={v.sku} onChange={(e) => edit(idx, "sku", e.target.value)} className="form-control" />
                    </div>
                    <div className="col-6 col-md-2">
                        <label className="form-label">Size</label>
                        <select
                            value={v.size}
                            onChange={(e) => edit(idx, "size", e.target.value)}
                            className="form-select"
                        >
                            {["XS","S","M","L","XL","XXL","3XL","One Size","5 - 6 Years","7 - 8 Years","9 - 10 Years","11 - 12 Years"].map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-6 col-md-2">
                        <label className="form-label">Color</label>
                        <input value={v.color} onChange={(e) => edit(idx, "color", e.target.value)} className="form-control" />
                    </div>
                    <div className="col-6 col-md-2">
                        <label className="form-label">Qty</label>
                        <input type="number" value={v.quantity ?? 0}
                               onChange={(e) => edit(idx, "quantity", Number(e.target.value))}
                               className="form-control" />
                    </div>
                    <div className="col-6 col-md-2">
                        <label className="form-label">Price (override)</label>
                        <input type="number" value={v.price ?? ""} placeholder="optional"
                               onChange={(e) => edit(idx, "price", e.target.value === "" ? undefined : Number(e.target.value))}
                               className="form-control" />
                    </div>
                    <div className="col-6 col-md-2">
                        <label className="form-label d-block">Remove</label>
                        <button type="button" className="btn btn-outline-danger" onClick={() => removeRow(idx)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
