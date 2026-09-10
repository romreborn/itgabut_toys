"use client";

import { useActionState } from "react";
import { importProductsAction, type ImportSummary } from "./actions";
import { adminStyles as s } from "../../../adminStyles";

const initialState: ImportSummary = { total: 0, created: 0, updated: 0, skipped: 0, rows: [] };

export default function ImportForm() {
  const [state, formAction, pending] = useActionState(importProductsAction, initialState);

  return (
    <div>
      <form action={formAction} style={s.card}>
        <label style={s.label}>File Excel (.xlsx)</label>
        <input type="file" name="file" accept=".xlsx,.xls" required style={s.input} />
        <button type="submit" style={{ ...s.button, opacity: pending ? 0.6 : 1 }} disabled={pending}>
          {pending ? "Mengimpor…" : "Import"}
        </button>
      </form>

      {state.total > 0 && (
        <div style={{ ...s.card, marginTop: 20 }}>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>
            {state.created} dibuat · {state.updated} diperbarui · {state.skipped} dilewati (dari {state.total} baris)
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Baris</th>
                  <th style={s.th}>Nama</th>
                  <th style={s.th}>Status</th>
                  <th style={s.th}>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {state.rows.map((r) => (
                  <tr key={r.row}>
                    <td style={s.td}>{r.row}</td>
                    <td style={s.td}>{r.name}</td>
                    <td style={s.td}>
                      {r.status === "created" && <span style={{ color: "#3A5A2A", fontWeight: 700 }}>Dibuat</span>}
                      {r.status === "updated" && <span style={{ color: "#B8860B", fontWeight: 700 }}>Diperbarui</span>}
                      {r.status === "skipped" && <span style={{ color: "#C9490F", fontWeight: 700 }}>Dilewati</span>}
                    </td>
                    <td style={s.td}>{r.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
