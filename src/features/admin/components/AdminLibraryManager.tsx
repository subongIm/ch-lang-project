import React, { useEffect, useState } from 'react';
import { Panel } from '../../../shared/ui/Panel';
import { Button } from '../../../shared/ui/Button';
import { getClips, Clip } from '../../../shared/api/mockData';

interface AdminLibraryManagerProps {
  onAfterChange?: () => void;
  refreshTrigger?: number;
}

export const AdminLibraryManager: React.FC<AdminLibraryManagerProps> = ({ onAfterChange, refreshTrigger }) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showRestoreMode, setShowRestoreMode] = useState(false);

  const load = () => {
    const data = getClips();
    setClips(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [refreshTrigger]);

  const toggle = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  const selectAll = () => setSelected(new Set(clips.map(c => c.id)));
  const clearAll = () => setSelected(new Set());

  const bulkDelete = () => {
    if (selected.size === 0) return;
    if (!confirm(`선택한 ${selected.size}개 항목을 삭제할까요?`)) return;

    // 선택된 클립들
    const selectedClips = clips.filter(clip => selected.has(clip.id));
    
    // admin 저장소에서 삭제
    const adminVideos = JSON.parse(localStorage.getItem('adminVideos') || '[]');
    const adminScripts = JSON.parse(localStorage.getItem('adminScripts') || '[]');
    
    // 삭제된 클립 ID들
    const deletedClipIds = selectedClips.map(clip => clip.id);
    
    // adminVideos에서 삭제
    const remainVideos = adminVideos.filter((v: any) => !deletedClipIds.includes(v.id));
    const removedVideos = adminVideos.filter((v: any) => deletedClipIds.includes(v.id));
    const removedVideoIds = removedVideos.map((v: any) => v.videoId);
    
    // adminScripts에서도 삭제
    const remainScripts = adminScripts.filter((s: any) => !removedVideoIds.includes(s.videoId));
    
    // localStorage 업데이트
    localStorage.setItem('adminVideos', JSON.stringify(remainVideos));
    localStorage.setItem('adminScripts', JSON.stringify(remainScripts));
    
    // 삭제된 클립들을 localStorage에 저장 (복원용)
    const deletedClips = JSON.parse(localStorage.getItem('deletedClips') || '[]');
    const newDeletedClips = [...deletedClips, ...selectedClips];
    localStorage.setItem('deletedClips', JSON.stringify(newDeletedClips));

    console.log('Deleted clips:', selectedClips);
    console.log('Remaining admin videos:', remainVideos);

    setSelected(new Set());
    setIsDeleteMode(false);
    load();
    onAfterChange?.();
  };

  const restoreDeletedClips = () => {
    localStorage.removeItem('deletedClips');
    setShowRestoreMode(false);
    load();
    onAfterChange?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
      </div>
    );
  }

  return (
    <Panel title="영상 관리" subtitle="등록된 영상 목록 및 관리 (사용자 페이지와 동기화)">
      <div className="flex items-center justify-between mb-4">
        <div className="text-body text-text-secondary">총 {clips.length}개</div>
        <div className="flex items-center space-x-2">
          {!isDeleteMode ? (
            <>
              <Button variant="secondary" onClick={load}>새로고침</Button>
              <Button variant="secondary" onClick={() => setIsDeleteMode(true)}>삭제 모드</Button>
              <Button variant="secondary" onClick={() => setShowRestoreMode(!showRestoreMode)}>
                {showRestoreMode ? '목록 숨기기' : '삭제된 항목 보기'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={selectAll}>전체 선택</Button>
              <Button variant="secondary" onClick={clearAll}>선택 해제</Button>
              <Button variant="secondary" onClick={bulkDelete} disabled={selected.size===0} className="text-red-600 hover:bg-red-50">선택 삭제 ({selected.size})</Button>
              <Button variant="secondary" onClick={() => { setIsDeleteMode(false); setSelected(new Set()); }}>취소</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        {clips.map(clip => {
          const isSel = selected.has(clip.id);
          const isAdminClip = clip.createdBy === 'admin';
          const canDelete = isDeleteMode;
          
          return (
            <div key={clip.id} className={`flex items-center space-x-3 p-3 border border-border rounded-sm ${canDelete ? 'cursor-pointer' : ''} ${isSel ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`} onClick={canDelete ? () => toggle(clip.id) : undefined}>
              {isDeleteMode && (
                <input 
                  type="checkbox" 
                  checked={isSel} 
                  onChange={() => toggle(clip.id)} 
                  className="w-4 h-4" 
                />
              )}
              <img src={clip.thumbnail} alt={clip.title} className="w-24 h-16 object-cover rounded-sm border" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="text-body font-medium text-text-primary truncate">{clip.title}</div>
                  {isAdminClip ? (
                    <span className="bg-green-100 text-green-800 border border-green-200 rounded-md px-1.5 py-0.5 text-label">
                      관리자 등록
                    </span>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 border border-blue-200 rounded-md px-1.5 py-0.5 text-label">
                      기본 데이터
                    </span>
                  )}
                </div>
                <div className="text-caption text-text-secondary">{clip.source.type.toUpperCase()} • {clip.source.videoId}</div>
              </div>
              <div className="text-caption text-text-secondary">{Math.floor(clip.duration/60)}:{(clip.duration%60).toString().padStart(2,'0')}</div>
            </div>
          );
        })}
      </div>

      {/* 삭제된 항목 복원 섹션 */}
      {showRestoreMode && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-body font-medium text-text-primary">삭제된 항목</h3>
            <Button variant="secondary" onClick={restoreDeletedClips} className="text-green-600 hover:bg-green-50">
              모두 복원
            </Button>
          </div>
          <p className="text-caption text-text-secondary mb-3">
            삭제된 항목들을 복원할 수 있습니다. "모두 복원" 버튼을 클릭하면 모든 삭제된 항목이 다시 표시됩니다.
          </p>
        </div>
      )}
    </Panel>
  );
};
