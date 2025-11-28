import React, { useState } from 'react';
import { MainLayout } from '../components/Layout/MainLayout';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const suggestedPrompts = [
  {
    title: 'Summarize recovery progress',
    description: 'Get a comprehensive overview of patient recovery',
  },
  {
    title: 'Predict risk factors',
    description: 'Analyze potential complications and risk areas',
  },
  {
    title: 'Explain instructions simply',
    description: 'Translate medical terms into plain language',
  },
  {
    title: 'Check danger signs',
    description: 'Identify symptoms that require immediate attention',
  },
  {
    title: 'Compare recovery timeline',
    description: 'Compare current progress to typical timelines',
  },
  {
    title: 'Medication interactions',
    description: 'Check for potential drug interactions',
  },
  {
    title: 'Diet recommendations',
    description: 'Get personalized dietary suggestions',
  },
  {
    title: 'Activity safety check',
    description: 'Verify if specific activities are safe',
  },
];

const initialMessages: Message[] = [
  {
    id: 1,
    type: 'ai',
    content: 'Hello! I\'m your AI Medical Assistant. I can help you with patient care, recovery monitoring, risk assessment, and answering medical questions. How can I assist you today?',
    timestamp: '9:00 AM',
  },
];

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  
  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newUserMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('progress') || lowerQuery.includes('recovery')) {
      return 'Based on the current data, John Martinez is recovering well from his knee replacement surgery. He\'s 12 days post-op and showing good progress, though his recovery is slightly slower than the typical timeline. His pain management is effective, and he\'s participating in physical therapy. However, his blood pressure remains elevated and requires monitoring. Overall recovery estimate: 8-10 weeks for full mobility restoration.';
    }
    
    if (lowerQuery.includes('risk') || lowerQuery.includes('danger')) {
      return '⚠️ Current Risk Factors:\n\n1. Elevated Blood Pressure (145/92) - Requires cardiology consultation\n2. Recovery pace slightly below average - May need increased PT frequency\n3. Age factor (58) - Monitor for potential complications\n\nImmediate Action Required: None\nMonitoring Recommended: Blood pressure daily, wound site inspection, mobility assessment';
    }
    
    if (lowerQuery.includes('medication')) {
      return 'Current Medications Overview:\n\n✓ Oxycodone 5mg - Pain management, every 6 hours\n✓ Cephalexin 500mg - Antibiotic, twice daily\n✓ Enoxaparin 40mg - Blood thinner, once daily\n\nNo significant drug interactions detected. However, monitor patient for side effects like drowsiness and nausea. Ensure patient takes medications with food to minimize GI upset.';
    }
    
    return 'I understand your question. Based on the patient\'s current condition and medical history, I recommend consulting with the primary care physician for specific guidance. I can provide general information, but personalized medical decisions should always involve the healthcare team.';
  };
  
  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };
  
  return (
    <MainLayout>
      <h1 className="mb-8">AI Medical Assistant</h1>
      
      <div className="grid grid-cols-[280px_1fr] gap-6">
        {/* Suggested Prompts Sidebar */}
        <div>
          <Card padding="16px">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-[#2563EB]" />
              <h3>Suggested Prompts</h3>
            </div>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt.title)}
                  className="w-full text-left p-3 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-colors bg-white cursor-pointer"
                >
                  <div className="text-[14px] text-[#0F172A] mb-1">{prompt.title}</div>
                  <div className="text-[12px] text-[#475569]">{prompt.description}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Chat Interface */}
        <Card padding="24px" className="flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-[12px] px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#F1F5F9] text-[#0F172A]'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-[#2563EB]" />
                      <span className="text-[13px] text-[#2563EB]">AI Assistant</span>
                    </div>
                  )}
                  <div className="whitespace-pre-line">{message.content}</div>
                  <div
                    className={`text-[11px] mt-2 ${
                      message.type === 'user' ? 'text-blue-200' : 'text-[#475569]'
                    }`}
                  >
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Area */}
          <div className="border-t border-[#E2E8F0] pt-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about patient care..."
                className="flex-1 px-4 py-3 rounded-[10px] border border-[#E2E8F0] bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              />
              <Button onClick={handleSend} className="px-6">
                <Send size={18} />
              </Button>
            </div>
            <div className="mt-3 text-[12px] text-[#475569]">
              AI responses are for informational purposes only. Always consult healthcare professionals for medical decisions.
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
