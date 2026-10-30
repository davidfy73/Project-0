import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Edit2,
  Trash2,
  Filter,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../../store/useAdminStore';

// TODO: Operasi CRUD soal kuis nanti dihubungkan ke endpoint backend:
// GET /api/admin/questions, POST /api/admin/questions, PUT /api/admin/questions/:id, DELETE /api/admin/questions/:id

const questionSchema = z
  .object({
    category: z.enum(['module', 'preventive'], {
      required_error: 'Kategori wajib dipilih',
    }),
    question: z.string().min(10, 'Pertanyaan minimal 10 karakter'),
    optionA: z.string().min(1, 'Pilihan A wajib diisi'),
    optionB: z.string().min(1, 'Pilihan B wajib diisi'),
    optionC: z.string().min(1, 'Pilihan C wajib diisi'),
    optionD: z.string().min(1, 'Pilihan D wajib diisi'),
    correctIndex: z.coerce.number().min(0).max(3),
    explanation: z.string().min(1, 'Penjelasan wajib diisi'),
  })
  .refine(
    (data) => {
      const opts = [
        data.optionA.trim().toLowerCase(),
        data.optionB.trim().toLowerCase(),
        data.optionC.trim().toLowerCase(),
        data.optionD.trim().toLowerCase(),
      ];
      const unique = new Set(opts);
      return unique.size === 4;
    },
    {
      message: '4 pilihan jawaban harus berbeda (tidak boleh sama)',
      path: ['optionD'],
    }
  );

