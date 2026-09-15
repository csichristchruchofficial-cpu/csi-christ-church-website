"use client";

import { useState, useEffect, useCallback, useId } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Cake,
  Heart,
  Calendar,
  X,
  UserCheck,
} from "lucide-react";
import { parseExcelDate } from "@/lib/celebrations/date-utils";

type ChurchPersonRecord = {
  id: string;
  name: string;
  date_of_birth: string | null;
  anniversary_date: string | null;
  created_at: string;
  updated_at: string;
};

type PreviewItem = {
  name: string;
  rawDate: unknown;
  parsedDate: string | null;
};

export default function CelebrationsManager() {
  const fileInputId = useId();
  // Records List State
  const [records, setRecords] = useState<ChurchPersonRecord[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 30;

  // Feedback State
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Excel Upload State
  const [importType, setImportType] = useState<"birthday" | "anniversary">("birthday");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
  const [parsingFile, setParsingFile] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    updated: number;
    skipped: number;
    total: number;
  } | null>(null);

  // Manual Add / Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ChurchPersonRecord | null>(null);
  const [formName, setFormName] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formAnni, setFormAnni] = useState("");

  // 1. Fetch records from API
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: String(page),
        limit: String(limit),
      });
      const res = await fetch(`/api/admin/celebrations?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to fetch celebration records");
      }

      const data = await res.json();
      setRecords(data.records || []);
      setTotalCount(data.total || 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error loading records";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // 2. Handle File Selection and Parsing
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    setParsingFile(true);
    setErrorMessage(null);
    setImportResult(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("The Excel file has no sheets.");
      }

      // Pick first sheet or matching sheet name
      const sheetName =
        workbook.SheetNames.find((s) =>
          importType === "birthday"
            ? s.toLowerCase().includes("birth")
            : s.toLowerCase().includes("anniv")
        ) || workbook.SheetNames[0];

      const sheet = workbook.Sheets[sheetName];
      const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

      if (rawRows.length === 0) {
        throw new Error("No data rows found in the selected Excel sheet.");
      }

      // Identify column names flexibly
      const sample = rawRows[0];
      const keys = Object.keys(sample);

      let nameKey = keys.find((k) => {
        const lower = k.toLowerCase();
        return (
          lower.includes("name") ||
          lower.includes("பெயர்") ||
          lower.includes("husband") ||
          lower.includes("person")
        );
      });

      let dateKey = keys.find((k) => {
        const lower = k.toLowerCase();
        return (
          lower.includes("date") ||
          lower.includes("birth") ||
          lower.includes("anniversary") ||
          lower.includes("dob") ||
          lower.includes("நாள்")
        );
      });

      if (!nameKey || !dateKey) {
        // Fallback: assume column 0 is Name, column 1 is Date
        if (keys.length >= 2) {
          nameKey = keys[0];
          dateKey = keys[1];
        } else {
          throw new Error(
            `Could not identify Name and Date columns. Found headers: ${keys.join(", ")}`
          );
        }
      }

      const parsed: PreviewItem[] = rawRows.map((row) => {
        const name = String(row[nameKey!] || "").trim();
        const rawDate = row[dateKey!];
        const parsedDate = parseExcelDate(rawDate);
        return { name, rawDate, parsedDate };
      });

      setPreviewItems(parsed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to parse Excel file.";
      setErrorMessage(msg);
      setPreviewItems([]);
    } finally {
      setParsingFile(false);
    }
  };

  // 3. Confirm Import
  const handleConfirmImport = async () => {
    if (previewItems.length === 0) return;

    setImporting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        type: importType,
        items: previewItems.map((item) => ({
          name: item.name,
          date: item.rawDate,
        })),
      };

      const res = await fetch("/api/admin/celebrations/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Import failed.");
      }

      setImportResult({
        imported: data.imported,
        updated: data.updated,
        skipped: data.skipped,
        total: data.totalProcessed,
      });

      setSuccessMessage(
        `வெற்றிகரமாக இறக்குமதி செய்யப்பட்டது: ${data.imported} புதியது, ${data.updated} புதுப்பிக்கப்பட்டது, ${data.skipped} தவிர்க்கப்பட்டது.`
      );

      // Reset file and reload list
      setUploadFile(null);
      setPreviewItems([]);
      fetchRecords();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Import failed";
      setErrorMessage(msg);
    } finally {
      setImporting(false);
    }
  };

  // 4. Open Create Modal
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setFormName("");
    setFormDob("");
    setFormAnni("");
    setIsAddModalOpen(true);
  };

  // 5. Open Edit Modal
  const handleOpenEditModal = (rec: ChurchPersonRecord) => {
    setEditingRecord(rec);
    setFormName(rec.name);
    setFormDob(rec.date_of_birth || "");
    setFormAnni(rec.anniversary_date || "");
    setIsAddModalOpen(true);
  };

  // 6. Submit Add / Edit Form
  const handleSaveRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setErrorMessage("பெயர் அவசியம் (Name is required)");
      return;
    }

    if (!formDob.trim() && !formAnni.trim()) {
      setErrorMessage(
        "பிறந்தநாள் அல்லது திருமண நாள் தேதிகளில் ஒன்றையாவது குறிப்பிட வேண்டும்."
      );
      return;
    }

    setActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (editingRecord) {
        // PATCH existing
        const res = await fetch(`/api/admin/celebrations/${editingRecord.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName.trim(),
            date_of_birth: formDob.trim() || null,
            anniversary_date: formAnni.trim() || null,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Update failed");

        setSuccessMessage("பதிவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது (Record updated successfully)!");
      } else {
        // POST new
        const res = await fetch("/api/admin/celebrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName.trim(),
            date_of_birth: formDob.trim() || null,
            anniversary_date: formAnni.trim() || null,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Creation failed");

        setSuccessMessage("புதிய பதிவு வெற்றிகரமாக சேர்க்கப்பட்டது (New record added)!");
      }

      setIsAddModalOpen(false);
      fetchRecords();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Action failed";
      setErrorMessage(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // 7. Delete Record
  const handleDeleteRecord = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `"${name}" அவர்களின் பிறந்தநாள்/திருமண நாள் பதிவை நீக்க விரும்புகிறீர்களா?`
    );
    if (!confirmed) return;

    setActionLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/admin/celebrations/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }

      setSuccessMessage("பதிவு வெற்றிகரமாக நீக்கப்பட்டது (Record deleted)!");
      setRecords((prev) => prev.filter((r) => r.id !== id));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      setErrorMessage(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Alert Banners */}
      {errorMessage && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-crimson/50 bg-crimson/15 p-4 text-xs sm:text-sm text-red-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-red-300 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-emerald-500/50 bg-emerald-500/15 p-4 text-xs sm:text-sm text-emerald-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-300 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Grid: Excel Import & Search/List */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: EXCEL UPLOAD & PREVIEW (5 cols on lg)             */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 rounded-3xl border border-white/15 bg-navy-900/70 backdrop-blur-md p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center gap-2 text-gold-light">
            <FileSpreadsheet size={22} className="text-gold" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              Excel கோப்பு பதிவேற்றம் (Excel Import)
            </h2>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Upload your church members&apos; Excel file (<code className="text-gold">.xlsx</code> or{" "}
            <code className="text-gold">.xls</code>). Records are automatically matched and merged by member name.
          </p>

          {/* Import Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              பதிவேற்ற வகை (Import Type)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setImportType("birthday");
                  setPreviewItems([]);
                  setUploadFile(null);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                  importType === "birthday"
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <Cake size={16} />
                <span>🎂 பிறந்தநாள் (Birthday)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setImportType("anniversary");
                  setPreviewItems([]);
                  setUploadFile(null);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all ${
                  importType === "anniversary"
                    ? "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-md"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <Heart size={16} />
                <span>💐 திருமண நாள் (Anniversary)</span>
              </button>
            </div>
          </div>

          {/* Upload Drop Zone */}
          <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-6 text-center hover:border-gold/50 transition-colors">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
              id={fileInputId}
            />
            <label
              htmlFor={fileInputId}
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="h-12 w-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold">
                {parsingFile ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-200">
                {uploadFile ? uploadFile.name : "Excel கோப்பைத் தேர்ந்தெடுக்கவும் (Choose .xlsx)"}
              </span>
              <span className="text-[11px] text-slate-400">
                {importType === "birthday"
                  ? "எதிர்பார்க்கும் தலைப்புகள்: Name, Date of Birth"
                  : "எதிர்பார்க்கும் தலைப்புகள்: Husband/Wife Names, Anniversary Date"}
              </span>
            </label>
          </div>

          {/* Import Result Feedback */}
          {importResult && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs space-y-1 text-emerald-200">
              <div className="font-bold text-sm text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 size={16} />
                <span>இறக்குமதி முடிந்தது (Import Complete)</span>
              </div>
              <p>மொத்தம் ஆராயப்பட்டது: {importResult.total}</p>
              <p>புதிதாக சேர்க்கப்பட்டது: {importResult.imported}</p>
              <p>புதுப்பிக்கப்பட்டது (Merged): {importResult.updated}</p>
              <p>தவிர்க்கப்பட்டது: {importResult.skipped}</p>
            </div>
          )}

          {/* Preview Section if File Parsed */}
          {previewItems.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gold">
                  மாதிரி முன்னோட்டம் (Found {previewItems.length} rows)
                </span>
                <span className="text-[11px] text-slate-400">Showing first 5 rows</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/80">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-white/5 text-slate-300 border-b border-white/10">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Parsed Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {previewItems.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="text-slate-300">
                        <td className="p-2 text-slate-500">{idx + 1}</td>
                        <td className="p-2 font-medium truncate max-w-[140px]">{row.name}</td>
                        <td className="p-2">
                          {row.parsedDate ? (
                            <span className="text-emerald-400 font-semibold">{row.parsedDate}</span>
                          ) : (
                            <span className="text-red-400">Invalid</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                disabled={importing}
                onClick={handleConfirmImport}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold to-amber-500 py-3 text-xs sm:text-sm font-black text-navy-950 shadow-lg hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
              >
                {importing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>தரவுதளத்தில் சேர்க்கிறது (Importing {previewItems.length} records)...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>இறக்குமதியை உறுதிசெய் (Confirm & Import {previewItems.length} Rows)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: SEARCH, CRUD LIST & PAGINATION (7 cols on lg)    */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-navy-900/70 backdrop-blur-md p-6 sm:p-7 shadow-xl space-y-6">
          {/* Header Row with Add Button */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <UserCheck size={20} className="text-gold" />
                <span>திருச்சபை உறுப்பினர்கள் விபரங்கள்</span>
              </h2>
              <p className="text-xs text-slate-400">
                மொத்த பதிவுகள்: <span className="font-bold text-gold">{totalCount}</span> நபர்கள்
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchRecords}
                title="Refresh list"
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10"
              >
                <RefreshCw size={15} className={loading ? "animate-spin text-gold" : ""} />
              </button>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gold hover:bg-amber-400 px-3.5 py-2 text-xs font-black text-navy-950 shadow transition-all active:scale-95"
              >
                <Plus size={15} />
                <span>புதிய நபர் சேர் (Add Person)</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="பெயர் மூலம் தேடுக... (Search member name)"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {/* Records Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/60">
            {loading ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                <Loader2 size={24} className="animate-spin text-gold mx-auto mb-2" />
                பதிவுகள் ஏற்றப்படுகின்றன (Loading records)...
              </div>
            ) : records.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs px-4">
                {searchQuery
                  ? `"${searchQuery}" என்ற பெயரில் பதிவுகள் எதுவும் இல்லை.`
                  : "இன்னும் பதிவுகள் எதுவும் இல்லை. Excel கோப்பை பதிவேற்றவும் அல்லது புதிய நபரைச் சேர்க்கவும்."}
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-300 border-b border-white/10 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">பெயர் (Member Name)</th>
                    <th className="py-3 px-4">பிறந்தநாள் (DOB)</th>
                    <th className="py-3 px-4">திருமண நாள் (Anniv)</th>
                    <th className="py-3 px-4 text-right">செயல்கள் (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {records.map((rec) => (
                    <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-100">{rec.name}</td>
                      <td className="py-3.5 px-4">
                        {rec.date_of_birth ? (
                          <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                            <Cake size={13} />
                            {rec.date_of_birth}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {rec.anniversary_date ? (
                          <span className="inline-flex items-center gap-1 text-rose-300 font-semibold">
                            <Heart size={13} />
                            {rec.anniversary_date}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(rec)}
                          className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10"
                          title="திருத்து (Edit)"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord(rec.id, rec.name)}
                          className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white transition-colors"
                          title="நீக்கு (Delete)"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalCount > limit && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <span>
                Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalCount)} of {totalCount}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40"
                >
                  முந்தைய (Prev)
                </button>
                <span>Page {page}</span>
                <button
                  type="button"
                  disabled={page * limit >= totalCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40"
                >
                  அடுத்தது (Next)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT PERSON MODAL                                 */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-overlay-fade-in">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-navy-900 p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-white">
                {editingRecord ? "பதிவைத் திருத்துக (Edit Member)" : "புதிய நபர் சேர்க்க (Add Member)"}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  பெயர் (Full Name / Couple Names) *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="உதாரணம்: திரு. யோவான் / Mr. John"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                  <Cake size={14} className="text-amber-400" />
                  <span>பிறந்தநாள் (Date of Birth)</span>
                </label>
                <input
                  type="date"
                  value={formDob}
                  onChange={(e) => setFormDob(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white focus:border-gold focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">YYYY-MM-DD</span>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                  <Heart size={14} className="text-rose-400" />
                  <span>திருமண நாள் (Anniversary Date)</span>
                </label>
                <input
                  type="date"
                  value={formAnni}
                  onChange={(e) => setFormAnni(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-white focus:border-gold focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">YYYY-MM-DD</span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white"
                >
                  ரத்துசெய் (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-gold hover:bg-amber-400 text-navy-950 font-black shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading && <Loader2 size={14} className="animate-spin" />}
                  <span>சேமி (Save Record)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

