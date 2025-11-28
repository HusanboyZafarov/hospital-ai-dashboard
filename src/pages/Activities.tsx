import React, { useState } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { CheckCircle, XCircle } from 'lucide-react';

const allowedActivities = [
  'Gentle walking (10-15 minutes)',
  'Seated exercises',
  'Upper body stretches',
  'Reading and mental activities',
  'Light household tasks (seated)',
  'Physical therapy exercises',
  'Breathing exercises',
  'Ankle pumps and rotations',
  'Arm circles',
  'Meditation and relaxation',
  'Using assistive devices',
  'Short distance ambulation',
];

const restrictedActivities = [
  'Running or jogging',
  'Heavy lifting (>10 lbs)',
  'Jumping or hopping',
  'Climbing stairs independently',
  'Contact sports',
  'Driving (first 6 weeks)',
  'Kneeling or squatting',
  'High-impact exercises',
  'Swimming (until wound healed)',
  'Bending at waist deeply',
  'Twisting motions',
  'Standing for long periods',
];

export const Activities: React.FC = () => {
  const [activityQuery, setActivityQuery] = useState('');
  
  const handleCheckSafety = () => {
    alert('AI Safety Check: This feature would analyze the activity and provide safety recommendations based on the patient\'s current condition and recovery stage.');
  };
  
  return (
    <MainLayout>
      <h1 className="mb-8">Activities</h1>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="mb-6 text-[#22C55E]">Allowed Activities</h2>
          <div className="grid grid-cols-2 gap-4">
            {allowedActivities.map((activity, index) => (
              <Card key={index} padding="16px" className="h-[80px] hover:border-[#22C55E] transition-colors cursor-pointer">
                <div className="flex items-start gap-2 h-full">
                  <CheckCircle size={16} className="text-[#22C55E] flex-shrink-0 mt-1" />
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
              <Card key={index} padding="16px" className="h-[80px] hover:border-[#EF4444] transition-colors cursor-pointer">
                <div className="flex items-start gap-2 h-full">
                  <XCircle size={16} className="text-[#EF4444] flex-shrink-0 mt-1" />
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
          Ask AI if an activity is safe for this patient's current condition. 
          The AI will analyze the activity against the patient's surgery type, 
          recovery stage, and current health status.
        </p>
        <div className="flex gap-4">
          <Input 
            placeholder="E.g., Can I swim? Can I lift my grandchild?"
            value={activityQuery}
            onChange={(e) => setActivityQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCheckSafety}>Check Safety</Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
          <h3 className="mb-4">Example Queries</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActivityQuery('Can I drive to the store?')}
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-[14px] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors bg-white cursor-pointer"
            >
              Can I drive to the store?
            </button>
            <button 
              onClick={() => setActivityQuery('Is it safe to go up and down stairs?')}
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-[14px] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors bg-white cursor-pointer"
            >
              Is it safe to go up and down stairs?
            </button>
            <button 
              onClick={() => setActivityQuery('Can I work from home at my desk?')}
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-[14px] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors bg-white cursor-pointer"
            >
              Can I work from home at my desk?
            </button>
            <button 
              onClick={() => setActivityQuery('When can I return to yoga?')}
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-[14px] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors bg-white cursor-pointer"
            >
              When can I return to yoga?
            </button>
          </div>
        </div>
      </Card>
    </MainLayout>
  );
};
