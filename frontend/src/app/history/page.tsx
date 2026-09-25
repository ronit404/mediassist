'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Trash2, ArrowRight, Eye, Calendar, Sparkles } from 'lucide-react';
import { fetchPatientHistory, deleteLocalHistoryItem, clearLocalHistory } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { AnalysisHistoryItem } from '@/types';
import { formatSymptomName } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';
import DisclaimerCard from '@/components/ui/DisclaimerCard';

export default function HistoryPage() {
  const { token, user } = useAuth();
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      if (token) {
        try {
          const items = await fetchPatientHistory(token);
          setHistory(items);
        } catch (e) {
          console.error('Failed to load history:', e);
        } finally {
          setLoading(false);
        }
      } else {
        setHistory([]);
        setLoading(false);
      }
    }
    loadHistory();
  }, [token, user]);

  const handleDelete = (id: string) => {
    deleteLocalHistoryItem(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your entire symptom analysis history?')) {
      clearLocalHistory();
      setHistory([]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-semibold">
            <History className="w-3.5 h-3.5" />
            <span>Health History Log</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Symptom Analysis History
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Review and manage previous symptom assessments conducted on this device.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History Records Table / Cards */}
      {history.length === 0 ? (
        <EmptyState
          title="No Past Analyses Recorded"
          description="You haven't run any symptom analyses on this device yet. Start your first clinical triage assessment."
          actionText="Run Symptom Checker"
          actionHref="/symptom-checker"
        />
      ) : (
        <div className="saas-card rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-4 px-6">Date &amp; Time</th>
                  <th className="py-4 px-6">Reported Symptoms</th>
                  <th className="py-4 px-6">Top Predicted Condition</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {history.map((item) => {
                  const topPred = item.predictions?.[0];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Date */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-900 dark:text-white">{item.date}</span>
                        </div>
                        {item.patientInfo?.age && (
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            Age: {item.patientInfo.age} yrs • {item.patientInfo.duration || 'N/A'}
                          </span>
                        )}
                      </td>

                      {/* Symptoms */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1 max-w-sm">
                          {item.symptoms.slice(0, 3).map((sym) => (
                            <span
                              key={sym}
                              className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700 font-medium"
                            >
                              {formatSymptomName(sym)}
                            </span>
                          ))}
                          {item.symptoms.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] text-slate-500 font-semibold">
                              +{item.symptoms.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Top Prediction */}
                      <td className="py-4 px-6">
                        {topPred ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-900 dark:text-white text-xs block">
                              {topPred.disease}
                            </span>
                            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
                              {topPred.confidence}% Match Confidence
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No prediction available</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <DisclaimerCard />
    </div>
  );
}
