"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import { useAdminCareers } from "@/lib/supabase-queries";
import type { Career, CareerType } from "@/lib/supabase-types";

type CareerForm = Omit<Career, "id" | "created_at" | "updated_at">;

const empty: CareerForm = {
  title: "",
  department: "",
  location: "Hyderabad",
  type: "Full-time",
  description: "",
  active: true,
};

function AdminCareers() {
  const { list, create, update, remove } = useAdminCareers();
  const careers = list.data ?? [];
  const [editing, setEditing] = useState<(CareerForm & { id?: string }) | null>(null);

  const save = (form: CareerForm & { id?: string }) => {
    if (form.id) {
      update.mutate({ id: form.id, ...form });
    } else {
      create.mutate(form);
    }
    setEditing(null);
  };

  const toggle = (c: Career) => {
    update.mutate({ id: c.id, active: !c.active });
  };

  const del = (id: string) => {
    if (confirm("Delete this role?")) remove.mutate(id);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Hiring</p>
          <h1 className="font-display text-4xl mt-2">Careers</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Open positions visible on the public careers page.
          </p>
        </div>
        <button
          onClick={() => setEditing(empty)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-warm text-primary-foreground px-5 py-2.5 text-sm font-medium shadow-soft hover:shadow-luxe transition-all"
        >
          <Plus size={16} /> New Role
        </button>
      </header>

      {list.isLoading && (
        <p className="text-sm text-muted-foreground">Loading careers…</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {careers.map((c) => (
          <div
            key={c.id}
            className="bg-card rounded-2xl border border-border shadow-soft p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl">{c.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {c.department} · {c.location} · {c.type}
                </p>
              </div>
              <span
                className={`text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${
                  c.active
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {c.active ? "Active" : "Paused"}
              </span>
            </div>
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-warm-brown cursor-pointer">
                <input
                  type="checkbox"
                  checked={c.active}
                  onChange={() => toggle(c)}
                  className="accent-[color:var(--primary)]"
                />
                Visible publicly
              </label>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing({ ...c })}
                  className="h-8 w-8 grid place-items-center rounded-full hover:bg-primary/10 text-warm-brown hover:text-primary"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => del(c.id)}
                  className="h-8 w-8 grid place-items-center rounded-full hover:bg-destructive/10 text-warm-brown hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <CareerDialog
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function CareerDialog({
  initial,
  onClose,
  onSave,
}: {
  initial: CareerForm & { id?: string };
  onClose: () => void;
  onSave: (c: CareerForm & { id?: string }) => void;
}) {
  const [form, setForm] = useState(initial);
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div
        className="absolute inset-0 bg-warm-brown/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-3xl shadow-luxe w-full max-w-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">
            {initial.id ? "Edit Role" : "New Role"}
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
          className="space-y-4"
        >
          <In
            label="Title"
            value={form.title}
            onChange={(v) => set("title", v)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <In
              label="Department"
              value={form.department}
              onChange={(v) => set("department", v)}
              required
            />
            <In
              label="Location"
              value={form.location}
              onChange={(v) => set("location", v)}
            />
          </div>
          <Sel
            label="Type"
            value={form.type}
            onChange={(v) => set("type", v as CareerType)}
            options={["Full-time", "Part-time", "Contract"]}
          />
          <label className="block">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Description
            </span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-ivory border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
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
              className="px-5 py-2.5 rounded-full bg-gradient-warm text-primary-foreground text-sm font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function In({
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

function Sel({
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

export default AdminCareers;
