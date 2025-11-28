import React, { useState } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface Appointment {
  id: number;
  patientName: string;
  doctor: string;
  time: string;
  type: string;
  date: number;
}

const appointmentsData: Appointment[] = [
  { id: 1, patientName: 'John Martinez', doctor: 'Dr. Sarah Johnson', time: '9:00 AM', type: 'Follow-up', date: 2 },
  { id: 2, patientName: 'Emma Williams', doctor: 'Dr. Michael Chen', time: '10:30 AM', type: 'Post-Op Check', date: 2 },
  { id: 3, patientName: 'Sarah Johnson', doctor: 'Dr. Emily Brown', time: '2:00 PM', type: 'Consultation', date: 5 },
  { id: 4, patientName: 'Michael Chen', doctor: 'Dr. Sarah Johnson', time: '11:00 AM', type: 'Surgery Follow-up', date: 9 },
  { id: 5, patientName: 'David Smith', doctor: 'Dr. Michael Chen', time: '3:30 PM', type: 'Pre-Op Assessment', date: 12 },
  { id: 6, patientName: 'Lisa Anderson', doctor: 'Dr. Emily Brown', time: '10:00 AM', type: 'Physical Therapy', date: 15 },
  { id: 7, patientName: 'Robert Taylor', doctor: 'Dr. Sarah Johnson', time: '1:00 PM', type: 'Consultation', date: 18 },
  { id: 8, patientName: 'Jennifer White', doctor: 'Dr. Michael Chen', time: '4:00 PM', type: 'Follow-up', date: 22 },
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Appointments: React.FC = () => {
  const [currentMonth] = useState('December 2025');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  
  const getDaysInMonth = () => {
    const days = [];
    const firstDay = 0; // December 2025 starts on Monday (we'll show Sunday as empty)
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const getAppointmentsForDay = (day: number | null) => {
    if (!day) return [];
    return appointmentsData.filter(apt => apt.date === day);
  };
  
  const days = getDaysInMonth();
  
  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <h1>Appointments</h1>
        <Button onClick={() => setShowNewAppointmentModal(true)}>
          + New Appointment
        </Button>
      </div>
      
      {/* Calendar Controls */}
      <Card padding="16px" className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F8FAFC] rounded transition-colors border-none bg-transparent cursor-pointer">
              <ChevronLeft size={20} className="text-[#475569]" />
            </button>
            <h2 className="text-[#0F172A]">{currentMonth}</h2>
            <button className="p-2 hover:bg-[#F8FAFC] rounded transition-colors border-none bg-transparent cursor-pointer">
              <ChevronRight size={20} className="text-[#475569]" />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg transition-colors border-none cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg transition-colors border-none cursor-pointer ${
                viewMode === 'week'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg transition-colors border-none cursor-pointer ${
                viewMode === 'day'
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-[#F8FAFC] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </Card>
      
      {/* Calendar Grid */}
      <Card padding="0">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-[#E2E8F0]">
          {daysOfWeek.map((day) => (
            <div key={day} className="p-4 text-center text-[#475569] bg-[#F8FAFC]">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const appointments = getAppointmentsForDay(day);
            const isToday = day === 28;
            
            return (
              <div
                key={index}
                className="border-r border-b border-[#E2E8F0] p-3 min-h-[120px] hover:bg-[#F8FAFC] transition-colors"
                style={{ aspectRatio: '1/1' }}
              >
                {day && (
                  <>
                    <div
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                        isToday
                          ? 'bg-[#2563EB] text-white'
                          : 'text-[#0F172A]'
                      }`}
                    >
                      {day}
                    </div>
                    
                    <div className="space-y-1">
                      {appointments.map((apt) => (
                        <div
                          key={apt.id}
                          className="p-2 rounded bg-[#EFF6FF] border-l-2 border-[#2563EB] cursor-pointer hover:bg-[#DBEAFE] transition-colors"
                        >
                          <div className="text-[12px] text-[#2563EB] mb-1">{apt.time}</div>
                          <div className="text-[11px] text-[#0F172A] truncate">{apt.patientName}</div>
                          <div className="text-[11px] text-[#475569] truncate">{apt.doctor}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* New Appointment Modal */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card padding="24px" className="w-[520px]">
            <h2 className="mb-6">New Appointment</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#475569] mb-2">Patient</label>
                <select className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white">
                  <option>Select patient...</option>
                  <option>John Martinez</option>
                  <option>Emma Williams</option>
                  <option>Sarah Johnson</option>
                  <option>Michael Chen</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[#475569] mb-2">Doctor</label>
                <select className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white">
                  <option>Select doctor...</option>
                  <option>Dr. Sarah Johnson</option>
                  <option>Dr. Michael Chen</option>
                  <option>Dr. Emily Brown</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#475569] mb-2">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[#475569] mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[#475569] mb-2">Appointment Type</label>
                <select className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white">
                  <option>Select type...</option>
                  <option>Consultation</option>
                  <option>Follow-up</option>
                  <option>Pre-Op Assessment</option>
                  <option>Post-Op Check</option>
                  <option>Physical Therapy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[#475569] mb-2">Notes</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white resize-none"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowNewAppointmentModal(false)}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  alert('Appointment scheduled successfully!');
                  setShowNewAppointmentModal(false);
                }}
              >
                Schedule Appointment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};
