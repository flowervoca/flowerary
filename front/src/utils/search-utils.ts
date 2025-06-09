/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0',
  );
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * 꽃말 문자열에서 태그 배열 추출
 */
export const extractTagsFromFlowerLang = (
  flowerLang: string,
): string[] => {
  if (!flowerLang || typeof flowerLang !== 'string') {
    return [];
  }
  return flowerLang
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
};

/**
 * 꽃 목록에서 고유한 태그들 추출
 */
export const extractUniqueTagsFromFlowers = (
  flowers: any[],
): string[] => {
  const allTags = flowers.flatMap((flower) =>
    extractTagsFromFlowerLang(flower.f_low_lang),
  );
  return [...new Set(allTags)];
};
