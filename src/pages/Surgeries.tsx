import React, { useState } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import {
  Search,
  FileText,
  CheckCircle,
  XCircle,
  Bot,
  Calendar,
  User,
  Clock,
} from "lucide-react";

interface Surgery {
  id: number;
  name: string;
  category: string;
  patientName: string;
  surgeon: string;
  date: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  riskLevel: "Low" | "Medium" | "High";
  description: string;
  expectedDuration: string;
}

const surgeriesData: Surgery[] = [
  {
    id: 1,
    name: "Total Knee Replacement",
    category: "Orthopedic",
    patientName: "John Martinez",
    surgeon: "Dr. Michael Chen",
    date: "November 16, 2025 at 9:00 AM",
    status: "Completed",
    riskLevel: "High",
    description:
      "Complete replacement of damaged knee joint with prosthetic implant due to severe osteoarthritis.",
    expectedDuration: "2-3 hours",
  },
  {
    id: 2,
    name: "Appendectomy",
    category: "General Surgery",
    patientName: "Emma Williams",
    surgeon: "Dr. Sarah Johnson",
    date: "November 20, 2025 at 2:00 PM",
    status: "Completed",
    riskLevel: "Low",
    description:
      "Surgical removal of the appendix to treat acute appendicitis. Minimally invasive laparoscopic procedure.",
    expectedDuration: "1-2 hours",
  },
  {
    id: 3,
    name: "Cardiac Bypass",
    category: "Cardiac",
    patientName: "Michael Chen",
    surgeon: "Dr. Emily Brown",
    date: "December 5, 2025 at 7:00 AM",
    status: "Scheduled",
    riskLevel: "High",
    description:
      "Coronary artery bypass graft surgery to restore normal blood flow to the heart muscle.",
    expectedDuration: "4-6 hours",
  },
  {
    id: 4,
    name: "Hip Replacement",
    category: "Orthopedic",
    patientName: "Sarah Johnson",
    surgeon: "Dr. Michael Chen",
    date: "November 18, 2025 at 10:00 AM",
    status: "Completed",
    riskLevel: "Medium",
    description:
      "Total hip arthroplasty to replace damaged hip joint with artificial components.",
    expectedDuration: "2-3 hours",
  },
  {
    id: 5,
    name: "Gallbladder Removal",
    category: "General Surgery",
    patientName: "David Smith",
    surgeon: "Dr. Sarah Johnson",
    date: "December 10, 2025 at 11:00 AM",
    status: "Scheduled",
    riskLevel: "Low",
    description:
      "Laparoscopic cholecystectomy to remove gallbladder due to gallstones and inflammation.",
    expectedDuration: "1-2 hours",
  },
  {
    id: 6,
    name: "Spinal Fusion",
    category: "Orthopedic",
    patientName: "Lisa Anderson",
    surgeon: "Dr. Michael Chen",
    date: "November 22, 2025 at 8:00 AM",
    status: "In Progress",
    riskLevel: "High",
    description:
      "Surgical procedure to join two or more vertebrae together to stabilize the spine.",
    expectedDuration: "3-4 hours",
  },
];

const allowedFoods = [
  "Lean chicken and turkey",
  "Fish (salmon, cod, tuna)",
  "Fresh vegetables (broccoli, spinach, carrots)",
  "Whole grains (brown rice, quinoa, oats)",
  "Low-fat dairy products",
  "Eggs",
  "Legumes and beans",
  "Fresh fruits (berries, apples, oranges)",
  "Nuts and seeds (almonds, walnuts)",
  "Olive oil and avocado",
];

const forbiddenFoods = [
  "Processed meats (bacon, sausage, deli meats)",
  "High-sodium snacks (chips, crackers)",
  "Fried foods",
  "Fast food",
  "Sugary desserts and pastries",
  "Alcohol",
  "Carbonated beverages",
  "High-sodium canned foods",
  "Fatty red meats",
  "Full-fat dairy products",
];

const meals = [
  {
    name: "Breakfast",
    time: "8:00 AM",
    items: [
      "Oatmeal with mixed berries",
      "Scrambled eggs (2 eggs)",
      "Whole wheat toast",
      "Herbal tea",
    ],
  },
  {
    name: "Lunch",
    time: "12:30 PM",
    items: [
      "Grilled chicken salad",
      "Olive oil dressing",
      "Whole grain roll",
      "Fresh fruit",
    ],
  },
  {
    name: "Dinner",
    time: "6:00 PM",
    items: ["Baked salmon", "Steamed vegetables", "Quinoa", "Side salad"],
  },
  {
    name: "Snacks",
    time: "Throughout day",
    items: [
      "Greek yogurt",
      "Almonds (small handful)",
      "Apple slices",
      "Carrot sticks with hummus",
    ],
  },
];

