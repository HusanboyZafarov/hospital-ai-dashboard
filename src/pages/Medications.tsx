import React from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const medications = [
  {
    name: "Oxycodone",
    dosage: "5mg",
    frequency: "Every 6 hours",
    startDate: "Nov 16, 2025",
    endDate: "Nov 30, 2025",
  },
  {
    name: "Cephalexin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: "Nov 16, 2025",
    endDate: "Nov 26, 2025",
  },
  {
    name: "Enoxaparin",
    dosage: "40mg",
    frequency: "Once daily",
    startDate: "Nov 16, 2025",
    endDate: "Dec 1, 2025",
  },
  {
    name: "Ibuprofen",
    dosage: "400mg",
    frequency: "As needed",
    startDate: "Nov 16, 2025",
    endDate: "Dec 10, 2025",
  },
];

const timelineData = [
  {
    medication: "Oxycodone",
    schedule: [
      { time: "6:00", status: "taken" },
      { time: "12:00", status: "taken" },
      { time: "18:00", status: "missed" },
      { time: "24:00", status: "upcoming" },
    ],
  },
  {
    medication: "Cephalexin",
    schedule: [
      { time: "8:00", status: "taken" },
      { time: "20:00", status: "upcoming" },
    ],
  },
  {
    medication: "Enoxaparin",
    schedule: [{ time: "9:00", status: "taken" }],
  },
];

export const Medications: React.FC = () => {
  return (
    <MainLayout>
      <h1 className="mb-8">Medications</h1>

      <Card className="mb-8">
        <h3 className="mb-4">Current Medications</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8FAFC]">
              <tr className="border-b border-[#E2E8F0]">
                <th className="text-left px-6 py-4 text-[#475569]">
                  Medication
                </th>
                <th className="text-left px-6 py-4 text-[#475569]">Dosage</th>
                <th className="text-left px-6 py-4 text-[#475569]">
                  Frequency
                </th>
                <th className="text-left px-6 py-4 text-[#475569]">
                  Start Date
                </th>
                <th className="text-left px-6 py-4 text-[#475569]">End Date</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med, index) => (
                <tr
                  key={index}
                  className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC]"
                  style={{ height: "64px" }}
                >
                  <td className="px-6 py-4 text-[#0F172A]">{med.name}</td>
                  <td className="px-6 py-4 text-[#475569]">{med.dosage}</td>
                  <td className="px-6 py-4 text-[#475569]">{med.frequency}</td>
                  <td className="px-6 py-4 text-[#475569]">{med.startDate}</td>
                  <td className="px-6 py-4 text-[#475569]">{med.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="mb-6">Today's Medication Timeline</h3>

        {/* Timeline Header */}
        <div className="mb-4">
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#2563EB]"></div>
              <span className="text-[13px] text-[#475569]">Taken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#EF4444]"></div>
              <span className="text-[13px] text-[#475569]">Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#E2E8F0]"></div>
              <span className="text-[13px] text-[#475569]">Upcoming</span>
            </div>
          </div>
        </div>

        {/* Hours Header */}
        <div className="mb-2 ml-[140px] flex">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="flex-1 text-center text-[13px] text-[#475569] min-w-[40px]"
            >
              {i}:00
            </div>
          ))}
        </div>

        {/* Timeline Rows */}
        <div className="space-y-4">
          {timelineData.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-[140px] text-[#0F172A]">{item.medication}</div>
              <div className="flex-1 flex relative h-12 bg-[#F8FAFC] rounded">
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1 border-r border-[#E2E8F0] min-w-[40px]"
                  ></div>
                ))}
                {item.schedule.map((slot, slotIndex) => {
                  const hour = parseInt(slot.time.split(":")[0]);
                  const color =
                    slot.status === "taken"
                      ? "#2563EB"
                      : slot.status === "missed"
                      ? "#EF4444"
                      : "#E2E8F0";

                  return (
                    <div
                      key={slotIndex}
                      className="absolute top-1/2 transform -translate-y-1/2 w-6 h-6 rounded"
                      style={{
                        backgroundColor: color,
                        left: `calc(${(hour / 24) * 100}% + 12px)`,
                      }}
                      title={`${slot.time} - ${slot.status}`}
                    ></div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </MainLayout>
  );
};
