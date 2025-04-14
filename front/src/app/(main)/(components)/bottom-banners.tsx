'use client';

import { Card } from "@/components/ui/card";

export function BottomBanners() {
  return (
    <div className="container mx-auto px- py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 첫 번째 배너 */}
        <Card className="aspect-[4/1] flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-700">광고 배너1</h3>
          </div>
        </Card>

        {/* 두 번째 배너 */}
        <Card className="aspect-[4/1] flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
          <div className="text-center">
            <h3 className="text-xl font-medium text-gray-700">광고 배너2</h3>
          </div>
        </Card>
      </div>
    </div>
  );
} 