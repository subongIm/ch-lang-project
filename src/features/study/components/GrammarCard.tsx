import React from 'react';
import { Grammar } from '../../../shared/api/mockData';

interface GrammarCardProps {
  grammar: Grammar;
  className?: string;
}

export const GrammarCard: React.FC<GrammarCardProps> = ({ grammar, className }) => {
  return (
    <div className={`bg-surface-muted border border-border rounded-sm p-3 space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h6 className="text-body font-medium text-text-primary">{grammar.label}</h6>
        {grammar.level && (
          <span className={`text-label px-1.5 py-0.5 rounded-sm ${
            grammar.level === 'beginner' ? 'bg-green-100 text-green-800' :
            grammar.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {grammar.level === 'beginner' ? '초급' :
             grammar.level === 'intermediate' ? '중급' : '고급'}
          </span>
        )}
      </div>

      {/* Explanation */}
      <div className="text-body text-text-primary">
        <strong>설명:</strong> {grammar.explainKo}
      </div>

      {/* Patterns */}
      {grammar.patterns.length > 0 && (
        <div className="space-y-1">
          <h7 className="text-label font-medium text-text-primary">패턴:</h7>
          <ul className="space-y-1">
            {grammar.patterns.map((pattern, index) => (
              <li key={index} className="text-body text-text-secondary pl-2">
                • {pattern}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Examples */}
      {grammar.examples.length > 0 && (
        <div className="space-y-1">
          <h7 className="text-label font-medium text-text-primary">예문:</h7>
          <ul className="space-y-1">
            {grammar.examples.map((example, index) => (
              <li key={index} className="text-body text-text-secondary pl-2">
                • {example}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
