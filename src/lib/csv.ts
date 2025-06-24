"use client";

import type { Business } from '@/types';

export function downloadCsv(data: Business[], filename: string = 'leads.csv') {
  if (!data || data.length === 0) {
    console.error('No data to export.');
    return;
  }

  // Define headers for object keys
  const headers = [
    'name', 
    'category', 
    'address', 
    'phone', 
    'email', 
    'website', 
    'rating', 
    'openingHours'
  ];
  
  // Define translated headers for the CSV file
  const translatedHeaders = [
    'nome',
    'categoria',
    'endereco',
    'telefone',
    'email',
    'website',
    'avaliacao',
    'horario_funcionamento'
  ];

  const headerRow = translatedHeaders.map(h => `"${h}"`).join(',');

  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = (row as any)[header];
      if (value === null || value === undefined) {
        return '""';
      }
      const stringValue = String(value);
      // Escape double quotes by doubling them, and wrap in double quotes
      return `"${stringValue.replace(/"/g, '""')}"`;
    }).join(',');
  });

  const csvString = [headerRow, ...csvRows].join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
