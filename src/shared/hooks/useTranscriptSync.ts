import { useEffect, useCallback } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { Phrase } from '../api/mockData';

interface UseTranscriptSyncProps {
  phrases: Phrase[];
  onPhraseChange?: (phrase: Phrase | null) => void;
}

export const useTranscriptSync = ({ phrases, onPhraseChange }: UseTranscriptSyncProps) => {
  const { currentTime, setActivePhraseId } = usePlayerStore();

  // Binary search to find active phrase based on current time
  const findActivePhrase = useCallback((time: number): Phrase | null => {
    if (phrases.length === 0) return null;

    let left = 0;
    let right = phrases.length - 1;
    let result: Phrase | null = null;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const phrase = phrases[mid];

      if (time >= phrase.tStart && time <= phrase.tEnd) {
        result = phrase;
        break;
      } else if (time < phrase.tStart) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return result;
  }, [phrases]);

  // Update active phrase when current time changes
  useEffect(() => {
    const activePhrase = findActivePhrase(currentTime);
    
    if (activePhrase) {
      setActivePhraseId(activePhrase.id);
      onPhraseChange?.(activePhrase);
    } else {
      setActivePhraseId(null);
      onPhraseChange?.(null);
    }
  }, [currentTime, findActivePhrase]);

  // Seek to specific phrase
  const seekToPhrase = useCallback((phrase: Phrase) => {
    const { seekTo } = usePlayerStore.getState();
    seekTo(phrase.tStart);
  }, []);

  // Get phrases in time range
  const getPhrasesInRange = useCallback((startTime: number, endTime: number) => {
    return phrases.filter(phrase => 
      phrase.tStart >= startTime && phrase.tEnd <= endTime
    );
  }, [phrases]);

  // Get phrases containing specific vocab or grammar
  const getPhrasesByKeyword = useCallback((keywordId: string, type: 'vocab' | 'grammar') => {
    return phrases.filter(phrase => {
      if (type === 'vocab') {
        return phrase.vocabRefs.includes(keywordId);
      } else {
        return phrase.grammarRefs.includes(keywordId);
      }
    });
  }, [phrases]);

  return {
    findActivePhrase,
    seekToPhrase,
    getPhrasesInRange,
    getPhrasesByKeyword,
  };
};
