import React, { useState } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Tabs } from "../components/ui/Tabs";
import { useParams } from "react-router-dom";
import {
  Activity,
  FileText,
  Pill,
  Utensils,
  Dumbbell,
  Bot,
  Calendar,
  Heart,
  Thermometer,
  Droplet,
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "surgery", label: "Surgery" },
  { id: "records", label: "Medical Records" },
  { id: "admission", label: "Admission" },
  { id: "care-plan", label: "Care Plan" },
  { id: "medications", label: "Medications" },
  { id: "diet", label: "Diet" },
  { id: "activities", label: "Activities" },
  { id: "ai-insights", label: "AI Insights" },
  { id: "appointments", label: "Appointments" },
];

const patientData = {
  name: "John Martinez",
  age: 58,
  gender: "Male",
  phone: "(555) 123-4567",
  email: "john.martinez@email.com",
  doctor: "Dr. Sarah Johnson",
  admittedAt: "Nov 15, 2025",
  ward: "Ward A - Room 204",
  status: "In Recovery",
  surgery: "Total Knee Replacement",
  surgeryCategory: "Orthopedic",
  surgeryDescription:
    "Complete replacement of damaged knee joint with prosthetic implant due to severe osteoarthritis.",
  riskLevel: "High",
  surgeon: "Dr. Michael Chen",
};

export const PatientProfile: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;
      case "surgery":
        return <SurgeryTab />;
      case "records":
        return <MedicalRecordsTab />;
      case "admission":
        return <AdmissionTab />;
      case "care-plan":
        return <CarePlanTab />;
      case "medications":
        return <MedicationsTab />;
      case "diet":
        return <DietTab />;
      case "activities":
        return <ActivitiesTab />;
      case "ai-insights":
        return <AIInsightsTab />;
      case "appointments":
        return <AppointmentsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="mb-2">{patientData.name}</h1>
        <div className="flex items-center gap-4 text-[#475569]">
          <span>{patientData.age} years old</span>
          <span>•</span>
          <span>{patientData.gender}</span>
          <span>•</span>
          <Badge variant="warning">High Risk</Badge>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {renderTabContent()}
    </MainLayout>
  );
};

const OverviewTab: React.FC = () => (
  <div className="grid grid-cols-[40%_60%] gap-6">
    <div className="flex flex-col gap-6">
      <Card>
        <h3 className="mb-4">Patient Information</h3>
        <div className="space-y-3">
          <InfoRow label="Full Name" value={patientData.name} />
          <InfoRow label="Age" value={`${patientData.age} years`} />
          <InfoRow label="Gender" value={patientData.gender} />
          <InfoRow label="Phone" value={patientData.phone} />
          <InfoRow label="Email" value={patientData.email} />
          <InfoRow label="Assigned Doctor" value={patientData.doctor} />
        </div>
      </Card>

      <Card>
        <h3 className="mb-4">Admission Summary</h3>
        <div className="space-y-3">
          <InfoRow label="Admitted At" value={patientData.admittedAt} />
          <InfoRow label="Ward" value={patientData.ward} />
          <InfoRow label="Status" value={patientData.status} />
        </div>
      </Card>
    </div>

    <div className="flex flex-col gap-6">
      <Card>
        <h3 className="mb-4">Surgery Summary</h3>
        <div className="space-y-4">
          <div>
            <div className="text-[#475569] mb-1">Surgery Name</div>
            <div className="text-[#0F172A]">{patientData.surgery}</div>
          </div>
          <div>
            <div className="text-[#475569] mb-1">Category</div>
            <Badge variant="info">{patientData.surgeryCategory}</Badge>
          </div>
          <div>
            <div className="text-[#475569] mb-1">Description</div>
            <p className="text-[#0F172A]">{patientData.surgeryDescription}</p>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4">Current Vitals</h3>
        <div className="grid grid-cols-3 gap-4">
          <VitalCard
            icon={Heart}
            label="Heart Rate"
            value="78 bpm"
            status="success"
          />
          <VitalCard
            icon={Droplet}
            label="Blood Pressure"
            value="145/92"
            status="warning"
          />
          <VitalCard
            icon={Thermometer}
            label="Temperature"
            value="37.2°C"
            status="success"
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-4">Today's Tasks</h3>
        <div className="space-y-3">
          <TaskRow
            icon={Pill}
            task="Administer pain medication"
            time="10:00 AM"
            status="success"
          />
          <TaskRow
            icon={Activity}
            task="Physical therapy session"
            time="2:00 PM"
            status="warning"
          />
          <TaskRow
            icon={Utensils}
            task="Low-sodium lunch"
            time="12:30 PM"
            status="success"
          />
          <TaskRow
            icon={FileText}
            task="Update recovery notes"
            time="4:00 PM"
            status="neutral"
          />
        </div>
      </Card>
    </div>
  </div>
);

