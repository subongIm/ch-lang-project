'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/shared/stores/userStore';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [displayUser, setDisplayUser] = useState<any>(null);
  
  // 로그인 상태를 더 안전하게 확인
  const isLoggedIn = isAuthenticated || !!user;
  
  // 디버깅을 위한 로그
  console.log('ProfilePage render:', { isAuthenticated, user, isLoggedIn });

  useEffect(() => {
    // 로그인된 사용자 정보가 있으면 사용하고, 없으면 임의의 사용자 정보 생성
    if (isLoggedIn && user) {
      setDisplayUser(user);
    } else {
      // 임의의 사용자 정보 생성
      const mockUser = {
        id: 'mock_user_1',
        username: 'demo_user',
        email: 'demo@example.com',
        isAdmin: false,
        createdAt: new Date().toISOString(),
        joinDate: new Date().toISOString()
      };
      setDisplayUser(mockUser);
    }
    setIsLoading(false);
  }, [isLoggedIn, user]);

  const handleLogout = () => {
    if (isAuthenticated) {
      logout();
    }
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-h1 font-bold text-text-primary mb-8">프로필</h1>
          
          <Panel>
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👤</span>
                </div>
                <h2 className="text-h2 font-semibold text-text-primary">
                  {isLoggedIn && user ? user.username : (displayUser?.username || '사용자')}
                </h2>
                <p className="text-text-secondary">
                  {isLoggedIn && user ? (user.isAdmin ? '관리자' : '일반 사용자') : (displayUser?.isAdmin ? '관리자' : '일반 사용자')}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-text-secondary font-medium">사용자명</span>
                  <span className="text-text-primary font-semibold">
                    {isLoggedIn && user ? user.username : (displayUser?.username || 'demo_user')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-text-secondary font-medium">이메일</span>
                  <span className="text-text-primary font-semibold">
                    {isLoggedIn && user ? user.email : (displayUser?.email || 'demo@example.com')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-text-secondary font-medium">계정 유형</span>
                  <span className="text-text-primary font-semibold">
                    {isLoggedIn && user ? (user.isAdmin ? '관리자' : '일반 사용자') : (displayUser?.isAdmin ? '관리자' : '일반 사용자')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-text-secondary font-medium">가입일</span>
                  <span className="text-text-primary font-semibold">
                    {isLoggedIn && user ? 
                      new Date(user.joinDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 
                      (displayUser?.joinDate ? new Date(displayUser.joinDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : new Date().toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }))
                    }
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => window.location.href = '/library'}
                  variant="secondary"
                  className="flex-1"
                >
                  라이브러리로 이동
                </Button>
                {isLoggedIn && (
                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    className="flex-1"
                  >
                    로그아웃
                  </Button>
                )}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
