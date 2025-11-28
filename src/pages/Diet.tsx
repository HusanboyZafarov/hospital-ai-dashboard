import React from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Bot } from 'lucide-react';

const allowedFoods = [
  'Lean chicken and turkey',
  'Fish (salmon, cod, tuna)',
  'Fresh vegetables (broccoli, spinach, carrots)',
  'Whole grains (brown rice, quinoa, oats)',
  'Low-fat dairy products',
  'Eggs',
  'Legumes and beans',
  'Fresh fruits (berries, apples, oranges)',
  'Nuts and seeds (almonds, walnuts)',
  'Olive oil and avocado',
];

const forbiddenFoods = [
  'Processed meats (bacon, sausage, deli meats)',
  'High-sodium snacks (chips, crackers)',
  'Fried foods',
  'Fast food',
  'Sugary desserts and pastries',
  'Alcohol',
  'Carbonated beverages',
  'High-sodium canned foods',
  'Fatty red meats',
  'Full-fat dairy products',
];

const meals = [
  {
    name: 'Breakfast',
    time: '8:00 AM',
    items: [
      'Oatmeal with mixed berries',
      'Scrambled eggs (2 eggs)',
      'Whole wheat toast',
      'Herbal tea',
    ]
  },
  {
    name: 'Lunch',
    time: '12:30 PM',
    items: [
      'Grilled chicken salad',
      'Olive oil dressing',
      'Whole grain roll',
      'Fresh fruit',
    ]
  },
  {
    name: 'Dinner',
    time: '6:00 PM',
    items: [
      'Baked salmon',
      'Steamed vegetables',
      'Quinoa',
      'Side salad',
    ]
  },
  {
    name: 'Snacks',
    time: 'Throughout day',
    items: [
      'Greek yogurt',
      'Almonds (small handful)',
      'Apple slices',
      'Carrot sticks with hummus',
    ]
  },
];

export const Diet: React.FC = () => {
  return (
    <MainLayout>
      <h1 className="mb-8">Diet Plan</h1>
      
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
            Focus on lean proteins and vegetables to support post-surgical recovery. 
            Limit sodium intake to reduce swelling and support cardiovascular health. 
            Maintain adequate hydration with at least 8 glasses of water daily.
          </p>
        </div>
      </Card>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="mb-4 text-[#22C55E]">Allowed Foods</h3>
          <ul className="space-y-3">
            {allowedFoods.map((food, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#22C55E] mt-2 flex-shrink-0"></div>
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
                <div className="w-2 h-2 rounded-full bg-[#EF4444] mt-2 flex-shrink-0"></div>
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
                  <li key={itemIndex} className="flex items-center gap-2 text-[#475569]">
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
    </MainLayout>
  );
};
