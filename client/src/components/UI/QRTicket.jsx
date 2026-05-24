import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Download,
  Printer,
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  MapPin,
  CheckCircle
} from 'lucide-react';

const QRTicket = ({ appointment, onClose }) => {
  if (!appointment) return null;

  const appointmentDate = new Date(appointment.date);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const ticketData = JSON.stringify({
    id: appointment._id,
    patient: appointment.patientId?._id,
    doctor: appointment.doctorId?.name,
    date: appointment.date,
    time: appointment.time,
    status: appointment.status,
    reason: appointment.reason
  });

  const handleDownload = () => {
    const canvas = document.getElementById('qr-ticket-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `appointment-ticket-${appointment._id.slice(-6)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-medical-500 to-medical-600 p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle className="w-8 h-8 text-medical-600" />
          </div>
          <h2 className="text-2xl font-bold text-white">Appointment Ticket</h2>
          <p className="text-medical-100 text-sm mt-1">Show this ticket at reception</p>
        </div>

        {/* QR Code Section */}
        <div className="p-6 text-center border-b border-gray-100">
          <div className="inline-block p-4 bg-white rounded-2xl shadow-inner border-2 border-medical-100">
            <QRCodeSVG
              id="qr-ticket-canvas"
              value={ticketData}
              size={200}
              level="M"
              fgColor="#0ea5e9"
              includeMargin={true}
            />
          </div>
          <p className="text-xs text-gray-500 mt-3 font-mono">
            #{appointment._id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Appointment Details */}
        <div className="p-6 space-y-4">
          <div className="bg-gradient-to-br from-medical-50 to-blue-50 rounded-2xl p-5 border border-medical-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-medical-500 to-medical-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {appointment.doctorId?.name?.charAt(0) || 'D'}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">
                  Dr. {appointment.doctorId?.name || 'Doctor'}
                </p>
                <p className="text-sm text-gray-600">{appointment.reason || 'Consultation'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-medical-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-medical-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-gray-900">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium text-gray-900">{appointment.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">AI Clinic, Room 101</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <span className={`badge ${
              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {appointment.status}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-medical-600 to-medical-700 text-white rounded-xl font-medium hover:from-medical-700 hover:to-medical-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-gray-400">
            AI Clinic Management System • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRTicket;
