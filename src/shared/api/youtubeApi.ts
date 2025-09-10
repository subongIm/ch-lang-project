// YouTube Data API functions
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || 'AIzaSyDIgltLxmNIO_dkAWXP408cU9UcVj5MYic';

// Fallback data for when API fails
const FALLBACK_VIDEO_INFO = {
  'CFPKWcRJGk0': {
    id: 'CFPKWcRJGk0',
    title: '새로운 YouTube 학습 영상',
    description: '중국어 학습을 위한 새로운 영상',
    thumbnail: 'https://img.youtube.com/vi/CFPKWcRJGk0/maxresdefault.jpg',
    duration: 'PT1H30M', // 1시간 30분으로 가정
    publishedAt: '2024-01-01T00:00:00Z',
    channelTitle: '학습 채널'
  },
};

export interface YouTubeVideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string; // ISO 8601 duration format
  publishedAt: string;
  channelTitle: string;
}

export async function getYouTubeVideoInfo(videoId: string): Promise<YouTubeVideoInfo | null> {
  try {
    console.log('Fetching YouTube video info for:', videoId);
    console.log('Using API key:', YOUTUBE_API_KEY ? 'Present' : 'Missing');
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('YouTube API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      // Use fallback data if API fails
      if (FALLBACK_VIDEO_INFO[videoId as keyof typeof FALLBACK_VIDEO_INFO]) {
        console.log('Using fallback data for video:', videoId);
        return FALLBACK_VIDEO_INFO[videoId as keyof typeof FALLBACK_VIDEO_INFO];
      }
      
      throw new Error(`YouTube API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url,
        duration: video.contentDetails.duration,
        publishedAt: video.snippet.publishedAt,
        channelTitle: video.snippet.channelTitle
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching YouTube video info:', error);
    
    // Use fallback data if available
    if (FALLBACK_VIDEO_INFO[videoId as keyof typeof FALLBACK_VIDEO_INFO]) {
      console.log('Using fallback data for video:', videoId);
      return FALLBACK_VIDEO_INFO[videoId as keyof typeof FALLBACK_VIDEO_INFO];
    }
    
    return null;
  }
}

// Convert ISO 8601 duration to seconds
export function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

// YouTube Captions API interfaces
export interface CaptionTrack {
  baseUrl: string;
  name: string;
  languageCode: string;
  isTranslatable: boolean;
}

export interface CaptionListResponse {
  captionTracks: CaptionTrack[];
}

export interface CaptionSegment {
  start: number;
  duration: number;
  text: string;
}

export interface CaptionData {
  videoId: string;
  title: string;
  segments: CaptionSegment[];
  language: string;
  generatedAt: string;
}

// Get available captions for a video
export async function getVideoCaptions(videoId: string): Promise<CaptionTrack[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch captions: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items?.map((item: any) => ({
      baseUrl: item.snippet.trackKind === 'asr' ? 
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${item.snippet.language}&fmt=json3` :
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${item.snippet.language}&fmt=json3&tlang=zh-cn`,
      name: item.snippet.name,
      languageCode: item.snippet.language,
      isTranslatable: item.snippet.isTranslatable
    })) || [];
  } catch (error) {
    console.error('Error fetching video captions:', error);
    return [];
  }
}

// Get captions with Chinese translation
export async function getCaptionsWithChineseTranslation(videoId: string): Promise<CaptionTrack[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch captions: ${response.status}`);
    }
    
    const data = await response.json();
    const captionTracks: CaptionTrack[] = [];
    
    if (data.items) {
      for (const item of data.items) {
        const track: CaptionTrack = {
          baseUrl: `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${item.snippet.language}&fmt=json3`,
          name: item.snippet.name,
          languageCode: item.snippet.language,
          isTranslatable: item.snippet.isTranslatable
        };
        
        captionTracks.push(track);
        
        // Add Chinese translation if translatable
        if (item.snippet.isTranslatable) {
          captionTracks.push({
            baseUrl: `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${item.snippet.language}&fmt=json3&tlang=zh-cn`,
            name: `${item.snippet.name} (中文简体)`, 
            languageCode: 'zh-cn',
            isTranslatable: false
          });
        }
      }
    }
    
    return captionTracks;
  } catch (error) {
    console.error('Error fetching video captions with translation:', error);
    return [];
  }
}

