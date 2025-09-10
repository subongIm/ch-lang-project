'use client';

import { useState } from 'react';
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

export const VideoUploadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const videoId = extractVideoId(formData.videoUrl);
      
      if (!videoId) {
        throw new Error('유효한 YouTube URL이 아닙니다.');
      }

      // 새로운 영상 데이터 생성
      const newVideo: VideoData = {
        id: `admin_video_${Date.now()}`,
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        videoId: videoId,
        thumbnail: getThumbnailUrl(videoId),
        duration: 0, // 실제로는 YouTube API로 가져와야 함
        createdAt: new Date().toISOString()
      };

      // 로컬 스토리지에 저장
      const existingVideos = JSON.parse(localStorage.getItem('adminVideos') || '[]');
      existingVideos.push(newVideo);
      localStorage.setItem('adminVideos', JSON.stringify(existingVideos));

      setMessage({
        type: 'success',
        text: '영상이 성공적으로 등록되었습니다!'
      });

      // 폼 초기화
      setFormData({
        title: '',
        description: '',
        videoUrl: ''
      });

    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '영상 등록 중 오류가 발생했습니다.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-label font-medium text-text-primary mb-2">
            영상 제목 *
          </label>
          <Input
            id="title"
            type="text"
            value={formData.title}
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
            value={formData.description}
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
            value={formData.videoUrl}
            onChange={handleInputChange('videoUrl')}
            placeholder="https://www.youtube.com/watch?v=..."
            required
            disabled={isLoading}
          />
          <p className="mt-1 text-caption text-text-secondary">
            YouTube 영상의 URL을 입력하세요
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
          disabled={isLoading || !formData.title || !formData.videoUrl}
        >
          {isLoading ? '등록 중...' : '영상 등록'}
        </Button>
      </form>
    </div>
  );
};
