'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '../../shared/stores/adminStore';
import { useUserStore } from '../../shared/stores/userStore';
import { Panel } from '../../shared/ui/Panel';
import { Input } from '../../shared/ui/Input';
import { Button } from '../../shared/ui/Button';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login: adminLogin, isAuthenticated: isAdminAuthenticated, adminUser } = useAdminStore();
  const { login: userLogin, isAuthenticated: isUserAuthenticated, currentUser } = useUserStore();
  const router = useRouter();
  
  // 이미 로그인되어 있으면 자동 이동
  useEffect(() => {
    if (isAdminAuthenticated && adminUser?.isAdmin) {
      router.replace('/admin');
    } else if (isUserAuthenticated && currentUser) {
      router.replace('/library');
    }
  }, [isAdminAuthenticated, isUserAuthenticated, adminUser, currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 간단한 지연을 추가하여 로딩 상태를 보여줌
    await new Promise(resolve => setTimeout(resolve, 500));

    // 관리자 계정 확인
    if (username === 'admin' && password === 'admin1234!') {
      const success = adminLogin(username, password);
      if (success) {
        router.push('/admin');
        return;
      }
    }

    // 일반 사용자 계정 확인 (간단한 데모용)
    if (username === 'user' && password === 'user123') {
      const success = userLogin(username, password);
      if (success) {
        router.push('/library');
        return;
      }
    }

    setError('잘못된 사용자명 또는 비밀번호입니다.');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-page-bg-from to-page-bg-to flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Panel className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-h1 text-text-primary mb-2">로그인</h1>
            <p className="text-body text-text-secondary">
              계정으로 로그인하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-label font-medium text-text-primary mb-2">
                사용자명
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="사용자명을 입력하세요"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-label font-medium text-text-primary mb-2">
                비밀번호
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-sm p-3">
                <p className="text-body text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-caption text-text-secondary mb-2">
              테스트 계정:
            </p>
            <div className="space-y-1 text-caption text-text-secondary">
              <p>관리자: admin / admin1234!</p>
              <p>사용자: user / user123</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
