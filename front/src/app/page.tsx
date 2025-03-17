'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export default function Home() {
  return (
    <div className='min-h-screen dark:from-gray-900 dark:to-gray-800'>
      <Toaster />
      <main className='container mx-auto min-h-screen px-4 py-16'>
        <div className='flex flex-col items-center justify-center text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-800 dark:text-white mb-4'>
            Flowerary
          </h1>
          <p className='text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8'>
            🌼 꽃말 정보와 함께 큐레이션을 제공하는 꽃
            도서관 📚
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full mt-12'>
            {/* 꽃 카테고리 카드 */}
            <Card>
              <CardHeader className='text-center'>
                <div className='w-24 h-24 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mb-4 mx-auto'>
                  <span className='text-4xl'>🌸</span>
                </div>
                <CardTitle>계절별 꽃 추천</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 dark:text-gray-300 text-center'>
                  사계절에 따라 피는 다양한 꽃들을
                  만나보세요.
                </p>
              </CardContent>
              <CardFooter className='flex justify-center'>
                <Button
                  variant='outline'
                  onClick={() =>
                    toast(
                      '계절별 꽃 페이지는 준비 중입니다.',
                    )
                  }
                >
                  자세히 보기
                </Button>
              </CardFooter>
            </Card>

            {/* 꽃말 카드 */}
            <Card>
              <CardHeader className='text-center'>
                <div className='w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4 mx-auto'>
                  <span className='text-4xl'>💬</span>
                </div>
                <CardTitle>꽃말 사전</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 dark:text-gray-300 text-center'>
                  각 꽃이 가진 특별한 의미와 이야기를
                  알아보세요.
                </p>
              </CardContent>
              <CardFooter className='flex justify-center'>
                <Button
                  variant='outline'
                  onClick={() =>
                    toast(
                      '꽃말 사전 페이지는 준비 중입니다.',
                    )
                  }
                >
                  자세히 보기
                </Button>
              </CardFooter>
            </Card>

            {/* 큐레이션 카드 */}
            <Card>
              <CardHeader className='text-center'>
                <div className='w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4 mx-auto'>
                  <span className='text-4xl'>🎁</span>
                </div>
                <CardTitle>꽃 큐레이션</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 dark:text-gray-300 text-center'>
                  특별한 날에 어울리는 꽃 추천을 받아보세요.
                </p>
              </CardContent>
              <CardFooter className='flex justify-center'>
                <Button
                  variant='outline'
                  onClick={() =>
                    toast(
                      '꽃 큐레이션 페이지는 준비 중입니다.',
                    )
                  }
                >
                  자세히 보기
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className='mt-16'>
            <Button
              size='lg'
              onClick={() =>
                toast(
                  '환영합니다! Flowerary에 오신 것을 환영합니다.',
                )
              }
            >
              시작하기
            </Button>
          </div>
        </div>
      </main>

      <footer className='bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800'>
        <div className='container mx-auto px-4 text-center text-gray-600 dark:text-gray-400'>
          <p>© 2025 Flowerary</p>
        </div>
      </footer>
    </div>
  );
}
