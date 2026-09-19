import { useState, useEffect, useContext, type FormEvent, type ChangeEvent } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, User as UserIcon, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { ConfirmModal } from '../components/ConfirmModal';

const inputCls = "input-field text-sm mt-1";

export const Members = () => {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', age: '', sex: 'Male',
  });

  // Custom modals (replaces native window.confirm & alert)
  const [memberToDelete, setMemberToDelete] = useState<any>(null);
  const [isDeletingMember, setIsDeletingMember] = useState(false);
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: 'danger' | 'warning' | 'info' | 'success';
  }>({
    isOpen: false,
    title: '',
    message: '',
    variant: 'danger',
  });

  const showAlert = (title: string, message: string, variant: 'danger' | 'warning' | 'info' | 'success' = 'danger') => {
    setAlertDialog({ isOpen: true, title, message, variant });
  };

  const isAdmin = user?.role === 'admin';

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/members');
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const openAddModal = () => {
    setCurrentMember(null);
    setFormData({ name: '', email: '', password: '', phone: '', age: '', sex: 'Male' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setCurrentMember(member);
    setFormData({ name: member.name, email: member.email, password: '', phone: member.phone || '', age: member.age || '', sex: member.sex || 'Male' });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;
    setIsDeletingMember(true);
    try {
      await axios.delete(`/api/members/${memberToDelete._id}`);
      setMembers(members.filter((m) => m._id !== memberToDelete._id));
      setMemberToDelete(null);
    } catch (err) {
      console.error('Failed to delete member', err);
      setMemberToDelete(null);
      showAlert('Delete Failed', 'Failed to delete member. Please try again.');
    } finally {
      setIsDeletingMember(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (currentMember) {
        await axios.put(`/api/members/${currentMember._id}`, formData);
      } else {
        await axios.post('/api/members', formData);
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (err: any) {
      showAlert('Save Failed', err.response?.data?.message || 'Failed to save member profile.');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-16 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-3 rounded-full border-t-[var(--color-lavender)] border-r-[var(--color-mint)] border-b-[var(--color-bg-elevated)] border-l-[var(--color-bg-elevated)] animate-spin" />
          <div className="absolute inset-0 rounded-full blur-sm bg-gradient-to-tr from-[var(--color-lavender)] to-[var(--color-mint)] opacity-30 animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-[var(--color-text-muted)] tracking-wider uppercase">Loading Members...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-lavender-muted)] border border-[var(--color-border)] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-lavender)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-lavender-light)]">
              Team Directory
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Team Members
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)] font-medium">
            Manage your team, track assigned tasks, and configure individual accounts ({members.length} total)
          </p>
        </div>

        {isAdmin && (
          <button 
            onClick={openAddModal} 
            className="btn-dual flex items-center gap-2 self-start sm:self-auto text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Cards grid */}
      {members.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-16 text-center">
          <UserIcon className="w-12 h-12 text-[var(--color-text-muted)] mb-4 opacity-50" />
          <p className="text-base font-bold text-white">No members yet</p>
          {isAdmin && <p className="text-sm text-[var(--color-text-muted)] mt-1">Click "Add Member" to onboard your first team member.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => {
            const completed = member.tasks?.filter((t: any) => t.status === 'completed').length ?? 0;
            const inProgress = member.tasks?.filter((t: any) => t.status === 'in_progress').length ?? 0;
            const dormant = member.tasks?.filter((t: any) => t.status !== 'completed' && t.status !== 'in_progress').length ?? 0;
            const total = member.tasks?.length ?? 0;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            const canEdit = isAdmin || user?.id === member._id;
            const isCurrentUser = user?.id === member._id;

            return (
              <div 
                key={member._id} 
                className="card group flex flex-col overflow-hidden"
              >
                {/* Dual-Tone Top Border Glow */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-lavender)] via-[var(--color-lavender-light)] to-[var(--color-mint)] opacity-40 group-hover:opacity-100 transition-opacity" />

                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  {/* Avatar + name */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-lavender-dark)] text-[#0f1015] text-lg font-black shrink-0 shadow-[0_4px_16px_rgba(189,166,247,0.3)]">
                          {member.name?.charAt(0).toUpperCase()}
                        </div>
                        {isCurrentUser && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-mint)] opacity-75" />
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--color-mint)] border-2 border-[var(--color-bg-card)]" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white truncate group-hover:text-[var(--color-lavender-light)] transition-colors">
                            {member.name}
                          </h3>
                          {isCurrentUser && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--color-mint-muted)] text-[var(--color-mint-dark)] border border-[rgba(171,236,218,0.2)]">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] truncate font-medium">{member.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details pill list */}
                  <div className="space-y-2 text-xs font-semibold my-2 p-3 rounded-xl bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)]">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--color-text-muted)]">User ID</span>
                      <span className="font-mono text-[11px] bg-[var(--color-bg-surface)] px-2 py-0.5 rounded-md text-[var(--color-lavender-light)] border border-[var(--color-border)]">
                        {member.userId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--color-text-muted)]">Phone</span>
                      <span className="text-[var(--color-text-secondary)]">{member.phone || '—'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--color-text-muted)]">Age / Sex</span>
                      <span className="text-[var(--color-text-secondary)]">{member.age || '—'} · {member.sex || '—'}</span>
                    </div>
                  </div>

                  {/* Task progress */}
                  <div className="mt-auto pt-4 border-t border-[var(--color-border-subtle)]">
                    <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                      <span className="text-[var(--color-text-muted)] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-mint)]" />
                        Tasks Progress
                      </span>
                      <span className="text-[var(--color-mint-light)] font-mono">{completed}/{total} ({pct}%)</span>
                    </div>
                    <div
                      className="h-2 rounded-full bg-[var(--color-bg-surface)] overflow-hidden p-0.5 border border-[var(--color-border-subtle)]"
                      title={total > 0 ? `${completed} completed, ${inProgress} in progress, ${dormant} dormant` : 'No tasks assigned'}
                    >
                      {total > 0 ? (
                        <div className="h-full w-full rounded-full overflow-hidden flex">
                          {completed > 0 && (
                            <div
                              style={{
                                width: `${(completed / total) * 100}%`,
                                background: 'linear-gradient(90deg, var(--color-mint-dark), var(--color-mint))',
                                boxShadow: '0 0 8px rgba(171,236,218,0.3)',
                              }}
                              className="h-full transition-all duration-500 ease-out shrink-0"
                              title={`Completed: ${completed} (${Math.round((completed / total) * 100)}%)`}
                            />
                          )}
                          {inProgress > 0 && (
                            <div
                              style={{
                                width: `${(inProgress / total) * 100}%`,
                                background: 'linear-gradient(90deg, #9374eb, var(--color-lavender))',
                                boxShadow: '0 0 8px rgba(189,166,247,0.3)',
                              }}
                              className="h-full transition-all duration-500 ease-out shrink-0"
                              title={`In Progress: ${inProgress} (${Math.round((inProgress / total) * 100)}%)`}
                            />
                          )}
                          {dormant > 0 && (
                            <div
                              style={{
                                width: `${(dormant / total) * 100}%`,
                                background: 'linear-gradient(90deg, #4a5065, #8c93a8)',
                              }}
                              className="h-full transition-all duration-500 ease-out shrink-0"
                              title={`Dormant: ${dormant} (${Math.round((dormant / total) * 100)}%)`}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="h-full rounded-full" style={{ width: '0%' }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions bottom bar */}
                {canEdit && (
                  <div className="flex items-center border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]/70 divide-x divide-[var(--color-border)]">
                    <button
                      onClick={() => openEditModal(member)}
                      className="flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-bold text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-lavender-light)] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => setMemberToDelete(member)}
                        className="flex flex-1 items-center justify-center gap-2 py-2.5 text-xs font-bold text-[var(--color-text-secondary)] transition-all hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentMember ? 'Edit Member Profile' : 'Add New Team Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputCls} placeholder="Full Name" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputCls} placeholder="member@vitasyn.com" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Password{' '}
              {currentMember && (
                <span className="text-[var(--color-text-muted)] text-[11px] font-normal lowercase">(leave empty to keep unchanged)</span>
              )}
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required={!currentMember}
                value={formData.password}
                onChange={handleChange}
                className="input-field text-sm pr-10"
                placeholder={currentMember ? 'Enter new password' : 'Set password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-text-muted)] hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+91 98765 43210" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputCls} placeholder="26" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Sex</label>
              <select name="sex" value={formData.sex} onChange={handleChange} className={inputCls}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {!currentMember && (
            <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg-surface)] rounded-xl p-3 border border-[var(--color-border-subtle)] leading-relaxed">
              💡 A unique 13-character User ID will be automatically generated. The member can use their Email and Password to log in.
            </p>
          )}
          <div className="pt-2">
            <button type="submit" className="btn-dual w-full text-sm cursor-pointer">
              {currentMember ? 'Save Changes' : 'Create Team Member'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Custom Confirmation Modal: Delete Member ── */}
      <ConfirmModal
        isOpen={Boolean(memberToDelete)}
        onClose={() => setMemberToDelete(null)}
        onConfirm={confirmDeleteMember}
        title="Delete Team Member"
        message={`Are you sure you want to delete ${memberToDelete?.name}? All their assigned tasks and records will be permanently removed.`}
        confirmText="Delete Member"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletingMember}
      />

      {/* ── Custom Alert / Error Modal ── */}
      <ConfirmModal
        isOpen={alertDialog.isOpen}
        onClose={() => setAlertDialog(prev => ({ ...prev, isOpen: false }))}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
        confirmText="Okay"
      />
    </div>
  );
};
