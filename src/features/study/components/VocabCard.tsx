import React from 'react';
import { Vocab } from '../../../shared/api/mockData';

interface VocabCardProps {
  vocab: Vocab;
  className?: string;
}

export const VocabCard: React.FC<VocabCardProps> = ({ vocab, className }) => {
  return (
    <div className={`bg-surface-muted border border-border rounded-sm p-3 space-y-2 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h6 className="text-body font-medium text-text-primary">{vocab.term}</h6>
          <span className="text-label text-text-secondary">[{vocab.pinyin}]</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="text-label text-text-tertiary">{vocab.pos}</span>
          {vocab.level && (
            <span className={`text-label px-1.5 py-0.5 rounded-sm ${
              vocab.level === 'beginner' ? 'bg-green-100 text-green-800' :
              vocab.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {vocab.level === 'beginner' ? '초급' :
               vocab.level === 'intermediate' ? '중급' : '고급'}
            </span>
          )}
        </div>
      </div>

      {/* Meaning */}
      <div className="text-body text-text-primary">
        <strong>의미:</strong> {vocab.meaningKo}
      </div>

      {/* Examples */}
      {vocab.examples.length > 0 && (
        <div className="space-y-1">
          <h7 className="text-label font-medium text-text-primary">예문:</h7>
          <ul className="space-y-1">
            {vocab.examples.map((example, index) => (
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
