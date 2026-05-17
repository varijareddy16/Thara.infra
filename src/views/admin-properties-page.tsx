"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star, X, Upload } from "lucide-react";
import { useAdminProperties, uploadPropertyImage } from "@/lib/supabase-queries";
import type { Property, PropertyStatus, PropertyType } from "@/lib/supabase-types";

type PropertyForm = Omit<Property, "id" | "created_at" | "updated_at">;

const empty: PropertyForm = {
  slug: "",
  name: "",
  location: "",
  price: "",
  bhk: "",
  size: "",
  status: "Under Construction",
  type: "Apartment",
  image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
  featured: false,
  amenities: [],
  description: "",
};

function AdminProperties() {
  const { list, create, update, remove } = useAdminProperties();
  const properties = list.data ?? [];
  const [editing, setEditing] = useState<(PropertyForm & { id?: string }) | null>(null);

  const del = (id: string) => {
    if (confirm("Delete this property?")) remove.mutate(id);
  };

  const save = (data: PropertyForm & { id?: string }) => {
    if (data.id) {
      update.mutate({ id: data.id, ...data });
    } else {
      create.mutate(data);
    }
    setEditing(null);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Portfolio</p>
          <h1 className="font-display text-4xl mt-2">Properties</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your listings — add, edit, feature, or remove.
          </p>
        </div>
        <button
          onClick={() => setEditing(empty)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-warm text-primary-foreground px-5 py-2.5 text-sm font-medium shadow-soft hover:shadow-luxe transition-all"
        >
          <Plus size={16} /> New Property
        </button>
      </header>

      {list.isLoading && (
        <p className="text-sm text-muted-foreground">Loading properties…</p>
      )}

      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream/60 text-warm-brown">
              <tr className="text-left">
                <th className="px-6 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-cream/30">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image_url}
                        alt=""
                        className="h-11 w-14 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium flex items-center gap-1.5">
                          {p.name}
                          {p.featured && (
                            <Star
                              size={12}
                              className="fill-primary text-primary"
                            />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-full ${
                        p.status === "Ready to Move"
                          ? "bg-primary/15 text-primary"
                          : "bg-warm-brown/15 text-warm-brown"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">{p.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditing({ ...p })}
                        className="h-8 w-8 grid place-items-center rounded-full hover:bg-primary/10 text-warm-brown hover:text-primary"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => del(p.id)}
                        className="h-8 w-8 grid place-items-center rounded-full hover:bg-destructive/10 text-warm-brown hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!list.isLoading && properties.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No properties yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing !== null && (
        <PropertyDrawer
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function PropertyDrawer({
  initial,
  onClose,
  onSave,
}: {
  initial: PropertyForm & { id?: string };
  onClose: () => void;
  onSave: (p: PropertyForm & { id?: string }) => void;
}) {
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const isNew = !initial.id;

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadPropertyImage(file);
      set("image_url", url);
    } catch (err) {
      alert("Image upload failed. Check Supabase Storage bucket 'property-images' exists.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Auto-generate slug from name if creating new
  const handleNameChange = (v: string) => {
    set("name", v);
    if (isNew) {
      set(
        "slug",
        v
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog">
      <div
        className="absolute inset-0 bg-warm-brown/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-card h-full overflow-y-auto shadow-luxe">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-display text-xl">
            {isNew ? "New Property" : "Edit Property"}
          </h2>
          <button
            onClick={onClose}
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-cream"
          >
            <X size={16} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(form);
          }}
          className="p-6 space-y-4"
        >
          <Field
            label="Name"
            value={form.name}
            onChange={handleNameChange}
            required
          />
          <Field
            label="Slug (URL)"
            value={form.slug}
            onChange={(v) => set("slug", v)}
            required
          />
          <Field
            label="Location"
            value={form.location}
            onChange={(v) => set("location", v)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Price"
              value={form.price}
              onChange={(v) => set("price", v)}
            />
            <Field
              label="BHK"
              value={form.bhk}
              onChange={(v) => set("bhk", v)}
            />
          </div>
          <Field
            label="Size"
            value={form.size}
            onChange={(v) => set("size", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              value={form.status}
              onChange={(v) => set("status", v as PropertyStatus)}
              options={["Ready to Move", "Under Construction"]}
            />
            <Select
              label="Type"
              value={form.type}
              onChange={(v) => set("type", v as PropertyType)}
              options={["Apartment", "Villa", "Penthouse"]}
            />
          </div>

          {/* Image — URL or upload */}
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground block mb-2">
              Property Image
            </span>
            {form.image_url && (
              <img
                src={form.image_url}
                alt="preview"
                className="h-32 w-full object-cover rounded-xl mb-2"
              />
            )}
            <div className="flex gap-2">
              <input
                value={form.image_url}
                onChange={(e) => set("image_url", e.target.value)}
                placeholder="Image URL"
                className="flex-1 px-4 py-3 rounded-xl bg-ivory border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <label className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-cream border border-border text-sm text-warm-brown cursor-pointer hover:bg-ivory">
                <Upload size={14} />
                {uploading ? "Uploading…" : "Upload"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageUpload(f);
                  }}
                />
              </label>
            </div>
          </div>

          <Field
            label="Amenities (comma separated)"
            value={form.amenities.join(", ")}
            onChange={(v) =>
              set(
                "amenities",
                v
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Description
            </span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 accent-[color:var(--primary)]"
            />
            <span>Featured property</span>
          </label>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm text-warm-brown hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-gradient-warm text-primary-foreground text-sm font-medium shadow-soft"
            >
              {isNew ? "Create" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default AdminProperties;
