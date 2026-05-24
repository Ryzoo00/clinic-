import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FileText, Download, Search, Calendar, Eye, X, AlertCircle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const DownloadReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await api.get('/api/reports');
      setReports(data.data || data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (report) => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(30, 64, 175);
      doc.text('Medical Report', 20, 30);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Report Type: ${report.type || 'General'}`, 20, 50);
      doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 20, 60);
      doc.text(`Doctor: ${report.doctorId?.name || 'N/A'}`, 20, 70);
      if (report.diagnosis) doc.text(`Diagnosis: ${report.diagnosis}`, 20, 85);
      if (report.notes) {
        doc.text('Notes:', 20, 100);
        const lines = doc.splitTextToSize(report.notes, 170);
        doc.text(lines, 20, 110);
      }
      doc.save(`report-${report._id?.slice(-6)}.pdf`);
      toast.success('Report downloaded!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-medical-500/20 border-t-medical-500 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-transparent border-r-medical-400/30 rounded-full animate-spin absolute inset-0" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  const filteredReports = reports.filter(r => {
    const matchesSearch = (r.type || '').toLowerCase().includes(searchTerm.toLowerCase()) || (r.diagnosis || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || r.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const reportTypes = ['all', ...new Set(reports.map(r => r.type).filter(Boolean))];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Medical Reports</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{reports.length} reports available</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search reports..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-xl border border-gray-100/50 dark:border-dark-700/50 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-medical-500/30 focus:border-medical-500 transition-all" />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-dark-700/50 rounded-xl p-1.5 border border-gray-100 dark:border-dark-700">
          {reportTypes.slice(0, 4).map(type => (
            <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filterType === type ? 'bg-white dark:bg-dark-700 text-medical-600 dark:text-medical-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.length === 0 ? (
          <div className="col-span-full relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No reports found</p>
          </div>
        ) : (
          filteredReports.map((report, idx) => (
            <div key={report._id} className="group relative bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl border border-gray-100/50 dark:border-dark-700/50 shadow-lg dark:shadow-gray-900/30 p-5 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => setSelectedReport(report)}>
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-medical-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200 shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate capitalize">{report.type || 'General Report'}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
              {report.diagnosis && (
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{report.diagnosis}</p>
              )}
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }} className="flex-1 px-3 py-1.5 bg-medical-50 dark:bg-medical-900/20 text-medical-700 dark:text-medical-400 rounded-lg text-xs font-medium hover:bg-medical-100 dark:hover:bg-medical-900/30 transition-colors border border-medical-200 dark:border-medical-800 flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button onClick={(e) => { e.stopPropagation(); downloadReport(report); }} className="px-3 py-1.5 bg-gray-50 dark:bg-dark-700/50 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors border border-gray-200 dark:border-dark-700">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedReport(null)}>
          <div className="relative bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-500 via-medical-400 to-medical-500"></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-medical-500 to-medical-600 rounded-xl flex items-center justify-center shadow-md">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{selectedReport.type || 'Report'}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(selectedReport.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedReport(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                {selectedReport.doctorId?.name && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Doctor</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dr. {selectedReport.doctorId.name}</p>
                  </div>
                )}
                {selectedReport.diagnosis && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Diagnosis</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedReport.diagnosis}</p>
                  </div>
                )}
                {selectedReport.notes && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-dark-700/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Notes</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedReport.notes}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-700 flex justify-end gap-3">
              <button onClick={() => setSelectedReport(null)} className="px-5 py-2 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">Close</button>
              <button onClick={() => { downloadReport(selectedReport); setSelectedReport(null); }} className="px-5 py-2 bg-gradient-to-r from-medical-500 to-medical-600 text-white rounded-xl text-sm font-medium hover:from-medical-600 hover:to-medical-700 shadow-lg shadow-medical-500/25 transition-all duration-200 inline-flex items-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadReports;
