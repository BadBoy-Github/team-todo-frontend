import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Users, CheckCircle2, Moon, ListChecks, TrendingUp, Sparkles, Loader2 } from 'lucide-react';

export const Dashboard = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/members')
      .then(res => setMembers(res.data))
      .catch(err => console.error('Failed to fetch members', err))
      .finally(() => setLoading(false));
  }, []);

  let totalTasks    = 0;
  let completedTasks  = 0;
  let inProgressTasks = 0;
  let dormantTasks    = 0;

  const chartData = members.map(member => {
    let completed = 0;
    let pending   = 0;
    member.tasks.forEach((task: any) => {
      totalTasks++;
      if (task.status === 'completed') { completed++; completedTasks++; }
      else if (task.status === 'in_progress') { pending++; inProgressTasks++; }
      else { pending++; dormantTasks++; }
    });
    return { name: member.name.split(' ')[0], Completed: completed, Pending: pending };
  });

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const statCards = [
    {
      label: 'Total Members',
      value: members.length,
      icon: Users,
      color: 'var(--color-lavender)',
      accentBg: 'rgba(189, 166, 247, 0.12)',
      borderAccent: 'rgba(189, 166, 247, 0.3)',
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: ListChecks,
      color: 'var(--color-mint)',
      accentBg: 'rgba(171, 236, 218, 0.12)',
      borderAccent: 'rgba(171, 236, 218, 0.3)',
    },
    {
      label: 'Dormant',
      value: dormantTasks,
      icon: Moon,
      color: 'var(--color-text-muted)',
      accentBg: 'rgba(100, 107, 128, 0.12)',
      borderAccent: 'rgba(100, 107, 128, 0.25)',
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      icon: Loader2,
      color: 'var(--color-lavender)',
      accentBg: 'rgba(189, 166, 247, 0.1)',
      borderAccent: 'rgba(189, 166, 247, 0.25)',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'var(--color-mint-light)',
      accentBg: 'rgba(203, 245, 234, 0.12)',
      borderAccent: 'rgba(203, 245, 234, 0.3)',
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-16 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-3 rounded-full border-t-[var(--color-lavender)] border-r-[var(--color-mint)] border-b-[var(--color-bg-elevated)] border-l-[var(--color-bg-elevated)] animate-spin" />
          <div className="absolute inset-0 rounded-full blur-sm bg-gradient-to-tr from-[var(--color-lavender)] to-[var(--color-mint)] opacity-30 animate-pulse" />
        </div>
        <p className="text-sm font-semibold text-[var(--color-text-muted)] tracking-wider uppercase">Loading VitaSyn...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Header with Dual-Tone Accents */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--color-border-subtle)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-lavender-muted)] border border-[var(--color-border)] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-lavender)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-lavender-light)]">
              Workspace Overview
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-muted)] font-medium">
            Real-time performance metrics and task distribution across team members
          </p>
        </div>

        {/* Completion Pill */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-sm self-start sm:self-auto">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-lavender-muted)] to-[var(--color-mint-muted)] text-[var(--color-mint)]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white">{completionRate}%</span>
              <span className="text-[10px] font-bold text-[var(--color-mint-dark)] uppercase">Done</span>
            </div>
            <p className="text-[11px] font-semibold text-[var(--color-text-muted)]">Overall Progress</p>
          </div>
        </div>
      </div>

      {/* Stat Cards with Dual Tone and Micro Animations */}
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-5">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card group p-4 sm:p-6 overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ background: stat.color }}
              />

              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: stat.accentBg, border: `1px solid ${stat.borderAccent}` }}
                >
                  <Icon className="w-5 h-5 sm:w-5 sm:h-5" style={{ color: stat.color }} />
                </div>
              </div>

              <p className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="card p-5 sm:p-7 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Tasks Distribution</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border-subtle)]">
                per member
              </span>
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Comparison of completed vs pending tasks per member</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-bold self-start sm:self-auto bg-[var(--color-bg-elevated)] px-3 py-1.5 rounded-xl border border-[var(--color-border-subtle)]">
            <span className="inline-flex items-center gap-1.5 text-[var(--color-mint-light)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-mint-light)] shadow-[0_0_6px_var(--color-mint)]" />
              Completed
            </span>
            <span className="inline-flex items-center gap-1.5 text-[var(--color-lavender)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-lavender)]" />
              Pending
            </span>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 text-[var(--color-text-muted)] text-sm">
            <ListChecks className="w-10 h-10 mb-2 opacity-40 text-[var(--color-lavender)]" />
            <p>No task data recorded yet.</p>
          </div>
        ) : (
          <div className="h-72 sm:h-84 lg:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }} barSize={24} barGap={6}>
                <defs>
                  {/* Gradients for elite dual-tone bars */}
                  <linearGradient id="mintCompletedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cbf5ea" stopOpacity={1} />
                    <stop offset="100%" stopColor="#58cfad" stopOpacity={0.85} />
                  </linearGradient>
                  <linearGradient id="mintIncompleteGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#58cfad" stopOpacity={0.75} />
                    <stop offset="100%" stopColor="#1c3d33" stopOpacity={0.65} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-text-muted)"
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-text-muted)"
                  tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(189, 166, 247, 0.05)' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const completed = payload[0]?.value || 0;
                      const pending   = payload[1]?.value || 0;
                      const total = Number(completed) + Number(pending);
                      return (
                        <div className="p-3 bg-[var(--color-bg-elevated)] border border-[var(--color-border-lavender)] rounded-xl shadow-2xl backdrop-blur-md">
                          <p className="text-xs font-black text-white uppercase tracking-wider mb-2">{label}</p>
                          <div className="space-y-1 text-xs">
                            <p className="flex items-center justify-between gap-4 font-bold text-[var(--color-mint-light)]">
                              <span>Completed:</span>
                              <span>{completed}</span>
                            </p>
                            <p className="flex items-center justify-between gap-4 font-bold text-[var(--color-lavender)]">
                              <span>Pending:</span>
                              <span>{pending}</span>
                            </p>
                            <div className="pt-1.5 mt-1 border-t border-[var(--color-border-subtle)] flex items-center justify-between font-extrabold text-[var(--color-text-primary)]">
                              <span>Total:</span>
                              <span>{total}</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="Completed" fill="url(#mintCompletedGrad)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Pending" fill="url(#mintIncompleteGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};
