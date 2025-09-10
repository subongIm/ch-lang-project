import React from 'react';
import { Chip } from '../../../shared/ui/Chip';
import { useFilterStore } from '../../../shared/stores/filterStore';
import { Vocab, Grammar } from '../../../shared/api/mockData';

interface KeywordChipsProps {
  vocabs: Vocab[];
  grammars: Grammar[];
  onVocabClick?: (vocabId: string) => void;
  onGrammarClick?: (grammarId: string) => void;
  className?: string;
}

export const KeywordChips: React.FC<KeywordChipsProps> = ({
  vocabs,
  grammars,
  onVocabClick,
  onGrammarClick,
  className,
}) => {
  const {
    selectedVocabIds,
    selectedGrammarIds,
    toggleVocabFilter,
    toggleGrammarFilter,
  } = useFilterStore();

  const handleVocabClick = (vocabId: string) => {
    toggleVocabFilter(vocabId);
    onVocabClick?.(vocabId);
  };

  const handleGrammarClick = (grammarId: string) => {
    toggleGrammarFilter(grammarId);
    onGrammarClick?.(grammarId);
  };

  return (
    <div className={className}>
      {/* Vocabulary Chips */}
      {vocabs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-label font-medium text-text-primary">단어</h4>
          <div className="flex flex-wrap gap-2">
            {vocabs.map((vocab) => (
              <Chip
                key={vocab.id}
                selected={selectedVocabIds.includes(vocab.id)}
                onClick={() => handleVocabClick(vocab.id)}
                className="animate-fade-in"
              >
                {vocab.term}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Grammar Chips */}
      {grammars.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-label font-medium text-text-primary">문법</h4>
          <div className="flex flex-wrap gap-2">
            {grammars.map((grammar) => (
              <Chip
                key={grammar.id}
                selected={selectedGrammarIds.includes(grammar.id)}
                onClick={() => handleGrammarClick(grammar.id)}
                className="animate-fade-in"
              >
                {grammar.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* No keywords message */}
      {vocabs.length === 0 && grammars.length === 0 && (
        <div className="text-center py-4 text-text-tertiary">
          <p className="text-body">관련 키워드가 없습니다.</p>
        </div>
      )}
    </div>
  );
};
