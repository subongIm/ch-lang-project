import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Phrase } from '../../../shared/api/mockData';
import { usePlayerStore } from '../../../shared/stores/playerStore';

interface TranscriptListProps {
  phrases: Phrase[];
  onPhraseClick?: (phrase: Phrase) => void;
  className?: string;
}

export const TranscriptList: React.FC<TranscriptListProps> = ({
  phrases,
  onPhraseClick,
  className,
}) => {
  const { activePhraseId, setActivePhraseId } = usePlayerStore();
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active phrase
  useEffect(() => {
    if (activePhraseId && listRef.current) {
      const activeElement = listRef.current.querySelector(`[data-phrase-id="${activePhraseId}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [activePhraseId]);

  // Find active phrase based on current time
  const findActivePhrase = (currentTime: number) => {
    return phrases.find(phrase => 
      currentTime >= phrase.tStart && currentTime <= phrase.tEnd
    );
  };

  // Update active phrase when current time changes
  useEffect(() => {
    const unsubscribe = usePlayerStore.subscribe((state) => {
      const activePhrase = findActivePhrase(state.currentTime);
      if (activePhrase && activePhrase.id !== state.activePhraseId) {
        setActivePhraseId(activePhrase.id);
      }
    });
    return unsubscribe;
  }, [phrases, setActivePhraseId]);

  const handlePhraseClick = (phrase: Phrase) => {
    onPhraseClick?.(phrase);
    setActivePhraseId(phrase.id);
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <div ref={listRef} className={clsx('space-y-1', className)}>
      {phrases.map((phrase) => {
        const isActive = activePhraseId === phrase.id;

        return (
          <div
            key={phrase.id}
            data-phrase-id={phrase.id}
            className={clsx(
              'group rounded-sm p-3 transition-all duration-base cursor-pointer',
              'hover:bg-hover-bg',
              isActive && 'bg-list-row-bg-active border-l-3 border-list-row-border-active'
            )}
            onClick={() => handlePhraseClick(phrase)}
          >
            {/* Main phrase content */}
            <div className="flex items-start space-x-3">
              {/* Timestamp */}
              <div className="flex-shrink-0">
                <div className="bg-chip-bg text-chip-text border border-chip-border rounded-lg px-2 py-1 text-mono">
                  {formatTime(phrase.tStart)}
                </div>
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="space-y-1">
                  {/* Chinese text */}
                  <div className="text-body text-text-primary font-medium">
                    {phrase.zh}
                  </div>
                  
                  {/* Pinyin */}
                  <div className="text-body text-text-secondary">
                    {phrase.pinyin}
                  </div>
                  
                  {/* Korean translation */}
                  <div className="text-body text-text-primary">
                    {phrase.ko}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