const SurgeryTab: React.FC = () => (
  <Card>
    <div className="space-y-6">
      <div>
        <h2>{patientData.surgery}</h2>
        <Badge variant="info" className="mt-2">
          {patientData.surgeryCategory}
        </Badge>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Description</div>
        <p>{patientData.surgeryDescription}</p>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Risk Level</div>
        <Badge variant="error">High Risk</Badge>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Assigned Surgeon</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
            MC
          </div>
          <div className="text-[#0F172A]">{patientData.surgeon}</div>
        </div>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Surgery Date</div>
        <div className="text-[#0F172A]">November 16, 2025 at 9:00 AM</div>
      </div>

      <div>
        <div className="text-[#475569] mb-2">Expected Duration</div>
        <div className="text-[#0F172A]">2-3 hours</div>
      </div>
    </div>
  </Card>
);

const MedicalRecordsTab: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="mb-4">Diagnosis</h3>
      <p className="text-[#475569]">
        Severe osteoarthritis of the right knee with significant cartilage
        degeneration. Patient reports chronic pain and limited mobility
        affecting daily activities.
      </p>
    </Card>

    <Card>
      <h3 className="mb-4">Doctor's Notes</h3>
      <div className="space-y-4">
        <NoteItem
          date="Nov 27, 2025"
          doctor="Dr. Sarah Johnson"
          note="Patient showing good progress. Pain management effective. Continue current protocol."
        />
        <NoteItem
          date="Nov 25, 2025"
          doctor="Dr. Michael Chen"
          note="Post-operative check completed. Incision healing well. No signs of infection."
        />
        <NoteItem
          date="Nov 22, 2025"
          doctor="Dr. Sarah Johnson"
          note="Physical therapy initiated. Patient tolerating exercises well."
        />
      </div>
    </Card>

    <Card>
      <h3 className="mb-4">Medical Files</h3>
      <div className="grid grid-cols-4 gap-4">
        <FileCard name="X-Ray Results" date="Nov 14, 2025" />
        <FileCard name="Blood Test" date="Nov 14, 2025" />
        <FileCard name="MRI Scan" date="Nov 10, 2025" />
        <FileCard name="Pre-Op Assessment" date="Nov 13, 2025" />
      </div>
    </Card>
  </div>
);

const AdmissionTab: React.FC = () => (
  <Card>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#F8FAFC]">
          <tr className="border-b border-[#E2E8F0]">
            <th className="text-left px-6 py-4 text-[#475569]">
              Admission Date
            </th>
            <th className="text-left px-6 py-4 text-[#475569]">
              Expected Discharge
            </th>
            <th className="text-left px-6 py-4 text-[#475569]">Ward</th>
            <th className="text-left px-6 py-4 text-[#475569]">
              Attending Doctor
            </th>
            <th className="text-left px-6 py-4 text-[#475569]">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[#E2E8F0]" style={{ height: "64px" }}>
            <td className="px-6 py-4">November 15, 2025</td>
            <td className="px-6 py-4">December 5, 2025</td>
            <td className="px-6 py-4">Ward A - Room 204</td>
            <td className="px-6 py-4">Dr. Sarah Johnson</td>
            <td className="px-6 py-4">
              <Badge variant="success">Active</Badge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
);

const CarePlanTab: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-end">
      <Button>
        <Bot size={16} className="inline mr-2" />
        Generate with AI
      </Button>
    </div>

    <Card>
      <h3 className="mb-4">Pre-Operative Instructions</h3>
      <ul className="list-disc list-inside space-y-2 text-[#475569]">
        <li>Fast for 8 hours before surgery</li>
        <li>Stop blood-thinning medications 48 hours prior</li>
        <li>Shower with antibacterial soap the night before</li>
        <li>Arrange transportation home post-surgery</li>
        <li>Prepare home for limited mobility</li>
      </ul>
    </Card>

    <Card>
      <h3 className="mb-4">Post-Operative Instructions</h3>
      <ul className="list-disc list-inside space-y-2 text-[#475569]">
        <li>Keep surgical site clean and dry</li>
        <li>Take pain medication as prescribed</li>
        <li>Perform physical therapy exercises daily</li>
        <li>Use ice packs to reduce swelling</li>
        <li>Avoid putting full weight on affected leg for 6 weeks</li>
        <li>Attend all follow-up appointments</li>
      </ul>
    </Card>

    <Card>
      <h3 className="mb-4">General Guidelines</h3>
      <ul className="list-disc list-inside space-y-2 text-[#475569]">
        <li>Monitor for signs of infection (fever, redness, increased pain)</li>
        <li>Maintain proper nutrition and hydration</li>
        <li>Get adequate rest and sleep</li>
        <li>Report any unusual symptoms immediately</li>
        <li>Follow mobility restrictions strictly</li>
      </ul>
    </Card>
  </div>
);

