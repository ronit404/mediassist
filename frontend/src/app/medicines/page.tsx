'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight, Pill, Sparkles, RefreshCw } from 'lucide-react';
import { getMedicines } from '@/lib/api';
import { Medicine } from '@/types';
import { isPrescriptionRequired } from '@/lib/utils';
import MedicineCard from '@/components/ui/MedicineCard';
import { GridSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import DisclaimerCard from '@/components/ui/DisclaimerCard';

const ITEMS_PER_PAGE = 21;

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [totalCount, setTotalCount] = useState<number>(3978);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<string>('');
  const [rxFilter, setRxFilter] = useState<'ALL' | 'YES' | 'NO'>('ALL');
  const [sortBy, setSortBy] = useState<'RELEVANCE' | 'A_Z' | 'Z_A'>('RELEVANCE');
  const [loading, setLoading] = useState<boolean>(true);

  // Debounce search input by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setActiveSearch(searchTerm.trim());
      setCurrentPage(1); // Reset to page 1 on new search
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch medicines from FastAPI / MongoDB
  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      const skip = (currentPage - 1) * ITEMS_PER_PAGE;
      const data = await getMedicines({
        limit: ITEMS_PER_PAGE,
        skip,
        search: activeSearch || undefined,
        rx: rxFilter,
      });

      let results = data.medicines || [];

      // Apply sorting
      if (sortBy === 'A_Z') {
        results.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'Z_A') {
        results.sort((a, b) => b.name.localeCompare(a.name));
      }

      setMedicines(results);
      setTotalCount(data.total !== undefined ? data.total : 3978);
    } catch (err) {
      console.error('Failed to load medicines:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeSearch, rxFilter, sortBy]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const handleRxFilterChange = (val: 'ALL' | 'YES' | 'NO') => {
    setRxFilter(val);
    setCurrentPage(1); // Reset page to 1
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 text-xs font-bold">
          <Pill className="w-3.5 h-3.5" />
          <span>Verified Pharmaceutical Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Medicine Explorer</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Explore verified pharmaceutical monographs, active salt formulations, manufacturers, and clinical indications across {totalCount.toLocaleString()}+ medicines.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-3xl p-4 sm:p-6 space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by drug name (e.g. Paracetamol, Pantoprazole, Amoxicillin)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Rx Filter Buttons */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleRxFilterChange('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  rxFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleRxFilterChange('YES')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  rxFilter === 'YES'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Rx Only
              </button>
              <button
                onClick={() => handleRxFilterChange('NO')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  rxFilter === 'NO'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                OTC Only
              </button>
            </div>

            {/* Sorting Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none focus:border-sky-500"
            >
              <option value="RELEVANCE">Sort: Relevance</option>
              <option value="A_Z">Sort: A to Z</option>
              <option value="Z_A">Sort: Z to A</option>
            </select>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{startItem}–{endItem}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{totalCount.toLocaleString()}</strong> medicines
          </span>
          {activeSearch && (
            <span className="text-sky-600 dark:text-sky-400 font-bold">
              Filtering by: &ldquo;{activeSearch}&rdquo;
            </span>
          )}
        </div>
      </div>

      {/* Medicines Grid or Loading Skeleton */}
      {loading ? (
        <GridSkeleton count={21} />
      ) : medicines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Medications Found"
          description={`No medicines matched your criteria "${activeSearch || rxFilter}". Try clearing your filters or search keywords.`}
          onRetry={() => {
            setSearchTerm('');
            setActiveSearch('');
            setRxFilter('ALL');
            setCurrentPage(1);
          }}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Page <strong className="text-slate-900 dark:text-white">{currentPage}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 transition-all border border-slate-200 dark:border-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 transition-all border border-slate-200 dark:border-slate-800"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <DisclaimerCard />
    </div>
  );
}
