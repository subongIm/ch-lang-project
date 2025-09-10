'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { PlayerPanel } from '../../../features/study/components/PlayerPanel';
import { TranscriptList } from '../../../features/study/components/TranscriptList';
import { KeywordChips } from '../../../features/study/components/KeywordChips';
import { Panel } from '../../../shared/ui/Panel';
import { Input } from '../../../shared/ui/Input';
import { Button } from '../../../shared/ui/Button';
import { useTranscriptSync } from '../../../shared/hooks/useTranscriptSync';
import { useFilterStore } from '../../../shared/stores/filterStore';
import { useUserStore } from '../../../shared/stores/userStore';
import { 
  getClipById, 
  getPhrasesByClipId, 
  getVocabById, 
  getGrammarById,
  Phrase,
  Vocab,
  Grammar
} from '../../../shared/api/mockData';

export default function StudyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const clipId = params.clipId as string;
  const startTime = Number(searchParams.get('start')) || 0;
  const endTime = Number(searchParams.get('end')) || 600;

  const [clip, setClip] = useState(getClipById(clipId));
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [filteredPhrases, setFilteredPhrases] = useState<Phrase[]>([]);

  const { searchQuery, selectedVocabIds, selectedGrammarIds, setSearchQuery } = useFilterStore();
  const { addBookmark, currentUser } = useUserStore();

  // Load data
  useEffect(() => {
    if (!clipId) return;

    const clipData = getClipById(clipId);
    if (!clipData) return;

    setClip(clipData);
    
    const phrasesData = getPhrasesByClipId(clipId);
    setPhrases(phrasesData);

    // Extract unique vocabs and grammars
    const allVocabIds = new Set<string>();
    const allGrammarIds = new Set<string>();
    
    phrasesData.forEach(phrase => {
      phrase.vocabRefs.forEach(id => allVocabIds.add(id));
      phrase.grammarRefs.forEach(id => allGrammarIds.add(id));
    });

    const vocabsData = Array.from(allVocabIds).map(id => getVocabById(id)).filter(Boolean) as Vocab[];
    const grammarsData = Array.from(allGrammarIds).map(id => getGrammarById(id)).filter(Boolean) as Grammar[];

    setVocabs(vocabsData);
    setGrammars(grammarsData);
  }, [clipId]);

  // Filter phrases based on search and selected keywords
  useEffect(() => {
    let filtered = phrases;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(phrase =>
        phrase.zh.toLowerCase().includes(query) ||
        phrase.pinyin.toLowerCase().includes(query) ||
        phrase.ko.toLowerCase().includes(query)
      );
    }

    // Vocab filter
    if (selectedVocabIds.length > 0) {
      filtered = filtered.filter(phrase =>
        selectedVocabIds.some(vocabId => phrase.vocabRefs.includes(vocabId))
      );
    }

    // Grammar filter
    if (selectedGrammarIds.length > 0) {
      filtered = filtered.filter(phrase =>
        selectedGrammarIds.some(grammarId => phrase.grammarRefs.includes(grammarId))
      );
    }

    setFilteredPhrases(filtered);
  }, [phrases, searchQuery, selectedVocabIds, selectedGrammarIds]);

  // Timeline sync
  const { seekToPhrase } = useTranscriptSync({
    phrases: filteredPhrases,
    onPhraseChange: (phrase) => {
      // Handle phrase change if needed
    }
  });

  const handlePhraseClick = (phrase: Phrase) => {
    seekToPhrase(phrase);
  };

  const handleBookmark = () => {
    if (!currentUser || !clip) return;
    
    addBookmark({
      userId: currentUser.id,
      clipId: clip.id,
      t: 0, // Current time would be from player store
      note: '학습 북마크',
    });
  };

  if (!clip) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-h1 text-text-primary mb-2">클립을 찾을 수 없습니다</h2>
          <p className="text-body text-text-secondary">잘못된 클립 ID입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-page-bg-from to-page-bg-to p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-h1 text-text-primary mb-2">{clip.title}</h1>
          <p className="text-body text-text-secondary">
            {Math.floor(startTime / 60)}:{(startTime % 60).toString().padStart(2, '0')} - 
            {Math.floor(endTime / 60)}:{(endTime % 60).toString().padStart(2, '0')}
          </p>
        </div>

        {/* Top Section - Video (left with tools below) and Script (right) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column - Player + Tools */}
          <div className="space-y-6">
            <PlayerPanel
              videoId={clip.source.videoId}
              startTime={startTime}
              endTime={endTime}
            />

            {/* Tools under the player */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Search */}
              <Panel>
                <Input
                  placeholder="문장 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </Panel>

              {/* Bookmark Button */}
              {currentUser && (
                <Panel>
                  <Button onClick={handleBookmark} className="w-full">
                    현재 문장 북마크
                  </Button>
                </Panel>
              )}
            </div>
          </div>

          {/* Right Column - Script */}
          <div>
            <Panel title="스크립트" subtitle={`${filteredPhrases.length}개 문장`}>
              <div className="max-h-64 xl:max-h-96 overflow-y-auto">
                <TranscriptList
                  phrases={filteredPhrases}
                  vocabs={vocabs}
                  grammars={grammars}
                  onPhraseClick={handlePhraseClick}
                />
              </div>
            </Panel>
          </div>
        </div>

        {/* Bottom Section - Keywords only */}
        <div className="mt-6">
          <Panel title="키워드" subtitle="관련 단어와 문법을 선택하세요">
            <KeywordChips
              vocabs={vocabs}
              grammars={grammars}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