export default function AdminQuizPage() {
  const { questions, addQuestion, updateQuestion, deleteQuestion } = useAdminStore();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const filteredQuestions = questions.filter((q) => {
    if (categoryFilter === 'all') return true;
    return q.category === categoryFilter;
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      category: 'module',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctIndex: 0,
      explanation: '',
    },
  });

  const selectedCorrect = watch('correctIndex');

  useEffect(() => {
    if (modalMode === 'edit' && editingQuestion) {
      reset({
        category: editingQuestion.category,
        question: editingQuestion.question,
        optionA: editingQuestion.options[0] || '',
        optionB: editingQuestion.options[1] || '',
        optionC: editingQuestion.options[2] || '',
        optionD: editingQuestion.options[3] || '',
        correctIndex: editingQuestion.correctIndex ?? 0,
        explanation: editingQuestion.explanation || '',
      });
    } else if (modalMode === 'add') {
      reset({
        category: 'module',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctIndex: 0,
        explanation: '',
      });
    }
  }, [modalMode, editingQuestion, reset]);

  const onFormSubmit = (data) => {
    const formattedData = {
      category: data.category,
      question: data.question.trim(),
      options: [
        data.optionA.trim(),
        data.optionB.trim(),
        data.optionC.trim(),
        data.optionD.trim(),
      ],
      correctIndex: Number(data.correctIndex),
      explanation: data.explanation.trim(),
    };

    if (modalMode === 'add') {
      addQuestion(formattedData);
      toast.success('Soal baru berhasil ditambahkan');
    } else if (modalMode === 'edit' && editingQuestion) {
      updateQuestion(editingQuestion.id, formattedData);
      toast.success('Soal berhasil diperbarui');
    }

    setModalMode(null);
    setEditingQuestion(null);
  };

  const handleConfirmDelete = () => {
    if (!questionToDelete) return;
    deleteQuestion(questionToDelete.id);
    toast.success('Soal berhasil dihapus');
    setQuestionToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header Halaman (Tombol Tambah Soal) */}
      <div
        className="border-b pb-4 flex justify-end"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <button
          type="button"
          onClick={() => {
            setEditingQuestion(null);
            setModalMode('add');
          }}
          className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-all inline-flex items-center gap-2"
          style={{
            backgroundColor: 'var(--accent-primary)',
            color: 'var(--text-on-accent)',
            border: 'none',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
          }}
        >
          <Plus size={16} />
          <span>Tambah Soal</span>
        </button>
      </div>

      {/* Filter Kategori */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-medium flex items-center gap-1.5 mr-1" style={{ color: 'var(--text-muted)' }}>
          <Filter size={14} />
          <span>Filter:</span>
        </span>

        {[
          { key: 'all', label: 'Semua Kategori' },
          { key: 'module', label: 'Module' },
          { key: 'preventive', label: 'Preventive' },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setCategoryFilter(tab.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none"
            style={{
              backgroundColor: categoryFilter === tab.key ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: categoryFilter === tab.key ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              border: `1px solid ${categoryFilter === tab.key ? 'var(--accent-primary)' : 'var(--border-primary)'}`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daftar Soal */}
      <div className="space-y-3.5">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => {
            const isModule = q.category === 'module';
            return (
              <div
                key={q.id}
                className="rounded-2xl p-4 sm:p-5 border transition-all space-y-3"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                }}
              >
                {/* Header Kartu Soal */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-secondary)',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: isModule ? 'var(--accent-glow)' : 'rgba(32, 201, 151, 0.15)',
                        color: isModule ? 'var(--accent-light)' : 'var(--color-success)',
                        border: `1px solid ${isModule ? 'rgba(59, 130, 246, 0.3)' : 'rgba(32, 201, 151, 0.3)'}`,
                      }}
                    >
                      {q.category}
                    </span>
                  </div>

                  {/* Aksi Edit & Hapus */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingQuestion(q);
                        setModalMode('edit');
                      }}
                      className="p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      style={{
                        backgroundColor: 'var(--bg-elevated)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)',
                      }}
                      title="Edit Soal"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuestionToDelete(q)}
                      className="p-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      style={{
                        backgroundColor: 'rgba(255, 91, 100, 0.12)',
                        color: 'var(--color-danger)',
                        border: '1px solid rgba(255, 91, 100, 0.3)',
                      }}
                      title="Hapus Soal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Teks Pertanyaan */}
                <p className="text-sm font-semibold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {q.question}
                </p>

                {/* Opsi Jawaban (Ringkas) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === q.correctIndex;
                    const letter = ['A', 'B', 'C', 'D'][oIdx];
                    return (
                      <div
                        key={oIdx}
                        className="px-3 py-2 rounded-xl text-xs flex items-center gap-2 border"
                        style={{
                          backgroundColor: isCorrect ? 'rgba(32, 201, 151, 0.1)' : 'var(--bg-elevated)',
                          borderColor: isCorrect ? 'var(--color-success)' : 'var(--border-primary)',
                          color: isCorrect ? 'var(--color-success)' : 'var(--text-secondary)',
                        }}
                      >
                        <span className="font-bold font-mono">{letter}.</span>
                        <span className="truncate">{opt}</span>
                        {isCorrect && <CheckCircle2 size={13} className="ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Penjelasan */}
                <div
                  className="p-2.5 rounded-xl text-xs leading-relaxed border"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <strong style={{ color: 'var(--text-secondary)' }}>Penjelasan: </strong>
                  {q.explanation}
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="rounded-2xl p-12 text-center text-sm border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-muted)',
            }}
          >
            Tidak ada soal pada kategori ini
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit Soal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div
            className="w-full max-w-xl rounded-2xl p-5 sm:p-7 border shadow-2xl relative my-8"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setModalMode(null);
                setEditingQuestion(null);
              }}
              className="absolute right-4 top-4 p-1.5 rounded-lg cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              {modalMode === 'add' ? 'Tambah Soal Baru' : 'Edit Soal Kuis'}
            </h3>

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4" noValidate>
              {/* Kategori */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Kategori Materi
                </label>
                <select
                  {...register('category')}
                  className="w-full h-10 px-3 rounded-xl text-xs sm:text-sm outline-none transition-all cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value="module">Module (Ancaman Siber)</option>
                  <option value="preventive">Preventive (Pencegahan & Best Practice)</option>
                </select>
                {errors.category && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Teks Pertanyaan */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Pertanyaan (Min. 10 Karakter)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan pertanyaan kuis..."
                  {...register('question')}
                  className="w-full p-3 rounded-xl text-xs sm:text-sm outline-none transition-all resize-none"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: `1px solid ${errors.question ? 'var(--color-danger)' : 'var(--border-primary)'}`,
                    color: 'var(--text-primary)',
                  }}
                />
                {errors.question && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                    {errors.question.message}
                  </p>
                )}
              </div>

              {/* 4 Pilihan Jawaban (A-D) & Radio Jawaban Benar */}
              <div className="space-y-2.5">
                <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Pilihan Jawaban (Pilih radio untuk menandai jawaban benar)
                </label>

                {[
                  { key: 'optionA', label: 'A', idx: 0 },
                  { key: 'optionB', label: 'B', idx: 1 },
                  { key: 'optionC', label: 'C', idx: 2 },
                  { key: 'optionD', label: 'D', idx: 3 },
                ].map((item) => (
                  <div key={item.key}>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 cursor-pointer shrink-0 select-none">
                        <input
                          type="radio"
                          value={item.idx}
                          checked={Number(selectedCorrect) === item.idx}
                          onChange={() => setValue('correctIndex', item.idx)}
                          className="accent-[var(--color-success)] w-4 h-4 cursor-pointer"
                        />
                        <span className="font-bold font-mono text-xs w-4 text-center" style={{ color: 'var(--text-primary)' }}>
                          {item.label}
                        </span>
                      </label>

                      <input
                        type="text"
                        placeholder={`Teks pilihan jawaban ${item.label}`}
                        {...register(item.key)}
                        className="flex-1 h-10 px-3 rounded-xl text-xs outline-none transition-all"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          border: `1px solid ${errors[item.key] ? 'var(--color-danger)' : 'var(--border-primary)'}`,
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                    {errors[item.key] && (
                      <p className="text-xs mt-1 ml-9" style={{ color: 'var(--color-danger)' }}>
                        {errors[item.key].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Penjelasan */}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Penjelasan Singkat (Feedback)
                </label>
                <textarea
                  rows={2}
                  placeholder="Mengapa jawaban tersebut tepat/salah..."
                  {...register('explanation')}
                  className="w-full p-3 rounded-xl text-xs sm:text-sm outline-none transition-all resize-none"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    border: `1px solid ${errors.explanation ? 'var(--color-danger)' : 'var(--border-primary)'}`,
                    color: 'var(--text-primary)',
                  }}
                />
                {errors.explanation && (
                  <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                    {errors.explanation.message}
                  </p>
                )}
              </div>

              {/* Tombol Aksi */}
              <div className="pt-3 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-primary)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setModalMode(null);
                    setEditingQuestion(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-primary)',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--text-on-accent)',
                    border: 'none',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}
                >
                  {modalMode === 'add' ? 'Simpan Soal' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Soal */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl p-6 border shadow-2xl relative space-y-4"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: 'rgba(255, 91, 100, 0.15)',
                  color: 'var(--color-danger)',
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Hapus Soal Kuis?
              </h3>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Apakah Anda yakin ingin menghapus soal ini dari bank soal? Soal yang dihapus tidak akan lagi muncul dalam sesi kuis acak siswa.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-primary)',
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                style={{
                  backgroundColor: 'var(--color-danger)',
                  color: '#FFFFFF',
                  border: 'none',
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
