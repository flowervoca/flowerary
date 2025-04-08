'use client';

import { Card, CardContent } from "@/components/ui/card";

const communityPosts = [
  { id: 1, title: '보랏빛 제비꽃', content: '꽃 잘키우는 방법, 팁 알려드립니다.', date: '2025-03-04' },
  { id: 2, title: '프리지아', content: '꽃 잘키우는 방법, 팁 알려드립니다.', date: '2025-03-04' },
  { id: 3, title: '벚꽃', content: '언제 꽃 피는게 제일 예쁜가요?', date: '2025-03-04' },
  { id: 4, title: '비어디드 아이리스', content: '꽃 잘키우는 방법, 팁 알려드립니다.', date: '2025-03-04' },
  { id: 5, title: '수국', content: '살리는 방법 공유 부탁드려요 시급합니다', date: '2025-03-04' },
  { id: 6, title: '무궁화', content: '보통 어디서 피고 볼 수 있나요?', date: '2025-03-04' },
  { id: 7, title: '을릉국화', content: '지금 키우고있는데 생각보다 어렵네요', date: '2025-03-04' },
  { id: 8, title: '진달래', content: '꽃 잘키우는 방법, 팁 알려드립니다.', date: '2025-03-04' },
];

export function FlowerBouquet() {
  return (
    <div className="container mx-auto px-2 py-20">
      <div className="grid grid-cols-12 gap-8">
        {/* 3D 꽃다발 섹션 */}
        <div className="col-span-4 bg-gray-200 rounded-lg aspect-square flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">나만의 3D 꽃다발</h3>
            <div className="w-60 h-60 bg-gray-300 rounded-full mx-auto"></div>
          </div>
        </div>

        {/* 실시간 커뮤니티 */}
        <div className="col-span-8">
          <h2 className="text-xl font-bold mb-4">실시간 커뮤니티</h2>
          <Card className="h-[445px]">
            <CardContent className="p-0 h-full">
              <div className="space-y-2">
                {communityPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between py-2 px-6 border-b last:border-0"
                  >
                    <span className="font-bold text-gray-900 w-[160px]">{post.title}</span>
                    <span className="text-semibold text-gray-600 flex-1 px-4">{post.content}</span>
                    <span className="text-md text-gray-500 w-[100px] text-right">{post.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 