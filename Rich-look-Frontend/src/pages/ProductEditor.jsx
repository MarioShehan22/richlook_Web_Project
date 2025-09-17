import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    createProduct,
    getProductById,
    updateProduct,
} from "../api/products.js";
<<<<<<< HEAD
import VariantEditor from "../components/VariantEditor.jsx";

const categories = [
    "Tops","Bottoms","Dresses","Saree","Kurta","Suits","Outerwear",
    "Accessories","Footwear","Kids","Other","T-Shirts","Shirt","Pants & Trousers"
];

// at top of file
const CLOUD_NAME = 'dywmv9onv';
const UPLOAD_PRESET = 'location-preset';

// simple XHR helper so we can track progress
function uploadToCloudinary(file, { folder = 'products', onProgress } = {}) {
    return new Promise((resolve, reject) => {
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const form = new FormData();
        form.append('file', file);
        form.append('upload_preset', UPLOAD_PRESET);
        if (folder) form.append('folder', folder);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);

        if (xhr.upload && onProgress) {
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
            };
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try { resolve(JSON.parse(xhr.responseText)); }
                catch (e) { reject(new Error('Bad JSON from Cloudinary')); }
            } else {
                reject(new Error(`Upload failed (${xhr.status})`));
            }
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(form);
    });
}


=======
import VariantEditor from "../pages/VariantEditor.jsx";

const categories = [
    "Tops","Bottoms","Dresses","Saree","Kurta","Suits","Outerwear",
    "Accessories","Footwear","Kids","Other",
];

>>>>>>> 3c844b2 (Migrated to MERN)
const genders = ["Men", "Women", "Kids", "Unisex", ""];

