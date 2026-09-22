import React from 'react';
import * as DATA from '@/lib/data';
import { useApp } from '@/context/AppProvider';

export default function ApiView() {
  const { setViewMode } = useApp();

  // Simple custom JSON formatter to apply syntax highlighting classes
  const formatJSON = (obj: any): string => {
    let json = JSON.stringify(obj, null, 2);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'api-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'api-key';
        } else {
          cls = 'api-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'api-number'; // boolean color mapped to number color for simplicity
      } else if (/null/.test(match)) {
        cls = 'text-mute';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  };

  const payload = {
    status: 200,
    timestamp: new Date().toISOString(),
    developer: "Shivam Pratap Raj",
    endpoints: {
      personal: DATA.PERSONAL,
      experience: DATA.EXPERIENCES,
      projects: DATA.PROJECTS,
      skills: DATA.SKILLS,
      education: DATA.EDUCATION,
      achievements: DATA.ACHIEVEMENTS
    }
  };

  return (
    <div className="w-full min-h-screen bg-canvas font-mono text-xs sm:text-sm p-4 sm:p-8 pt-24 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-hairline pb-4">
          <div>
            <span className="text-accent font-bold">GET</span> <span className="text-mute">/api/v1/portfolio</span>
          </div>
          <button 
            onClick={() => setViewMode('ui')}
            className="px-4 py-1.5 border border-hairline rounded hover:bg-surface-soft transition-colors text-xs text-mute hover:text-ink"
          >
            Switch to UI Mode
          </button>
        </div>
        
        <pre 
          className="api-json whitespace-pre-wrap overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: formatJSON(payload) }}
        />
      </div>
    </div>
  );
}
