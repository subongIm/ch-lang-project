'use client';

import { useState, useEffect } from 'react';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Panel } from '../../../shared/ui/Panel';

interface VideoData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoId: string;
  thumbnail: string;
  duration: number;
  createdAt: string;
}

interface Phrase {
  id: string;
  tStart: number;
  tEnd: number;
  zh: string;
  pinyin: string;
  ko: string;
  vocabRefs: string[];
  grammarRefs: string[];
}

interface ScriptData {
  videoId: string;
  phrases: Phrase[];
  vocabs?: any[];
  grammars?: any[];
  createdAt: string;
}

interface VideoAndScriptUploadFormProps {
  onUploadComplete?: () => void;
  onNavigateToVideos?: () => void;
}

export const VideoAndScriptUploadForm: React.FC<VideoAndScriptUploadFormProps> = ({ 
  onUploadComplete, 
  onNavigateToVideos 
}) => {
  // 영상 등록 상태
  const [videoFormData, setVideoFormData] = useState({
    title: '',
    description: '',
    videoUrl: ''
  });
  
  // 스크립트 등록 상태
  const [scriptText, setScriptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentStep, setCurrentStep] = useState<'video' | 'script'>('video');
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);

  // YouTube URL에서 videoId 추출
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  // YouTube 썸네일 URL 생성
  const getThumbnailUrl = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // 스크립트 텍스트를 파싱하여 phrases 배열로 변환
  const parseScriptText = (text: string): Phrase[] => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    const phrases: Phrase[] = [];
    let currentPhrase: any = null;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // 타임라인 형식: MM:SS
      const timeMatch = trimmedLine.match(/^(\d{1,2}):(\d{2})$/);
      if (timeMatch) {
        // 이전 문장이 있다면 저장
        if (currentPhrase) {
          phrases.push(currentPhrase);
        }
        
        const [, minutes, seconds] = timeMatch;
        const startTime = parseInt(minutes) * 60 + parseInt(seconds);
        
        currentPhrase = {
          id: `phrase_${uploadedVideoId}_${phrases.length}`,
          tStart: startTime,
          tEnd: startTime + 3, // 기본 3초 길이, 나중에 다음 문장 시간으로 업데이트
          zh: '',
          pinyin: '',
          ko: '',
          vocabRefs: [],
          grammarRefs: []
        };
        return;
      }
      
      // 중국어 텍스트 형식: 导演：周楚，我连叫都叫不出来。
      const chineseMatch = trimmedLine.match(/^(.+)$/);
      if (chineseMatch && currentPhrase && !currentPhrase.zh) {
        currentPhrase.zh = chineseMatch[1].trim();
        return;
      }
      
      // 병음 형식: Dǎoyǎn: Zhōu Chǔ, wǒ lián jiào dōu jiào bù chūlái.
      const pinyinMatch = trimmedLine.match(/^(.+)$/);
      if (pinyinMatch && currentPhrase && currentPhrase.zh && !currentPhrase.pinyin) {
        currentPhrase.pinyin = pinyinMatch[1].trim();
        return;
      }
      
      // 한국어 번역 형식: 감독: 저우추, 나 소리조차 못 지르겠어.
      const koreanMatch = trimmedLine.match(/^(.+)$/);
      if (koreanMatch && currentPhrase && currentPhrase.zh && currentPhrase.pinyin && !currentPhrase.ko) {
        currentPhrase.ko = koreanMatch[1].trim();
        return;
      }
    });
    
    // 마지막 문장 저장
    if (currentPhrase && currentPhrase.zh) {
      phrases.push(currentPhrase);
    }
    
    // 종료 시간 설정 (다음 문장의 시작 시간)
    phrases.forEach((phrase, index) => {
      if (index < phrases.length - 1) {
        phrase.tEnd = phrases[index + 1].tStart;
      } else {
        // 마지막 문장은 기본 3초 길이
        phrase.tEnd = phrase.tStart + 3;
      }
    });

    return phrases;
  };

  // 중국어 텍스트에서 단어와 문법 추출
  const extractKeywords = (chineseText: string): { vocabs: any[], grammars: any[] } => {
    const vocabs: any[] = [];
    const grammars: any[] = [];
    
    // 단어 사전 (중국어 → 한국어 의미)
    const vocabDict: { [key: string]: string } = {
      '导演': '감독',
      '周楚': '저우추 (인명)',
      '连': '조차, ~도',
      '叫': '부르다, 소리지르다',
      '都': '모두, 조차',
      '不': '~하지 않다',
      '出来': '나오다',
      '谢谢': '고마워요',
      '大家': '여러분',
      '我们': '우리',
      '来': '오다',
      '看看': '보다',
      '下一个': '다음',
      '节目': '프로그램',
      '感谢': '감사하다',
      '表演': '공연하다',
      '物体': '물체',
      '模仿': '모방하다',
      '郑凯': '정카이 (인명)',
      '拥抱': '포옹하다',
      '铅笔': '연필',
      '圆规': '컴퍼스'
    };
    
    // 문법 패턴 (중국어 → 한국어 의미)
    const grammarPatterns: { [key: string]: string } = {
      '连...都...': '조차...~도 (강조 표현)',
      '都...不...': '조차...~하지 않다 (부정 강조)',
      '...出来': '...나오다 (결과 보어)',
      '...看看': '...보자 (시도 표현)',
      '下一个': '다음 (순서 표현)'
    };
    
    // 단어 추출
    Object.entries(vocabDict).forEach(([chinese, meaning]) => {
      if (chineseText.includes(chinese)) {
        vocabs.push({
          id: `vocab_${chinese}_${Date.now()}`,
          term: chinese,
          meaning: meaning,
          pinyin: generatePinyin(chinese),
          level: 'intermediate'
        });
      }
    });
    
    // 문법 패턴 추출
    Object.entries(grammarPatterns).forEach(([pattern, meaning]) => {
      if (chineseText.includes(pattern.replace('...', ''))) {
        grammars.push({
          id: `grammar_${pattern}_${Date.now()}`,
          label: pattern,
          meaning: meaning,
          level: 'intermediate'
        });
      }
    });
    
    return { vocabs, grammars };
  };

  // 간단한 병음 생성 함수
  const generatePinyin = (chineseText: string): string => {
    const pinyinMap: { [key: string]: string } = {
      '你好': 'nǐ hǎo',
      '我是': 'wǒ shì',
      '学生': 'xué shēng',
      '很高兴': 'hěn gāo xìng',
      '认识': 'rèn shi',
      '你': 'nǐ',
      '感谢': 'gǎn xiè',
      '表演': 'biǎo yǎn',
      '物体': 'wù tǐ',
      '模仿': 'mó fǎng',
      '郑凯': 'zhèng kǎi',
      '拥抱': 'yōng bào',
      '铅笔': 'qiān bǐ',
      '圆规': 'yuán guī'
    };
    
    for (const [chinese, pinyin] of Object.entries(pinyinMap)) {
      if (chineseText.includes(chinese)) {
        return chineseText.replace(chinese, pinyin);
      }
    }
    
    return `[${chineseText}] 병음`;
  };

  // 간단한 한국어 번역 생성 함수
  const generateKoreanTranslation = (chineseText: string): string => {
    const translationMap: { [key: string]: string } = {
      '你好': '안녕하세요',
      '我是学生': '나는 학생입니다',
      '很高兴认识你': '만나서 반갑습니다',
      '感谢你表演物体模仿': '물체 모방을 연기해주셔서 감사합니다',
      '郑凯拥抱铅笔圆规': '정카이가 연필과 컴퍼스를 안습니다'
    };
    
    if (translationMap[chineseText]) {
      return translationMap[chineseText];
    }
    
    for (const [chinese, korean] of Object.entries(translationMap)) {
      if (chineseText.includes(chinese)) {
        return chineseText.replace(chinese, korean);
      }
    }
    
    return `[${chineseText}] 한국어 번역`;
  };

  // 영상 등록
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const videoId = extractVideoId(videoFormData.videoUrl);
      
      if (!videoId) {
        throw new Error('유효한 YouTube URL이 아닙니다.');
      }

      const newVideo: VideoData = {
        id: `admin_video_${Date.now()}`,
        title: videoFormData.title,
        description: videoFormData.description,
        videoUrl: videoFormData.videoUrl,
        videoId: videoId,
        thumbnail: getThumbnailUrl(videoId),
        duration: 0,
        createdAt: new Date().toISOString()
      };

      // 로컬 스토리지에 저장
      const existingVideos = JSON.parse(localStorage.getItem('adminVideos') || '[]');
      existingVideos.push(newVideo);
      localStorage.setItem('adminVideos', JSON.stringify(existingVideos));

      setUploadedVideoId(newVideo.id);
      setMessage({
        type: 'success',
        text: '영상이 성공적으로 등록되었습니다! 이제 스크립트를 등록하세요.'
      });

      // 스크립트 등록 단계로 이동
      setCurrentStep('script');

    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '영상 등록 중 오류가 발생했습니다.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 스크립트 등록
  const handleScriptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!uploadedVideoId) {
        throw new Error('영상을 먼저 등록해주세요.');
      }

      if (!scriptText.trim()) {
        throw new Error('스크립트를 입력해주세요.');
      }

      const phrases = parseScriptText(scriptText);
      
      if (phrases.length === 0) {
        throw new Error('올바른 형식의 스크립트를 입력해주세요.');
      }

      // 영상 정보 가져오기
      const adminVideos = JSON.parse(localStorage.getItem('adminVideos') || '[]');
      const video = adminVideos.find((v: VideoData) => v.id === uploadedVideoId);
      
      if (!video) {
        throw new Error('등록된 영상을 찾을 수 없습니다.');
      }

      // 모든 중국어 텍스트를 합쳐서 키워드 추출
      const allChineseText = phrases.map(p => p.zh).join(' ');
      const { vocabs, grammars } = extractKeywords(allChineseText);

      const scriptData: ScriptData = {
        videoId: video.videoId,
        phrases: phrases,
        vocabs: vocabs,
        grammars: grammars,
        createdAt: new Date().toISOString()
      };

      // 로컬 스토리지에 저장
      const existingScripts = JSON.parse(localStorage.getItem('adminScripts') || '[]');
      const existingIndex = existingScripts.findIndex((script: ScriptData) => script.videoId === video.videoId);
      
      if (existingIndex >= 0) {
        existingScripts[existingIndex] = scriptData;
      } else {
        existingScripts.push(scriptData);
      }
      
      localStorage.setItem('adminScripts', JSON.stringify(existingScripts));

      setMessage({
        type: 'success',
        text: `스크립트가 성공적으로 등록되었습니다! (${phrases.length}개 문장)`
      });

      // 완료 콜백 호출
      onUploadComplete?.();
      
      // 2초 후 영상 목록 페이지로 자동 이동
      setTimeout(() => {
        onNavigateToVideos?.();
      }, 2000);

    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '스크립트 등록 중 오류가 발생했습니다.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof videoFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setVideoFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const resetForm = () => {
    setVideoFormData({
      title: '',
      description: '',
      videoUrl: ''
    });
    setScriptText('');
    setCurrentStep('video');
    setUploadedVideoId(null);
    setMessage(null);
  };

  return (
    <div className="max-w-4xl">
      {/* 단계 표시 */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${currentStep === 'video' ? 'text-brand-primary' : 'text-text-secondary'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'video' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <span className="text-body font-medium">영상 등록</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div className={`flex items-center space-x-2 ${currentStep === 'script' ? 'text-brand-primary' : 'text-text-secondary'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === 'script' ? 'bg-brand-primary text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <span className="text-body font-medium">스크립트 등록</span>
          </div>
        </div>
      </div>

      {/* 영상 등록 폼 */}
      {currentStep === 'video' && (
        <form onSubmit={handleVideoSubmit} className="space-y-6">
          <Panel title="1단계: 영상 등록" subtitle="YouTube 영상을 등록합니다">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-label font-medium text-text-primary mb-2">
                  영상 제목 *
                </label>
                <Input
                  id="title"
                  type="text"
                  value={videoFormData.title}
                  onChange={handleInputChange('title')}
                  placeholder="학습 영상의 제목을 입력하세요"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-label font-medium text-text-primary mb-2">
                  영상 설명
                </label>
                <textarea
                  id="description"
                  value={videoFormData.description}
                  onChange={handleInputChange('description')}
                  placeholder="영상에 대한 설명을 입력하세요"
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-sm bg-surface text-body text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="videoUrl" className="block text-label font-medium text-text-primary mb-2">
                  YouTube URL *
                </label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={videoFormData.videoUrl}
                  onChange={handleInputChange('videoUrl')}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  disabled={isLoading}
                />
                <p className="mt-1 text-caption text-text-secondary">
                  YouTube 영상의 URL을 입력하세요
                </p>
              </div>
            </div>
          </Panel>

          {message && (
            <div className={`p-3 rounded-sm ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-600' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              <p className="text-body">{message.text}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={resetForm}
              variant="secondary"
              disabled={isLoading}
            >
              초기화
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !videoFormData.title || !videoFormData.videoUrl}
            >
              {isLoading ? '등록 중...' : '영상 등록'}
            </Button>
          </div>
        </form>
      )}

      {/* 스크립트 등록 폼 */}
      {currentStep === 'script' && (
        <form onSubmit={handleScriptSubmit} className="space-y-6">
          <Panel title="2단계: 스크립트 등록" subtitle="영상의 자막 스크립트를 등록합니다">
            <div className="space-y-6">
              <div>
                <label htmlFor="scriptText" className="block text-label font-medium text-text-primary mb-2">
                  스크립트 입력 *
                </label>
                <textarea
                  id="scriptText"
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder={`타임라인을 기준으로 스크립트를 입력하세요:

22:00
导演：周楚，我连叫都叫不出来。
Dǎoyǎn: Zhōu Chǔ, wǒ lián jiào dōu jiào bù chūlái.
감독: 저우추, 나 소리조차 못 지르겠어.

22:05
谢谢，谢谢大家
Xièxiè, xièxiè dàjiā
고마워요, 고마워요 여러분

22:10
我们来看看下一个节目
Wǒmen lái kànkan xià yīgè jiémù
우리 다음 프로그램을 봅시다`}
                  rows={15}
                  className="w-full px-3 py-2 border border-border rounded-sm bg-surface text-body text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
                  required
                  disabled={isLoading}
                />
                <p className="mt-1 text-caption text-text-secondary">
                  형식: 타임라인(MM:SS) → 중국어 → 병음 → 한국어 번역 순서로 입력하세요. 각 문장은 4줄로 구성됩니다.
                </p>
              </div>
            </div>
          </Panel>

          {message && (
            <div className={`p-3 rounded-sm ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-600' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              <p className="text-body">{message.text}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              onClick={() => setCurrentStep('video')}
              variant="secondary"
              disabled={isLoading}
            >
              ← 이전 단계
            </Button>
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={resetForm}
                variant="secondary"
                disabled={isLoading}
              >
                처음부터
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !scriptText.trim()}
              >
                {isLoading ? '등록 중...' : '스크립트 등록'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