const allowedActivities = [
  "Gentle walking (10-15 minutes)",
  "Seated exercises",
  "Upper body stretches",
  "Reading and mental activities",
  "Light household tasks (seated)",
  "Physical therapy exercises",
  "Breathing exercises",
  "Ankle pumps and rotations",
  "Arm circles",
  "Meditation and relaxation",
  "Using assistive devices",
  "Short distance ambulation",
];

const restrictedActivities = [
  "Running or jogging",
  "Heavy lifting (>10 lbs)",
  "Jumping or hopping",
  "Climbing stairs independently",
  "Contact sports",
  "Driving (first 6 weeks)",
  "Kneeling or squatting",
  "High-impact exercises",
  "Swimming (until wound healed)",
  "Bending at waist deeply",
  "Twisting motions",
  "Standing for long periods",
];

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "diet-plan", label: "Diet Plan" },
  { id: "activities", label: "Activities" },
  { id: "medical-records", label: "Medical Records" },
];

export const Surgeries: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurgery, setSelectedSurgery] = useState<Surgery | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusBadge = (status: string) => {
    if (status === "Completed") return "success";
    if (status === "In Progress") return "warning";
    if (status === "Scheduled") return "info";
    return "error";
  };

  const getRiskBadge = (risk: string) => {
    if (risk === "High") return "error";
    if (risk === "Medium") return "warning";
    return "success";
  };

  const filteredSurgeries = surgeriesData.filter(
    (surgery) =>
      surgery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surgery.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (surgery: Surgery) => {
    setSelectedSurgery(surgery);
    setActiveTab("overview");
  };

  const handleBackToList = () => {
    setSelectedSurgery(null);
    setActiveTab("overview");
  };

  const renderTabContent = () => {
    if (!selectedSurgery) return null;

    switch (activeTab) {
      case "overview":
        return <OverviewTab surgery={selectedSurgery} />;
      case "diet-plan":
        return <DietPlanTab />;
      case "activities":
        return <ActivitiesTab />;
      case "medical-records":
        return <MedicalRecordsTab surgery={selectedSurgery} />;
      default:
        return <OverviewTab surgery={selectedSurgery} />;
    }
  };

  if (selectedSurgery) {
    return (
      <MainLayout>
        <div className="mb-6">
          <Button variant="outline" onClick={handleBackToList} className="mb-4">
            ← Back to Surgeries
          </Button>
          <h1 className="mb-2">{selectedSurgery.name}</h1>
          <div className="flex items-center gap-4 text-[#475569]">
            <span>{selectedSurgery.category}</span>
            <span>•</span>
            <span>{selectedSurgery.patientName}</span>
            <span>•</span>
            <Badge variant={getRiskBadge(selectedSurgery.riskLevel)}>
              {selectedSurgery.riskLevel} Risk
            </Badge>
          </div>
        </div>

        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {renderTabContent()}
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-8">
        <h1>Surgeries</h1>
        <Button>+ New Surgery</Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative" style={{ maxWidth: "400px" }}>
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#475569]"
            size={20}
          />
          <Input
            placeholder="Search surgeries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-[12px] border border-[#E2E8F0] overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
      >
        <table className="w-full">
          <thead className="bg-[#F8FAFC]">
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left px-6 py-4 text-[#475569]">
                Surgery Name
              </th>
              <th className="text-left px-6 py-4 text-[#475569]">Category</th>
              <th className="text-left px-6 py-4 text-[#475569]">Patient</th>
              <th className="text-left px-6 py-4 text-[#475569]">Surgeon</th>
              <th className="text-left px-6 py-4 text-[#475569]">Date</th>
              <th className="text-left px-6 py-4 text-[#475569]">Status</th>
              <th className="text-left px-6 py-4 text-[#475569]">Risk Level</th>
              <th className="text-left px-6 py-4 text-[#475569]">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurgeries.map((surgery) => (
              <tr
                key={surgery.id}
                className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
                style={{ height: "64px" }}
              >
                <td className="px-6 py-4 text-[#0F172A] font-medium">
                  {surgery.name}
                </td>
                <td className="px-6 py-4 text-[#475569]">{surgery.category}</td>
                <td className="px-6 py-4 text-[#0F172A]">
                  {surgery.patientName}
                </td>
                <td className="px-6 py-4 text-[#475569]">{surgery.surgeon}</td>
                <td className="px-6 py-4 text-[#475569]">{surgery.date}</td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusBadge(surgery.status)}>
                    {surgery.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getRiskBadge(surgery.riskLevel)}>
                    {surgery.riskLevel}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(surgery)}
                    className="py-2"
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

// Tab Components
const OverviewTab: React.FC<{ surgery: Surgery }> = ({ surgery }) => (
  <Card>
    <div className="space-y-6">
      <div>
        <h2>{surgery.name}</h2>
        <Badge variant="info" className="mt-2">
          {surgery.category}
        </Badge>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Description</div>
        <p className="text-[#0F172A]">{surgery.description}</p>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Risk Level</div>
        <Badge
          variant={
            surgery.riskLevel === "High"
              ? "error"
              : surgery.riskLevel === "Medium"
              ? "warning"
              : "success"
          }
        >
          {surgery.riskLevel} Risk
        </Badge>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Assigned Surgeon</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
            {surgery.surgeon
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(1)}
          </div>
          <div className="text-[#0F172A]">{surgery.surgeon}</div>
        </div>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Surgery Date</div>
        <div className="text-[#0F172A]">{surgery.date}</div>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Expected Duration</div>
        <div className="text-[#0F172A]">{surgery.expectedDuration}</div>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Patient</div>
        <div className="flex items-center gap-3">
          <User size={20} className="text-[#2563EB]" />
          <div className="text-[#0F172A]">{surgery.patientName}</div>
        </div>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Status</div>
        <Badge
          variant={
            surgery.status === "Completed"
              ? "success"
              : surgery.status === "In Progress"
              ? "warning"
              : surgery.status === "Scheduled"
              ? "info"
              : "error"
          }
        >
          {surgery.status}
        </Badge>
      </div>
    </div>
  </Card>
);

const DietPlanTab: React.FC = () => (
  <div className="space-y-6">
    <Card className="mb-8">
      <h3 className="mb-4">Diet Plan Summary</h3>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="text-[#475569] mb-2">Diet Type</div>
          <div className="text-[#0F172A]">Low-Sodium, High-Protein</div>
        </div>
        <div>
          <div className="text-[#475569] mb-2">Goal Calories</div>
          <div className="text-[#0F172A]">2000 kcal/day</div>
        </div>
        <div>
          <div className="text-[#475569] mb-2">Protein Target</div>
          <div className="text-[#0F172A]">100g/day</div>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
        <div className="text-[#475569] mb-2">Notes</div>
        <p className="text-[#0F172A]">
          Focus on lean proteins and vegetables to support post-surgical
          recovery. Limit sodium intake to reduce swelling and support
          cardiovascular health. Maintain adequate hydration with at least 8
          glasses of water daily.
        </p>
      </div>
    </Card>

    <div className="grid grid-cols-2 gap-6 mb-8">
      <Card>
        <h3 className="mb-4 text-[#22C55E]">Allowed Foods</h3>
        <ul className="space-y-3">
          {allowedFoods.map((food, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 shrink-0"></div>
              <span className="text-[#475569]">{food}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="mb-4 text-[#EF4444]">Forbidden Foods</h3>
        <ul className="space-y-3">
          {forbiddenFoods.map((food, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#EF4444] mt-2 shrink-0"></div>
              <span className="text-[#475569]">{food}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>

    <Card className="mb-8">
      <h3 className="mb-6">Today's Meal Plan</h3>
      <div className="space-y-6">
        {meals.map((meal, index) => (
          <div key={index} className="p-4 rounded-lg border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[#0F172A]">{meal.name}</h3>
              <span className="text-[13px] text-[#475569]">{meal.time}</span>
            </div>
            <ul className="space-y-2">
              {meal.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="flex items-center gap-2 text-[#475569]"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>

    <div className="flex justify-end">
      <Button>
        <Bot size={16} className="inline mr-2" />
        Optimize Diet with AI
      </Button>
    </div>
  </div>
);

const ActivitiesTab: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-6 mb-8">
      <div>
        <h2 className="mb-6 text-[#22C55E]">Allowed Activities</h2>
        <div className="grid grid-cols-2 gap-4">
          {allowedActivities.map((activity, index) => (
            <Card
              key={index}
              padding="16px"
              className="h-[80px] hover:border-[#22C55E] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2 h-full">
                <CheckCircle
                  size={16}
                  className="text-[#22C55E] shrink-0 mt-1"
                />
                <span className="text-[14px] text-[#166534]">{activity}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-[#EF4444]">Restricted Activities</h2>
        <div className="grid grid-cols-2 gap-4">
          {restrictedActivities.map((activity, index) => (
            <Card
              key={index}
              padding="16px"
              className="h-[80px] hover:border-[#EF4444] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2 h-full">
                <XCircle size={16} className="text-[#EF4444] shrink-0 mt-1" />
                <span className="text-[14px] text-[#991B1B]">{activity}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>

    <Card>
      <h3 className="mb-4">AI Safety Checker</h3>
      <p className="text-[#475569] mb-6">
        Ask AI if an activity is safe for this patient's current condition. The
        AI will analyze the activity against the patient's surgery type,
        recovery stage, and current health status.
      </p>
      <div className="flex gap-4">
        <Input
          placeholder="E.g., Can I swim? Can I lift my grandchild?"
          className="flex-1"
        />
        <Button>Check Safety</Button>
      </div>

      <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
        <h3 className="mb-4">Example Queries</h3>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-[14px] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors bg-white cursor-pointer">
            Can I drive to the store?
          </button>
          <button className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-[14px] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors bg-white cursor-pointer">
            Is it safe to go up and down stairs?
          </button>
          <button className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-[14px] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors bg-white cursor-pointer">
            Can I work from home at my desk?
          </button>
          <button className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-[14px] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors bg-white cursor-pointer">
            When can I return to yoga?
          </button>
        </div>
      </div>
    </Card>
  </div>
);

const MedicalRecordsTab: React.FC<{ surgery: Surgery }> = ({ surgery }) => (
  <div className="space-y-6">
    <Card>
      <h3 className="mb-4">Diagnosis</h3>
      <p className="text-[#475569]">
        Pre-operative assessment completed. Patient cleared for surgery. All
        pre-operative tests and evaluations completed successfully. Patient
        understands procedure risks and benefits.
      </p>
    </Card>

    <Card>
      <h3 className="mb-4">Doctor's Notes</h3>
      <div className="space-y-4">
        <NoteItem
          date="Nov 27, 2025"
          doctor={surgery.surgeon}
          note="Post-operative check completed. Patient showing good progress. Recovery on track."
        />
        <NoteItem
          date="Nov 25, 2025"
          doctor={surgery.surgeon}
          note="Surgery completed successfully. Patient stable. Incision healing well. No signs of infection."
        />
        <NoteItem
          date="Nov 22, 2025"
          doctor={surgery.surgeon}
          note="Pre-operative assessment completed. Patient cleared for surgery. All tests normal."
        />
      </div>
    </Card>

    <Card>
      <h3 className="mb-4">Medical Files</h3>
      <div className="grid grid-cols-4 gap-4">
        <FileCard name="Pre-Op Assessment" date="Nov 14, 2025" />
        <FileCard name="Blood Test" date="Nov 14, 2025" />
        <FileCard name="X-Ray Results" date="Nov 10, 2025" />
        <FileCard name="Surgery Report" date="Nov 16, 2025" />
      </div>
    </Card>
  </div>
);

// Helper Components
const NoteItem: React.FC<{
  date: string;
  doctor: string;
  note: string;
}> = ({ date, doctor, note }) => (
  <div className="p-4 rounded-lg border border-[#E2E8F0]">
    <div className="flex justify-between mb-2">
      <span className="text-[#0F172A]">{doctor}</span>
      <span className="text-[13px] text-[#475569]">{date}</span>
    </div>
    <p className="text-[#475569]">{note}</p>
  </div>
);

const FileCard: React.FC<{ name: string; date: string }> = ({ name, date }) => (
  <div
    className="p-4 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] transition-colors cursor-pointer"
    style={{ height: "120px" }}
  >
    <FileText size={32} className="text-[#2563EB] mb-2" />
    <div className="text-[#0F172A] mb-1">{name}</div>
    <div className="text-[13px] text-[#475569]">{date}</div>
  </div>
);