// Download and parse caption content
export async function downloadCaptionContent(captionUrl: string): Promise<CaptionSegment[]> {
  try {
    const response = await fetch(captionUrl);
    if (!response.ok) {
      throw new Error(`Failed to download caption: ${response.status}`);
    }
    
    const data = await response.json();
    const segments: CaptionSegment[] = [];
    
    // Parse YouTube's JSON3 caption format
    if (data.events) {
      data.events.forEach((event: any) => {
        if (event.segs) {
          const text = event.segs.map((seg: any) => seg.utf8).join('');
          if (text.trim()) {
            segments.push({
              start: event.tStartMs / 1000,
              duration: (event.dDurationMs || 0) / 1000,
              text: text.trim()
            });
          }
        }
      });
    }
    
    return segments;
  } catch (error) {
    console.error('Error downloading caption content:', error);
    return [];
  }
}

// Check if caption JSON file exists for videoId
export async function checkCaptionFileExists(videoId: string): Promise<boolean> {
  try {
    // Try to fetch the file from public directory
    const response = await fetch(`/captions/${videoId}.json`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Load caption data from existing JSON file
export async function loadCaptionDataFromFile(videoId: string): Promise<CaptionData | null> {
  try {
    const response = await fetch(`/captions/${videoId}.json`);
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data as CaptionData;
  } catch (error) {
    console.error('Error loading caption data from file:', error);
    return null;
  }
}

// Generate script data from captions (with file caching)
export async function generateScriptFromCaptions(
  videoId: string, 
  startTime: number, 
  endTime: number,
  forceRefresh: boolean = false
): Promise<CaptionData | null> {
  try {
    // Check if file exists and not forcing refresh
    if (!forceRefresh) {
      const existingData = await loadCaptionDataFromFile(videoId);
      if (existingData) {
        console.log('Using existing caption file for videoId:', videoId);
        
        // Filter segments within the specified time range
        const filteredSegments = existingData.segments.filter(segment => 
          segment.start >= startTime && segment.start <= endTime
        );
        
        // Convert to relative time (starting from 0)
        const relativeSegments = filteredSegments.map(segment => ({
          ...segment,
          start: segment.start - startTime
        }));
        
        return {
          ...existingData,
          segments: relativeSegments
        };
      }
    }
    
    // Get video info first
    const videoInfo = await getYouTubeVideoInfo(videoId);
    if (!videoInfo) {
      throw new Error('Video not found');
    }
    
    // Get available captions with Chinese translation
    const captions = await getCaptionsWithChineseTranslation(videoId);
    if (captions.length === 0) {
      throw new Error('No captions available for this video');
    }
    
    // Try to find Chinese captions first, then auto-generated captions
    let selectedCaption = captions.find(c => c.languageCode === 'zh-cn') || 
                         captions.find(c => c.languageCode.startsWith('zh')) || 
                         captions.find(c => c.name.includes('自动生成')) ||
                         captions[0];
    
    console.log('Selected caption:', selectedCaption);
    
    // Download caption content
    const segments = await downloadCaptionContent(selectedCaption.baseUrl);
    
    // Filter segments within the specified time range
    const filteredSegments = segments.filter(segment => 
      segment.start >= startTime && segment.start <= endTime
    );
    
    // Convert to relative time (starting from 0)
    const relativeSegments = filteredSegments.map(segment => ({
      ...segment,
      start: segment.start - startTime
    }));
    
    const captionData: CaptionData = {
      videoId,
      title: videoInfo.title,
      segments: relativeSegments,
      language: selectedCaption.languageCode,
      generatedAt: new Date().toISOString()
    };
    
    return captionData;
  } catch (error) {
    console.error('Error generating script from captions:', error);
    return null;
  }
}

// Save caption data to JSON file
export function saveCaptionDataToFile(captionData: CaptionData): void {
  const filename = `${captionData.videoId}-${captionData.title.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.json`;
  const jsonString = JSON.stringify(captionData, null, 2);
  
  // Create and download file
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log(`Caption data saved as: ${filename}`);
}

// Convert caption segments to phrases format
export function convertCaptionsToPhrases(
  captionData: CaptionData, 
  clipId: string
): Array<{
  id: string;
  clipId: string;
  tStart: number;
  tEnd: number;
  zh: string;
  pinyin: string;
  ko: string;
  vocabRefs: string[];
  grammarRefs: string[];
}> {
  return captionData.segments.map((segment, index) => ({
    id: `ph_${String(index + 1).padStart(3, '0')}`,
    clipId,
    tStart: segment.start,
    tEnd: segment.start + segment.duration,
    zh: segment.text,
    pinyin: '', // Would need pinyin conversion service
    ko: '', // Would need translation service
    vocabRefs: [],
    grammarRefs: []
  }));
}

// Generate complete script data from JSON file
export async function generateScriptFromJsonFile(
  videoId: string,
  startTime: number,
  endTime: number
): Promise<{
  phrases: any[];
  vocabs: any[];
  grammars: any[];
  bookmarks: any[];
} | null> {
  try {
    // Load caption data from JSON file
    const captionData = await loadCaptionDataFromFile(videoId);
    if (!captionData) {
      throw new Error('Caption file not found');
    }
    
    // Filter segments within the specified time range
    const filteredSegments = captionData.segments.filter(segment => 
      segment.start >= startTime && segment.start <= endTime
    );
    
    // Convert to relative time (starting from 0)
    const relativeSegments = filteredSegments.map(segment => ({
      ...segment,
      start: segment.start - startTime
    }));
    
    // Generate phrases from segments
    const phrases = relativeSegments.map((segment, index) => {
      // Extract potential vocabulary from Chinese text
      const vocabRefs: string[] = [];
      const grammarRefs: string[] = [];
      
      // Simple keyword matching for vocabulary
      const text = segment.text;
      if (text.includes('犯罪')) vocabRefs.push('vc_crime');
      if (text.includes('现场')) vocabRefs.push('vc_scene');
      if (text.includes('游戏')) vocabRefs.push('vc_game');
      if (text.includes('你们')) vocabRefs.push('vc_you');
      if (text.includes('需要')) vocabRefs.push('vc_need');
      if (text.includes('找到')) vocabRefs.push('vc_find');
      if (text.includes('线索')) vocabRefs.push('vc_clue');
      if (text.includes('仔细')) vocabRefs.push('vc_careful');
      if (text.includes('观察')) vocabRefs.push('vc_observe');
      if (text.includes('每个')) vocabRefs.push('vc_each');
      if (text.includes('细节')) vocabRefs.push('vc_detail');
      if (text.includes('然后')) vocabRefs.push('vc_then');
      if (text.includes('推理')) vocabRefs.push('vc_reason');
      if (text.includes('真相')) vocabRefs.push('vc_truth');
      if (text.includes('时间')) vocabRefs.push('vc_time');
      if (text.includes('限制')) vocabRefs.push('vc_limit');
      if (text.includes('十')) vocabRefs.push('vc_ten');
      if (text.includes('分钟')) vocabRefs.push('vc_minute');
      if (text.includes('准备')) vocabRefs.push('vc_prepare');
      if (text.includes('好')) vocabRefs.push('vc_ready');
      
      // Simple grammar pattern matching
      if (text.includes('这是')) grammarRefs.push('gr_这是+名词');
      if (text.includes('一个')) grammarRefs.push('gr_一个+名词');
      if (text.includes('需要') && text.includes('找到')) grammarRefs.push('gr_需要+动词');
      if (text.includes('找到')) grammarRefs.push('gr_找到+宾语');
      if (text.includes('仔细')) grammarRefs.push('gr_仔细+动词');
      if (text.includes('每个')) grammarRefs.push('gr_每一个+名词');
      if (text.includes('然后')) grammarRefs.push('gr_然后+动词');
      if (text.includes('推理出')) grammarRefs.push('gr_推理出+宾语');
      if (text.includes('是') && text.includes('分钟')) grammarRefs.push('gr_是+名词');
      if (text.includes('时间') && text.includes('限制')) grammarRefs.push('gr_时间+限制');
      if (text.includes('准备好了')) grammarRefs.push('gr_准备好了');
      if (text.includes('吗')) grammarRefs.push('gr_吗疑问句');
      
      return {
        id: `ph_${String(index + 1).padStart(3, '0')}`,
        clipId: `clip_${videoId}`,
        tStart: segment.start,
        tEnd: segment.start + segment.duration,
        zh: segment.text,
        pinyin: '', // Would need pinyin conversion service
        ko: '', // Would need translation service
        vocabRefs,
        grammarRefs
      };
    });
    
    // Generate bookmarks for each phrase
    const bookmarks = phrases.map((phrase, index) => ({
      id: `bm_${String(index + 1).padStart(3, '0')}`,
      userId: 'u_001',
      clipId: `clip_${videoId}`,
      t: phrase.tStart + (phrase.tEnd - phrase.tStart) / 2, // Middle of phrase
      note: `자동 생성된 북마크 - ${phrase.zh}`,
      phraseId: phrase.id
    }));
    
    // Get unique vocabulary and grammar IDs
    const allVocabIds = new Set<string>();
    const allGrammarIds = new Set<string>();
    
    phrases.forEach(phrase => {
      phrase.vocabRefs.forEach(id => allVocabIds.add(id));
      phrase.grammarRefs.forEach(id => allGrammarIds.add(id));
    });
    
    return {
      phrases,
      vocabs: Array.from(allVocabIds).map(id => ({ id, name: id })),
      grammars: Array.from(allGrammarIds).map(id => ({ id, name: id })),
      bookmarks
    };
  } catch (error) {
    console.error('Error generating script from JSON file:', error);
    return null;
  }
}