export default function ProductEditor() {
    const { id } = useParams(); // if present => edit mode
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    const [form, setForm] = useState({
        name: "",
        slug: "",
        description: "",
        price: 0,
        compareAtPrice: "",
        brand: "",
        category: "Tops",
        occasions: [],
        newArrival: false,
        arrivalDate: "",
        isActive: true,
        images: [],       // [{url, alt, isPrimary}]
        thumbnailUrl: "",
        variants: [],     // [{size,color,quantity,price,sku,barcode}]
        gender: "",
        material: "",
        care: "",
        season: "",
        metaTitle: "",
        metaDescription: "",
        tags: [],
    });
<<<<<<< HEAD
    const [uploading, setUploading] = useState({ index: null, progress: 0 });
    const setPrimary = (idx) => {
        const next = (form.images || []).map((img, i) =>
            i === idx ? { ...img, isPrimary: true } : { ...img, isPrimary: false }
        );
        onChange('images', next);
    };
=======
>>>>>>> 3c844b2 (Migrated to MERN)

    useEffect(() => {
        if (!isEdit) return;
        (async () => {
            try {
                const { data } = await getProductById(id);
                // Normalize arrays to avoid undefined
                setForm({
                    ...form,
                    ...data,
                    occasions: data.occasions || [],
                    images: data.images || [],
                    variants: data.variants || [],
                    tags: data.tags || [],
                    arrivalDate: data.arrivalDate ? data.arrivalDate.substring(0,10) : "",
                });
            } catch (e) {
                setMsg("Failed to load product.");
                console.error(e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const onChange = (field, val) => setForm((f) => ({ ...f, [field]: val }));

    const addImage = () =>
        onChange("images", [...form.images, { url: "", alt: "", isPrimary: false }]);

    const removeImage = (idx) =>
        onChange("images", form.images.filter((_, i) => i !== idx));

    const imagesPrimaryCount = useMemo(
        () => (form.images || []).filter((i) => i.isPrimary).length,
        [form.images]
    );

    const submit = async (e) => {
        e.preventDefault();
        setMsg("");
        setSaving(true);

        try {
            const payload = {
                ...form,
                price: Number(form.price) || 0,
                compareAtPrice:
                    form.compareAtPrice === "" ? undefined : Number(form.compareAtPrice),
                tags: (Array.isArray(form.tags) ? form.tags : String(form.tags).split(","))
                    .map((s) => s.trim())
                    .filter(Boolean),
                occasions: (Array.isArray(form.occasions) ? form.occasions : String(form.occasions).split(","))
                    .map((s) => s.trim())
                    .filter(Boolean),
                arrivalDate: form.arrivalDate ? new Date(form.arrivalDate) : undefined,
            };

            if (isEdit) {
                await updateProduct(id, payload);
                setMsg("Product updated.");
            } else {
                await createProduct(payload);
                setMsg("Product created.");
                // optionally navigate to list or edit page
                navigate("/admin/products");
            }
        } catch (e) {
            console.error(e);
            setMsg(e?.response?.data?.message || "Save failed.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">{isEdit ? "Edit Product" : "Add Product"}</h2>
                <Link className="btn btn-outline-secondary" to="/admin/products">
                    Back to list
                </Link>
            </div>

            {msg && <div className="alert alert-info">{msg}</div>}

            {/* Basic info */}
            <form onSubmit={submit}>
                <div className="row g-3">
                    <div className="col-md-8">
                        <label className="form-label">Name *</label>
                        <input
                            className="form-control"
                            value={form.name}
                            onChange={(e) => onChange("name", e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Slug</label>
                        <input
                            className="form-control"
                            value={form.slug || ""}
                            onChange={(e) => onChange("slug", e.target.value)}
                            placeholder="auto if blank"
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Description *</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={form.description}
                            onChange={(e) => onChange("description", e.target.value)}
                            required
                        />
                    </div>

                    {/* Pricing */}
                    <div className="col-md-4">
                        <label className="form-label">Price *</label>
                        <input
                            type="number"
                            className="form-control"
                            value={form.price}
                            onChange={(e) => onChange("price", e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Compare-at Price</label>
                        <input
                            type="number"
                            className="form-control"
                            value={form.compareAtPrice ?? ""}
                            onChange={(e) => onChange("compareAtPrice", e.target.value)}
                            placeholder="optional"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Brand *</label>
                        <input
                            className="form-control"
                            value={form.brand}
                            onChange={(e) => onChange("brand", e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Category *</label>
                        <select
                            className="form-select"
                            value={form.category}
                            onChange={(e) => onChange("category", e.target.value)}
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Gender</label>
                        <select
                            className="form-select"
                            value={form.gender}
                            onChange={(e) => onChange("gender", e.target.value)}
                        >
                            {genders.map((g) => (
                                <option key={g} value={g}>{g || "(blank)"}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Occasions</label>
                        <input
                            className="form-control"
                            placeholder="Comma separated (e.g. Party,Wedding)"
                            value={Array.isArray(form.occasions) ? form.occasions.join(", ") : form.occasions}
                            onChange={(e) => onChange("occasions", e.target.value)}
                        />
                    </div>

                    {/* Flags */}
                    <div className="col-md-4">
                        <label className="form-label">Arrival date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={form.arrivalDate}
                            onChange={(e) => onChange("arrivalDate", e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                        <div className="form-check">
                            <input
                                id="newArrival"
                                type="checkbox"
                                className="form-check-input"
                                checked={form.newArrival}
                                onChange={(e) => onChange("newArrival", e.target.checked)}
                            />
                            <label htmlFor="newArrival" className="form-check-label">New Arrival</label>
                        </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-end">
                        <div className="form-check">
                            <input
                                id="isActive"
                                type="checkbox"
                                className="form-check-input"
                                checked={form.isActive}
                                onChange={(e) => onChange("isActive", e.target.checked)}
                            />
                            <label htmlFor="isActive" className="form-check-label">Active</label>
                        </div>
                    </div>

                    {/* Media */}
<<<<<<< HEAD
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label mb-0">Images</label>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                type="button"
                                onClick={() =>
                                    onChange("images", [...(form.images || []), {url: "", alt: "", isPrimary: false}])
                                }
                            >
=======
                    <div className="col-md-6">
                        <label className="form-label">Thumbnail URL</label>
                        <input
                            className="form-control"
                            value={form.thumbnailUrl || ""}
                            onChange={(e) => onChange("thumbnailUrl", e.target.value)}
                        />
                        {form.thumbnailUrl && (
                            <img src={form.thumbnailUrl} alt="thumb" className="mt-2 rounded" style={{maxHeight:120}} />
                        )}
                    </div>

                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <label className="form-label mb-0">Images</label>
                            <button className="btn btn-sm btn-outline-primary" type="button" onClick={addImage}>
>>>>>>> 3c844b2 (Migrated to MERN)
                                + Add image
                            </button>
                        </div>

<<<<<<< HEAD
                        {(form.images?.length ?? 0) === 0 && (
                            <div className="text-muted">No images yet.</div>
                        )}

                        {(form.images || []).map((img, idx) => (
                            <div key={idx} className="row g-2 align-items-end mb-3">
                                <div className="col-md-5">
=======
                        {form.images?.length === 0 && (
                            <div className="text-muted">No images yet.</div>
                        )}

                        {form.images?.map((img, idx) => (
                            <div key={idx} className="row g-2 align-items-end mb-2">
                                <div className="col-md-6">
>>>>>>> 3c844b2 (Migrated to MERN)
                                    <label className="form-label">URL</label>
                                    <input
                                        className="form-control"
                                        value={img.url}
                                        onChange={(e) => {
                                            const next = [...form.images];
<<<<<<< HEAD
                                            next[idx] = {...img, url: e.target.value};
                                            onChange("images", next);
                                        }}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="col-md-3">
=======
                                            next[idx] = { ...img, url: e.target.value };
                                            onChange("images", next);
                                        }}
                                    />
                                </div>
                                <div className="col-md-4">
>>>>>>> 3c844b2 (Migrated to MERN)
                                    <label className="form-label">Alt</label>
                                    <input
                                        className="form-control"
                                        value={img.alt || ""}
                                        onChange={(e) => {
                                            const next = [...form.images];
<<<<<<< HEAD
                                            next[idx] = {...img, alt: e.target.value};
                                            onChange("images", next);
                                        }}
                                        placeholder="Alt text"
                                    />
                                </div>

                                <div className="col-md-2">
                                    <div className="form-check mt-4">
=======
                                            next[idx] = { ...img, alt: e.target.value };
                                            onChange("images", next);
                                        }}
                                    />
                                </div>
                                <div className="col-md-1">
                                    <div className="form-check">
>>>>>>> 3c844b2 (Migrated to MERN)
                                        <input
                                            id={`primary-${idx}`}
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={!!img.isPrimary}
<<<<<<< HEAD
                                            onChange={(e) => setPrimary(idx)}
                                        />
                                        <label htmlFor={`primary-${idx}`} className="form-check-label">
                                            Primary
                                        </label>
                                    </div>
                                </div>

                                <div className="col-md-2 d-flex gap-2 mt-4">
                                    {/* Upload button */}
                                    <label className="btn btn-sm btn-outline-secondary mb-0"
                                           style={{position: 'relative'}}>
                                        {uploading.index === idx ? `Uploading ${uploading.progress}%` : "Upload"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer'}}
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                try {
                                                    setUploading({index: idx, progress: 0});
                                                    const res = await uploadToCloudinary(file, {
                                                        folder: 'products',
                                                        onProgress: (p) => setUploading((s) => (s.index === idx ? {
                                                            index: idx,
                                                            progress: p
                                                        } : s)),
                                                    });

                                                    const next = [...form.images];
                                                    next[idx] = {
                                                        ...img,
                                                        url: res.secure_url,       // <— Cloudinary URL
                                                        alt: img.alt || file.name, // keep alt if set; fallback to filename
                                                    };
                                                    onChange("images", next);
                                                } catch (err) {
                                                    console.error(err);
                                                    alert(err.message || "Upload failed");
                                                } finally {
                                                    setUploading({index: null, progress: 0});
                                                    e.target.value = ""; // reset input
                                                }
                                            }}
                                        />
                                    </label>

                                    {/* Remove row */}
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                            onChange("images", (form.images || []).filter((_, i) => i !== idx))
                                        }
                                    >
                                        ×
                                    </button>
                                </div>

                                {img.url && (
                                    <div className="col-12">
                                        <img
                                            src={img.url}
                                            alt={img.alt}
                                            className="rounded border"
                                            style={{maxHeight: 140}}
                                        />
=======
                                            onChange={(e) => {
                                                const next = [...form.images];
                                                next[idx] = { ...img, isPrimary: e.target.checked };
                                                onChange("images", next);
                                            }}
                                        />
                                        <label htmlFor={`primary-${idx}`} className="form-check-label">Primary</label>
                                    </div>
                                </div>
                                <div className="col-md-1">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => removeImage(idx)}>
                                        ×
                                    </button>
                                </div>
                                {img.url && (
                                    <div className="col-12">
                                        <img src={img.url} alt={img.alt} className="rounded" style={{maxHeight:120}} />
>>>>>>> 3c844b2 (Migrated to MERN)
                                    </div>
                                )}
                            </div>
                        ))}

                        {imagesPrimaryCount > 1 && (
                            <div className="text-warning small">
                                Multiple images marked primary; only one will be treated as primary by your UI.
                            </div>
                        )}
                    </div>

                    {/* Variants */}
                    <div className="col-12">
                        <VariantEditor
                            value={form.variants}
                            onChange={(v) => onChange("variants", v)}
                        />
                        <div className="form-text">
                            Sizes/colors arrays and totalQuantity are automatically synced from variants in your schema.
                        </div>
                    </div>

                    {/* Extra fields */}
                    <div className="col-md-4">
                        <label className="form-label">Material</label>
<<<<<<< HEAD
                        <input className="form-control" value={form.material || ""}
                               onChange={(e) => onChange("material", e.target.value)}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Care</label>
                        <input className="form-control" value={form.care || ""}
                               onChange={(e) => onChange("care", e.target.value)}/>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Season</label>
                        <input className="form-control" value={form.season || ""}
                               onChange={(e) => onChange("season", e.target.value)}/>
                    </div>

                    {/*<div className="col-md-6">*/}
                    {/*    <label className="form-label">Meta Title</label>*/}
                    {/*    <input className="form-control" value={form.metaTitle || ""}*/}
                    {/*           onChange={(e) => onChange("metaTitle", e.target.value)}/>*/}
                    {/*</div>*/}
                    {/*<div className="col-md-6">*/}
                    {/*    <label className="form-label">Meta Description</label>*/}
                    {/*    <input className="form-control" value={form.metaDescription || ""}*/}
                    {/*           onChange={(e) => onChange("metaDescription", e.target.value)}/>*/}
                    {/*</div>*/}

                    {/*<div className="col-12">*/}
                    {/*    <label className="form-label">Tags</label>*/}
                    {/*    <input*/}
                    {/*        className="form-control"*/}
                    {/*        placeholder="Comma separated (e.g. linen,summer)"*/}
                    {/*        value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}*/}
                    {/*        onChange={(e) => onChange("tags", e.target.value)}*/}
                    {/*    />*/}
                    {/*</div>*/}
=======
                        <input className="form-control" value={form.material || ""} onChange={(e) => onChange("material", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Care</label>
                        <input className="form-control" value={form.care || ""} onChange={(e) => onChange("care", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Season</label>
                        <input className="form-control" value={form.season || ""} onChange={(e) => onChange("season", e.target.value)} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Meta Title</label>
                        <input className="form-control" value={form.metaTitle || ""} onChange={(e) => onChange("metaTitle", e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Meta Description</label>
                        <input className="form-control" value={form.metaDescription || ""} onChange={(e) => onChange("metaDescription", e.target.value)} />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Tags</label>
                        <input
                            className="form-control"
                            placeholder="Comma separated (e.g. linen,summer)"
                            value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
                            onChange={(e) => onChange("tags", e.target.value)}
                        />
                    </div>
>>>>>>> 3c844b2 (Migrated to MERN)
                </div>

                <div className="mt-4 d-flex gap-2">
                    <button disabled={saving} className="btn btn-primary" type="submit">
                        {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
                    </button>
                    <Link to="/admin/products" className="btn btn-outline-secondary">Cancel</Link>
                </div>
            </form>
        </div>
    );
}
