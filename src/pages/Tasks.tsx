import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, CheckCircle2, Circle, Sparkles, CheckSquare } from 'lucide-react';
import { Modal } from '../components/Modal';
import clsx from 'clsx';

export const Tasks = () => {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState<any[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const isAdmin = user?.role === 'admin';

  const fetchMembers = async () => {
    try {
      const res = await axios.get('/api/members');
      setMembers(res.data);
      if (res.data.length > 0 && !activeTabId) {
        // If current logged-in user is in members, default to them, otherwise first member
        const userMember = res.data.find((m: any) => m._id === user?.id);
        setActiveTabId(userMember ? userMember._id : res.data[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch members', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openAddModal = () => {
    setCurrentTask(null);
    setFormData({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (task: any) => {
    setCurrentTask(task);
    setFormData({ title: task.title, description: task.description || '' });
    setIsModalOpen(true);
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTabId) return;
    try {
      if (currentTask) {
        await axios.put(`/api/members/${activeTabId}/tasks/${currentTask._id}`, formData);
      } else {
        await axios.post(`/api/members/${activeTabId}/tasks`, formData);
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      alert('Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/api/members/${activeTabId}/tasks/${taskId}`);
      fetchMembers();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'incomplete' : 'completed';
    try {
      await axios.patch(`/api/members/${activeTabId}/tasks/${taskId}/status`, { status: newStatus });
      fetchMembers();
    } catch (err) {
      alert('Failed to update task status. Ensure you have permission.');
    }
  };

  const activeMember = members.find(m => m._id === activeTabId);
  const canToggleStatus = user?.id === activeTabId;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-16 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-3 rounded-full border-t-[var(--color-lavender)] border-r-[var(--color-mint)] border-b-[var(--color-bg-elevated)] border-l-[var(--color-bg-elevated)] animate-spin" />
          <div className="absolute inset-0 rounded-full blur-sm bg-gradient-to-tr from-[var(--color-lavender)] to-[var(--color-mint)] opacity-30 animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-[var(--color-text-muted)] tracking-wider uppercase">Loading Tasks...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-[var(--color-text-muted)] text-center">
        <CheckSquare className="w-12 h-12 mb-3 opacity-40 text-[var(--color-lavender)]" />
        <p className="text-xl font-bold text-white">No members found</p>
        {isAdmin && <p className="mt-2 text-sm text-[var(--color-text-muted)]">Add team members first from the Members directory.</p>}
      </div>
    );
  }

  const completedCount = activeMember?.tasks?.filter((t: any) => t.status === 'completed').length ?? 0;
  const totalCount = activeMember?.tasks?.length ?? 0;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg-base)]">
      {/* Top Member Tabs Bar */}
      <div className="shrink-0 bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] sticky top-0 z-20 shadow-sm backdrop-blur-md">
        <div className="flex overflow-x-auto hide-scrollbar px-4 sm:px-6 py-3 gap-2 max-w-7xl mx-auto">
          {members.map(member => {
            const isSelected = activeTabId === member._id;
            const isMe = user?.id === member._id;
            return (
              <button
                key={member._id}
                onClick={() => setActiveTabId(member._id)}
                className={clsx(
                  'px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 rounded-xl whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer',
                  isSelected
                    ? 'btn-dual text-[#0f1015] shadow-[0_4px_16px_rgba(189,166,247,0.3)]'
                    : 'bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-white border border-[var(--color-border-subtle)]'
                )}
              >
                <span>{member.name.split(' ')[0]}</span>
                {isMe && (
                  <span className={clsx(
                    'text-[10px] font-black uppercase px-1.5 py-0.2 rounded',
                    isSelected ? 'bg-black/20 text-[#0f1015]' : 'bg-[var(--color-mint-muted)] text-[var(--color-mint-dark)]'
                  )}>
                    me
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {/* Task header banner */}
          <div className="card p-5 sm:p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-lavender)] via-[var(--color-lavender-light)] to-[var(--color-mint)] opacity-60" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-lavender-muted)] border border-[var(--color-border)] mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-lavender)]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-lavender-light)]">
                    Task Workspace
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  {activeMember?.name}'s Tasks
                </h2>
                <div className="flex flex-wrap items-center gap-2.5 mt-2">
                  <span className="badge-completed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-mint)] shadow-[0_0_6px_var(--color-mint)]" />
                    {completedCount} Completed
                  </span>
                  <span className="badge-incomplete">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-mint-dark)]" />
                    {totalCount - completedCount} Pending
                  </span>
                  <span className="text-xs font-bold text-[var(--color-text-muted)] ml-1">
                    ({progressPct}% finished)
                  </span>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={openAddModal}
                  className="btn-dual flex items-center gap-2 self-start sm:self-auto text-xs sm:text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign New Task</span>
                </button>
              )}
            </div>

            {/* Progress Bar inside banner */}
            <div className="mt-5 pt-4 border-t border-[var(--color-border-subtle)]">
              <div className="h-2 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden p-0.5 border border-[var(--color-border-subtle)]">
                <div
                  className="h-full rounded-full transition-all duration-600 ease-out"
                  style={{
                    width: `${progressPct}%`,
                    background: `linear-gradient(90deg, var(--color-mint-dark), var(--color-mint))`,
                    boxShadow: progressPct > 0 ? '0 0 10px rgba(171,236,218,0.3)' : 'none',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tasks list */}
          {totalCount === 0 ? (
            <div className="card flex flex-col items-center justify-center p-12 sm:p-16 text-center border-dashed">
              <CheckSquare className="w-12 h-12 text-[var(--color-text-muted)] mb-3 opacity-40" />
              <p className="text-base font-bold text-white">No tasks assigned yet</p>
              {isAdmin && <p className="text-sm text-[var(--color-text-muted)] mt-1">Click "Assign New Task" above to get started.</p>}
            </div>
          ) : (
            <div className="space-y-3">
              {activeMember.tasks.map((task: any) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task._id}
                    className={clsx(
                      'group flex items-start justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-250',
                      isDone
                        ? 'bg-[var(--color-bg-card)]/60 border-[rgba(171,236,218,0.2)] shadow-sm'
                        : 'bg-[var(--color-bg-card)] border-[var(--color-border)] hover:border-[var(--color-border-lavender)] hover:shadow-lg'
                    )}
                  >
                    <div className="flex items-start flex-1 gap-3.5 mr-3">
                      {/* Status toggle button */}
                      <button
                        onClick={() => canToggleStatus && toggleTaskStatus(task._id, task.status)}
                        disabled={!canToggleStatus}
                        className={clsx(
                          'shrink-0 mt-0.5 transition-all duration-200',
                          canToggleStatus ? 'cursor-pointer hover:scale-115 active:scale-95' : 'cursor-not-allowed opacity-40',
                          isDone ? 'text-[var(--color-mint-light)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-lavender)]'
                        )}
                        title={canToggleStatus ? (isDone ? 'Mark as incomplete' : 'Mark as completed') : 'Only the task owner can toggle this'}
                      >
                        {isDone
                          ? <CheckCircle2 className="w-6 h-6 shadow-[0_0_12px_rgba(171,236,218,0.2)]" />
                          : <Circle className="w-6 h-6" />
                        }
                      </button>

                      <div className="min-w-0 flex-1">
                        <h4 className={clsx(
                          'text-sm sm:text-base font-bold leading-snug transition-colors',
                          isDone
                            ? 'line-through text-[var(--color-mint-dark)]'
                            : 'text-white group-hover:text-[var(--color-lavender-light)]'
                        )}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className={clsx(
                            'mt-1 text-xs sm:text-sm font-medium leading-relaxed',
                            isDone ? 'text-[var(--color-mint-dark)]/70' : 'text-[var(--color-text-secondary)]'
                          )}>
                            {task.description}
                          </p>
                        )}
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className={isDone ? 'badge-completed text-[11px]' : 'badge-incomplete text-[11px]'}>
                            {isDone ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0 bg-[var(--color-bg-elevated)] p-1 rounded-xl border border-[var(--color-border-subtle)]">
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-bg-hover)] rounded-lg transition-all cursor-pointer"
                          aria-label="Edit task"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1.5 text-[var(--color-text-muted)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTask ? 'Edit Task' : 'Assign New Task'}
      >
        <form onSubmit={handleTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Task Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input-field text-sm mt-1"
              placeholder="e.g. Implement Responsive Navigation"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Description <span className="font-normal text-[var(--color-text-muted)] lowercase">(optional)</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field text-sm mt-1 resize-none"
              placeholder="Provide context or acceptance criteria for this task..."
            />
          </div>
          <div className="pt-2">
            <button type="submit" className="btn-dual w-full text-sm">
              {currentTask ? 'Save Changes' : 'Assign Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
