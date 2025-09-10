'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Panel } from '../../../shared/ui/Panel';
import { Button } from '../../../shared/ui/Button';
import { getClipById, getPhrasesByClipId, getVocabById, getGrammarById, Phrase, Vocab, Grammar } from '../../../shared/api/mockData';

interface QuizQuestion {
  id: string;
  type: 'vocab' | 'grammar' | 'translation';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  phraseId?: string;
}

export default function ReviewPage() {
  const params = useParams();
  const clipId = params.clipId as string;
  const [clip, setClip] = useState(getClipById(clipId));
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Load data and generate questions
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

    // Generate quiz questions
    const generatedQuestions = generateQuestions(phrasesData, vocabsData, grammarsData);
    setQuestions(generatedQuestions);
  }, [clipId]);

  const generateQuestions = (phrases: Phrase[], vocabs: Vocab[], grammars: Grammar[]): QuizQuestion[] => {
    const questions: QuizQuestion[] = [];

    // Vocabulary questions
    vocabs.forEach(vocab => {
      if (vocab.examples.length > 0) {
        questions.push({
          id: `vocab_${vocab.id}`,
          type: 'vocab',
          question: `"${vocab.term}"의 의미는 무엇인가요?`,
          options: [
            vocab.meaningKo,
            ...vocabs.filter(v => v.id !== vocab.id).slice(0, 3).map(v => v.meaningKo)
          ].sort(() => Math.random() - 0.5),
          correctAnswer: 0,
          explanation: `정답: ${vocab.meaningKo} (${vocab.pinyin})`,
        });
      }
    });

    // Grammar questions
    grammars.forEach(grammar => {
      if (grammar.examples.length > 0) {
        const correctExample = grammar.examples[0];
        const wrongExamples = grammars
          .filter(g => g.id !== grammar.id)
          .flatMap(g => g.examples)
          .slice(0, 3);
        
        questions.push({
          id: `grammar_${grammar.id}`,
          type: 'grammar',
          question: `"${grammar.label}" 패턴에 맞는 문장은?`,
          options: [
            correctExample,
            ...wrongExamples
          ].sort(() => Math.random() - 0.5),
          correctAnswer: 0,
          explanation: `정답: ${correctExample}\n설명: ${grammar.explainKo}`,
        });
      }
    });

    // Translation questions
    phrases.forEach(phrase => {
      questions.push({
        id: `translation_${phrase.id}`,
        type: 'translation',
        question: `다음 중국어를 한국어로 번역하세요: "${phrase.zh}"`,
        options: [
          phrase.ko,
          ...phrases.filter(p => p.id !== phrase.id).slice(0, 3).map(p => p.ko)
        ].sort(() => Math.random() - 0.5),
        correctAnswer: 0,
        explanation: `정답: ${phrase.ko}\n병음: ${phrase.pinyin}`,
        phraseId: phrase.id,
      });
    });

    return questions.sort(() => Math.random() - 0.5).slice(0, 10); // Limit to 10 questions
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowResult(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
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

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-h1 text-text-primary mb-2">복습 문제가 없습니다</h2>
          <p className="text-body text-text-secondary">이 클립에는 복습할 내용이 충분하지 않습니다.</p>
        </div>
      </div>
    );
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-gradient-to-b from-page-bg-from to-page-bg-to p-6">
        <div className="max-w-2xl mx-auto">
          <Panel className="text-center">
            <div className="space-y-6">
              <div className="text-6xl">
                {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
              </div>
              
              <div>
                <h1 className="text-h1 text-text-primary mb-2">복습 완료!</h1>
                <p className="text-body text-text-secondary">
                  {questions.length}문제 중 {score}문제를 맞혔습니다.
                </p>
              </div>

              <div className="bg-surface-muted rounded-sm p-4">
                <div className="text-4xl font-bold text-brand-primary mb-2">
                  {percentage}%
                </div>
                <div className="text-body text-text-secondary">
                  {percentage >= 80 ? '훌륭합니다!' : 
                   percentage >= 60 ? '잘했습니다!' : '더 공부해보세요!'}
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleRestart} className="flex-1">
                  다시 복습
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => window.history.back()}
                  className="flex-1"
                >
                  돌아가기
                </Button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-page-bg-from to-page-bg-to p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-h1 text-text-primary mb-2">{clip.title} - 복습</h1>
          <p className="text-body text-text-secondary">
            문제 {currentQuestionIndex + 1} / {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <Panel className="mb-6">
          <div className="w-full bg-timeline-track rounded-pill h-2">
            <div 
              className="bg-timeline-played rounded-pill h-2 transition-all duration-base"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </Panel>

        {/* Question */}
        <Panel>
          <div className="space-y-6">
            <div>
              <h2 className="text-h2 text-text-primary mb-4">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-sm border transition-all duration-base focus-ring ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQuestion.correctAnswer
                          ? 'bg-success text-text-inverse border-success'
                          : 'bg-danger text-text-inverse border-danger'
                        : 'bg-selected-bg border-selected-border'
                      : showResult && index === currentQuestion.correctAnswer
                      ? 'bg-success text-text-inverse border-success'
                      : 'bg-surface border-border hover:bg-hover-bg'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? showResult
                          ? index === currentQuestion.correctAnswer
                            ? 'border-text-inverse'
                            : 'border-text-inverse'
                          : 'border-selected-border bg-selected-bg'
                        : showResult && index === currentQuestion.correctAnswer
                        ? 'border-text-inverse'
                        : 'border-border'
                    }`}>
                      {selectedAnswer === index && (
                        <div className={`w-2 h-2 rounded-full ${
                          showResult
                            ? index === currentQuestion.correctAnswer
                              ? 'bg-text-inverse'
                              : 'bg-text-inverse'
                            : 'bg-selected-border'
                        }`} />
                      )}
                      {showResult && index === currentQuestion.correctAnswer && selectedAnswer !== index && (
                        <div className="w-2 h-2 rounded-full bg-text-inverse" />
                      )}
                    </div>
                    <span className="text-body">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            {!showResult && (
              <Button 
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                className="w-full"
              >
                답안 제출
              </Button>
            )}

            {/* Result */}
            {showResult && (
              <div className="space-y-4">
                <div className={`p-4 rounded-sm ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-success text-text-inverse'
                    : 'bg-danger text-text-inverse'
                }`}>
                  <h3 className="text-h2 font-medium mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? '정답입니다!' : '틀렸습니다.'}
                  </h3>
                  <p className="text-body whitespace-pre-line">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <Button onClick={handleNextQuestion} className="w-full">
                  {currentQuestionIndex < questions.length - 1 ? '다음 문제' : '결과 보기'}
                </Button>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
