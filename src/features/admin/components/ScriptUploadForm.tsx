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
  createdAt: string;
}

interface ScriptUploadFormProps {
  onScriptUploaded?: () => void;
  onNavigateToVideos?: () => void;
}

export const ScriptUploadForm: React.FC<ScriptUploadFormProps> = ({ onScriptUploaded, onNavigateToVideos }) => {
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [scriptText, setScriptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 등록된 영상 목록 로드
  useEffect(() => {
    const adminVideos = JSON.parse(localStorage.getItem('adminVideos') || '[]');
    setVideos(adminVideos);
  }, []);

  // 스크립트 텍스트를 파싱하여 phrases 배열로 변환
  const parseScriptText = (text: string): Phrase[] => {
    const lines = text.trim().split('\n').filter(line => line.trim());
    const phrases: Phrase[] = [];

    lines.forEach((line, index) => {
      // 형식: MM:SS 중국어 (간체)
      const match = line.match(/^(\d{1,2}):(\d{2})\s+(.+)$/);
      
      if (match) {
        const [, minutes, seconds, chineseText] = match;
        const startTime = parseInt(minutes) * 60 + parseInt(seconds);
        
        // 다음 문장의 시작 시간을 찾아서 종료 시간 설정
        let endTime = startTime + 3; // 기본 3초 길이
        
        if (index < lines.length - 1) {
          const nextLine = lines[index + 1];
          const nextMatch = nextLine.match(/^(\d{1,2}):(\d{2})\s+(.+)$/);
          if (nextMatch) {
            const [, nextMinutes, nextSeconds] = nextMatch;
            endTime = parseInt(nextMinutes) * 60 + parseInt(nextSeconds);
          }
        }
        
        // 중국어 텍스트에서 병음과 한국어 번역 생성 (간단한 예시)
        const pinyin = generatePinyin(chineseText);
        const koreanTranslation = generateKoreanTranslation(chineseText);
        
        phrases.push({
          id: `phrase_${selectedVideoId}_${index}`,
          tStart: startTime,
          tEnd: endTime,
          zh: chineseText.trim(),
          pinyin: pinyin,
          ko: koreanTranslation,
          vocabRefs: [],
          grammarRefs: []
        });
      }
    });

    return phrases;
  };

  // 간단한 병음 생성 함수 (실제로는 더 정교한 번역 API 필요)
  const generatePinyin = (chineseText: string): string => {
    // 간단한 중국어-병음 매핑 (실제로는 더 정교한 API 필요)
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
    
    // 간단한 매핑 시도
    for (const [chinese, pinyin] of Object.entries(pinyinMap)) {
      if (chineseText.includes(chinese)) {
        return chineseText.replace(chinese, pinyin);
      }
    }
    
    return `[${chineseText}] 병음`;
  };

  // 간단한 한국어 번역 생성 함수 (실제로는 더 정교한 번역 API 필요)
  const generateKoreanTranslation = (chineseText: string): string => {
    // 간단한 중국어-한국어 매핑 (실제로는 더 정교한 API 필요)
    const translationMap: { [key: string]: string } = {
      '你好': '안녕하세요',
      '我是学生': '나는 학생입니다',
      '很高兴认识你': '만나서 반갑습니다',
      '感谢你表演物体模仿': '물체 모방을 연기해주셔서 감사합니다',
      '郑凯拥抱铅笔圆规': '정카이가 연필과 컴퍼스를 안습니다'
    };
    
    // 정확한 매핑 시도
    if (translationMap[chineseText]) {
      return translationMap[chineseText];
    }
    
    // 부분 매핑 시도
    for (const [chinese, korean] of Object.entries(translationMap)) {
      if (chineseText.includes(chinese)) {
        return chineseText.replace(chinese, korean);
      }
    }
    
    return `[${chineseText}] 한국어 번역`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!selectedVideoId) {
        throw new Error('영상을 선택해주세요.');
      }

      if (!scriptText.trim()) {
        throw new Error('스크립트를 입력해주세요.');
      }

      const phrases = parseScriptText(scriptText);
      
      if (phrases.length === 0) {
        throw new Error('올바른 형식의 스크립트를 입력해주세요.');
      }

      const scriptData: ScriptData = {
        videoId: selectedVideoId,
        phrases: phrases,
        createdAt: new Date().toISOString()
      };

      // 로컬 스토리지에 저장
      const existingScripts = JSON.parse(localStorage.getItem('adminScripts') || '[]');
      const existingIndex = existingScripts.findIndex((script: ScriptData) => script.videoId === selectedVideoId);
      
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

      // 폼 초기화
      setScriptText('');
      
      // 부모 컴포넌트에 스크립트 등록 완료 알림
      onScriptUploaded?.();
      
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

  const selectedVideo = videos.find(video => video.id === selectedVideoId);

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 영상 선택 */}
        <div>
          <label htmlFor="videoSelect" className="block text-label font-medium text-text-primary mb-2">
            영상 선택 *
          </label>
          <select
            id="videoSelect"
            value={selectedVideoId}
            onChange={(e) => setSelectedVideoId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-sm bg-surface text-body text-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isLoading}
          >
            <option value="">영상을 선택하세요</option>
            {videos.map((video) => (
              <option key={video.id} value={video.id}>
                {video.title} ({video.videoId})
              </option>
            ))}
          </select>
          {videos.length === 0 && (
            <p className="mt-1 text-caption text-text-secondary">
              먼저 영상을 등록해주세요.
            </p>
          )}
        </div>

        {/* 선택된 영상 정보 */}
        {selectedVideo && (
          <Panel className="p-4">
            <div className="flex items-start space-x-4">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-24 h-18 object-cover rounded-sm border border-border"
              />
              <div className="flex-1">
                <h3 className="text-body font-medium text-text-primary mb-1">
                  {selectedVideo.title}
                </h3>
                <p className="text-caption text-text-secondary mb-2">
                  {selectedVideo.description}
                </p>
                <p className="text-caption text-text-secondary">
                  Video ID: {selectedVideo.videoId}
                </p>
              </div>
            </div>
          </Panel>
        )}

        {/* 스크립트 입력 */}
        <div>
          <label htmlFor="scriptText" className="block text-label font-medium text-text-primary mb-2">
            스크립트 입력 *
          </label>
          <textarea
            id="scriptText"
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            placeholder={`MM:SS 중국어 (간체)

예시:
00:00 你好
00:03 我是学生
00:06 很高兴认识你
00:10 感谢你表演物体模仿
00:15 郑凯拥抱铅笔圆规`}
            rows={15}
            className="w-full px-3 py-2 border border-border rounded-sm bg-surface text-body text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
            required
            disabled={isLoading}
          />
          <p className="mt-1 text-caption text-text-secondary">
            형식: MM:SS 중국어 (간체) - 한 줄에 하나씩 입력하세요. 병음과 한국어 번역은 자동으로 생성됩니다.
          </p>
        </div>

        {message && (
          <div className={`p-3 rounded-sm ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-600' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            <p className="text-body">{message.text}</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !selectedVideoId || !scriptText.trim()}
        >
          {isLoading ? '등록 중...' : '스크립트 등록'}
        </Button>
      </form>
    </div>
  );
};
