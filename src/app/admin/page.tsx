'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '../../shared/stores/adminStore';
import { Panel } from '../../shared/ui/Panel';
import { Button } from '../../shared/ui/Button';
import { VideoAndScriptUploadForm } from '../../features/admin/components/VideoAndScriptUploadForm';
import { AdminLibraryManager } from '../../features/admin/components/AdminLibraryManager';

export default function AdminPage() {
  const { adminUser, isAuthenticated, logout } = useAdminStore();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    // 관리자 권한이 없으면 로그인 페이지로 리다이렉트
    if (!isAuthenticated || !adminUser?.isAdmin) {
      router.push('/login');
      return;
    }
  }, [isAuthenticated, adminUser, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleScriptUploaded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowUploadForm(false);
  };

  if (!isAuthenticated || !adminUser?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-page-bg-from to-page-bg-to flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-2"></div>
          <p className="text-body text-text-secondary">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-page-bg-from to-page-bg-to">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h1 text-text-primary">관리자 페이지</h1>
              <p className="text-body text-text-secondary">
                안녕하세요, {adminUser.username}님
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowUploadForm(!showUploadForm)}
                variant="secondary"
                className={showUploadForm ? 'bg-brand-primary text-white' : ''}
              >
                {showUploadForm ? '목록으로' : '영상 & 스크립트 등록'}
              </Button>
              <Button
                onClick={() => router.push('/library')}
                variant="secondary"
              >
                사용자 페이지로
              </Button>
              <Button
                onClick={handleLogout}
                variant="secondary"
              >
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Main Content */}
        <div className="space-y-6">
          {showUploadForm ? (
            <div>
              <div className="mb-6">
                <h2 className="text-h2 text-text-primary mb-2">영상 & 스크립트 등록</h2>
                <p className="text-body text-text-secondary">
                  새로운 학습 영상과 스크립트를 등록하여 사용자들이 학습할 수 있도록 합니다.
                </p>
              </div>
              <VideoAndScriptUploadForm 
                onUploadComplete={handleUploadComplete}
                onNavigateToVideos={() => setShowUploadForm(false)}
              />
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h2 className="text-h2 text-text-primary mb-2">영상 관리</h2>
                <p className="text-body text-text-secondary">
                  등록된 영상들을 관리하고 삭제할 수 있습니다. 사용자 페이지와 동기화됩니다.
                </p>
              </div>
              <AdminLibraryManager 
                onAfterChange={() => setRefreshTrigger(v => v + 1)} 
                refreshTrigger={refreshTrigger}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