const MedicationsTab: React.FC = () => (
  <Card>
    <h3 className="mb-4">Current Medications</h3>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#F8FAFC]">
          <tr className="border-b border-[#E2E8F0]">
            <th className="text-left px-6 py-4 text-[#475569]">Medication</th>
            <th className="text-left px-6 py-4 text-[#475569]">Dosage</th>
            <th className="text-left px-6 py-4 text-[#475569]">Frequency</th>
            <th className="text-left px-6 py-4 text-[#475569]">Start Date</th>
            <th className="text-left px-6 py-4 text-[#475569]">End Date</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-[#E2E8F0]" style={{ height: "64px" }}>
            <td className="px-6 py-4">Oxycodone</td>
            <td className="px-6 py-4">5mg</td>
            <td className="px-6 py-4">Every 6 hours</td>
            <td className="px-6 py-4">Nov 16, 2025</td>
            <td className="px-6 py-4">Nov 30, 2025</td>
          </tr>
          <tr className="border-b border-[#E2E8F0]" style={{ height: "64px" }}>
            <td className="px-6 py-4">Cephalexin</td>
            <td className="px-6 py-4">500mg</td>
            <td className="px-6 py-4">Twice daily</td>
            <td className="px-6 py-4">Nov 16, 2025</td>
            <td className="px-6 py-4">Nov 26, 2025</td>
          </tr>
          <tr className="border-b border-[#E2E8F0]" style={{ height: "64px" }}>
            <td className="px-6 py-4">Enoxaparin</td>
            <td className="px-6 py-4">40mg</td>
            <td className="px-6 py-4">Once daily</td>
            <td className="px-6 py-4">Nov 16, 2025</td>
            <td className="px-6 py-4">Dec 1, 2025</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
);

const DietTab: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="mb-4">Diet Plan Summary</h3>
      <div className="space-y-3">
        <InfoRow label="Diet Type" value="Low-Sodium, High-Protein" />
        <InfoRow label="Goal Calories" value="2000 kcal/day" />
        <InfoRow
          label="Notes"
          value="Focus on lean proteins and vegetables. Limit sodium intake to reduce swelling."
        />
      </div>
    </Card>

    <div className="grid grid-cols-2 gap-6">
      <Card>
        <h3 className="mb-4 text-[#22C55E]">Allowed Foods</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
            Lean chicken and turkey
          </li>
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
            Fish (salmon, cod)
          </li>
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
            Fresh vegetables
          </li>
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
            Whole grains
          </li>
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
            Low-fat dairy
          </li>
        </ul>
      </Card>

      <Card>
        <h3 className="mb-4 text-[#EF4444]">Forbidden Foods</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
            Processed meats
          </li>
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
            High-sodium snacks
          </li>
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
            Fried foods
          </li>
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
            Sugary desserts
          </li>
          <li className="flex items-center gap-2 text-[#475569]">
            <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
            Alcohol
          </li>
        </ul>
      </Card>
    </div>

    <Card>
      <h3 className="mb-4">Meal Plan</h3>
      <div className="space-y-4">
        <MealRow
          meal="Breakfast"
          food="Oatmeal with berries, scrambled eggs, herbal tea"
        />
        <MealRow
          meal="Lunch"
          food="Grilled chicken salad with olive oil dressing, whole grain bread"
        />
        <MealRow
          meal="Dinner"
          food="Baked salmon with steamed vegetables, quinoa"
        />
        <MealRow meal="Snacks" food="Greek yogurt, almonds, fresh fruit" />
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
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h3 className="mb-4 text-[#22C55E]">Allowed Activities</h3>
        <div className="grid grid-cols-2 gap-3">
          <ActivityCard type="allowed" activity="Gentle walking" />
          <ActivityCard type="allowed" activity="Seated exercises" />
          <ActivityCard type="allowed" activity="Upper body stretches" />
          <ActivityCard type="allowed" activity="Reading" />
          <ActivityCard type="allowed" activity="Light household tasks" />
          <ActivityCard type="allowed" activity="Physical therapy" />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[#EF4444]">Restricted Activities</h3>
        <div className="grid grid-cols-2 gap-3">
          <ActivityCard type="restricted" activity="Running" />
          <ActivityCard type="restricted" activity="Heavy lifting" />
          <ActivityCard type="restricted" activity="Jumping" />
          <ActivityCard type="restricted" activity="Climbing stairs" />
          <ActivityCard type="restricted" activity="Contact sports" />
          <ActivityCard type="restricted" activity="Driving" />
        </div>
      </div>
    </div>

    <Card>
      <h3 className="mb-4">AI Safety Checker</h3>
      <p className="text-[#475569] mb-4">
        Ask AI if an activity is safe for this patient's current condition.
      </p>
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="E.g., Can I swim?"
          className="flex-1 px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white"
        />
        <Button>Check Safety</Button>
      </div>
    </Card>
  </div>
);

const AIInsightsTab: React.FC = () => (
  <div className="space-y-6">
    <Card>
      <h3 className="mb-4">Risk Assessment</h3>
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-[#FEE2E2] border border-[#FECACA]">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="error">High Risk</Badge>
            <span className="text-[#991B1B]">Blood Pressure Monitoring</span>
          </div>
          <p className="text-[#991B1B] text-[14px]">
            Patient's blood pressure has been consistently elevated. Recommend
            consultation with cardiologist.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#FEF9C3] border border-[#FDE047]">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="warning">Medium Risk</Badge>
            <span className="text-[#854D0E]">Recovery Progress</span>
          </div>
          <p className="text-[#854D0E] text-[14px]">
            Recovery is slightly slower than typical timeline. Continue
            monitoring closely.
          </p>
        </div>
      </div>
    </Card>

    <Card>
      <h3 className="mb-4">Predictive Analytics</h3>
      <p className="text-[#475569] mb-4">
        Based on current progress, AI predicts:
      </p>
      <ul className="list-disc list-inside space-y-2 text-[#475569]">
        <li>Full mobility restoration: 8-10 weeks (typical: 6-8 weeks)</li>
        <li>Pain management reduction: 3 weeks</li>
        <li>Physical therapy completion: 12 weeks</li>
        <li>Return to normal activities: 14-16 weeks</li>
      </ul>
    </Card>

    <Card>
      <h3 className="mb-4">Recommended Actions</h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[12px] flex-shrink-0 mt-1">
            1
          </div>
          <div>
            <div className="text-[#0F172A] mb-1">
              Schedule cardiology consultation
            </div>
            <div className="text-[14px] text-[#475569]">
              Due to persistent elevated blood pressure readings
            </div>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[12px] flex-shrink-0 mt-1">
            2
          </div>
          <div>
            <div className="text-[#0F172A] mb-1">
              Increase physical therapy frequency
            </div>
            <div className="text-[14px] text-[#475569]">
              To accelerate recovery progress
            </div>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[12px] flex-shrink-0 mt-1">
            3
          </div>
          <div>
            <div className="text-[#0F172A] mb-1">
              Review pain medication dosage
            </div>
            <div className="text-[14px] text-[#475569]">
              Patient may benefit from adjusted protocol
            </div>
          </div>
        </li>
      </ul>
    </Card>
  </div>
);

const AppointmentsTab: React.FC = () => (
  <div className="space-y-6">
    <div className="flex justify-end">
      <Button>+ Schedule New Appointment</Button>
    </div>

    <Card>
      <h3 className="mb-4">Upcoming Appointments</h3>
      <div className="space-y-4">
        <AppointmentRow
          date="Dec 2, 2025"
          time="10:00 AM"
          doctor="Dr. Sarah Johnson"
          type="Follow-up Consultation"
          status="confirmed"
        />
        <AppointmentRow
          date="Dec 9, 2025"
          time="2:00 PM"
          doctor="Dr. Michael Chen"
          type="Post-Op Check"
          status="confirmed"
        />
        <AppointmentRow
          date="Dec 16, 2025"
          time="11:00 AM"
          doctor="Physical Therapist"
          type="Physical Therapy"
          status="scheduled"
        />
      </div>
    </Card>

    <Card>
      <h3 className="mb-4">Past Appointments</h3>
      <div className="space-y-4">
        <AppointmentRow
          date="Nov 25, 2025"
          time="9:00 AM"
          doctor="Dr. Michael Chen"
          type="Post-Surgery Check"
          status="completed"
        />
        <AppointmentRow
          date="Nov 20, 2025"
          time="3:00 PM"
          doctor="Dr. Sarah Johnson"
          type="Wound Check"
          status="completed"
        />
      </div>
    </Card>
  </div>
);

// Helper Components
const InfoRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between py-2 border-b border-[#E2E8F0] last:border-0">
    <span className="text-[#475569]">{label}</span>
    <span className="text-[#0F172A]">{value}</span>
  </div>
);

const VitalCard: React.FC<{
  icon: any;
  label: string;
  value: string;
  status: "success" | "warning" | "error";
}> = ({ icon: Icon, label, value, status }) => {
  const colors = {
    success: "#22C55E",
    warning: "#FACC15",
    error: "#EF4444",
  };

  return (
    <div className="p-4 rounded-lg border border-[#E2E8F0]">
      <Icon size={20} style={{ color: colors[status] }} className="mb-2" />
      <div className="text-[13px] text-[#475569] mb-1">{label}</div>
      <div className="text-[#0F172A]">{value}</div>
    </div>
  );
};

const TaskRow: React.FC<{
  icon: any;
  task: string;
  time: string;
  status: "success" | "warning" | "neutral";
}> = ({ icon: Icon, task, time, status }) => {
  const getBadgeVariant = () => {
    if (status === "success") return "success";
    if (status === "warning") return "warning";
    return "neutral";
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-[#F8FAFC]">
      <Icon size={16} className="text-[#2563EB]" />
      <div className="flex-1">
        <div className="text-[#0F172A]">{task}</div>
        <div className="text-[13px] text-[#475569]">{time}</div>
      </div>
      <Badge variant={getBadgeVariant()} size="sm">
        {status === "success"
          ? "Done"
          : status === "warning"
          ? "Pending"
          : "Scheduled"}
      </Badge>
    </div>
  );
};

const NoteItem: React.FC<{ date: string; doctor: string; note: string }> = ({
  date,
  doctor,
  note,
}) => (
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

const MealRow: React.FC<{ meal: string; food: string }> = ({ meal, food }) => (
  <div className="flex gap-4 p-3 rounded-lg border border-[#E2E8F0]">
    <div className="text-[#0F172A] min-w-[100px]">{meal}</div>
    <div className="text-[#475569]">{food}</div>
  </div>
);

const ActivityCard: React.FC<{
  type: "allowed" | "restricted";
  activity: string;
}> = ({ type, activity }) => (
  <div
    className={`p-4 rounded-lg border ${
      type === "allowed"
        ? "border-[#BBF7D0] bg-[#F0FDF4]"
        : "border-[#FECACA] bg-[#FEF2F2]"
    }`}
    style={{ height: "80px" }}
  >
    <div
      className={`text-[14px] ${
        type === "allowed" ? "text-[#166534]" : "text-[#991B1B]"
      }`}
    >
      {activity}
    </div>
  </div>
);

const AppointmentRow: React.FC<{
  date: string;
  time: string;
  doctor: string;
  type: string;
  status: "confirmed" | "scheduled" | "completed";
}> = ({ date, time, doctor, type, status }) => {
  const getBadge = () => {
    if (status === "completed")
      return <Badge variant="neutral">Completed</Badge>;
    if (status === "confirmed")
      return <Badge variant="success">Confirmed</Badge>;
    return <Badge variant="info">Scheduled</Badge>;
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-[#E2E8F0]">
      <Calendar size={20} className="text-[#2563EB]" />
      <div className="flex-1">
        <div className="text-[#0F172A] mb-1">{type}</div>
        <div className="text-[14px] text-[#475569]">
          {date} at {time} • {doctor}
        </div>
      </div>
      {getBadge()}
    </div>
  );
};
