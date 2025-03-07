# Flowerary

### `🌼Flower` + `📚Library`

꽃말 정보와 함께 큐레이션을 제공하는 꽃 도서관

## 기술 스택

- [Next.js](https://nextjs.org/) - React 프레임워크
- [TypeScript](https://www.typescriptlang.org/) - 정적 타입 지원
- [Tailwind CSS](https://tailwindcss.com/) - 유틸리티 기반 CSS 프레임워크
- [shadcn/ui](https://ui.shadcn.com/) - 재사용 가능한 UI 컴포넌트
- [pnpm](https://pnpm.io/ko/) - 빠르고 디스크 공간 효율적인 패키지 매니저

## 시작하기

### 패키지 매니저 설치

이 프로젝트는 pnpm을 패키지 매니저로 사용합니다. 다음 명령어로 설치하세요:

```bash
# macOS, Linux, WSL
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Windows (PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## shadcn/ui 컴포넌트 사용하기

이 프로젝트는 [shadcn/ui](https://ui.shadcn.com/)를 사용하여 UI 컴포넌트를 구성합니다.

### 새 컴포넌트 추가하기

```bash
# 컴포넌트 추가 (예: dialog, dropdown-menu)
pnpm dlx shadcn@latest add dialog dropdown-menu

# 여러 컴포넌트 한 번에 추가
pnpm dlx shadcn@latest add button card avatar
```

### 컴포넌트 사용 예시

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// 버튼 사용 예시
<Button onClick={() => toast("안녕하세요!")}>토스트 표시</Button>

// 카드 사용 예시
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>
    <p>내용</p>
  </CardContent>
</Card>

// 토스트 사용 예시 (레이아웃에 추가)
<Toaster />
```

## 프로젝트 구조

- `src/app/page.tsx` - 홈페이지
- `src/app/...page/(components)/` - 페이지별 관련 컴포넌트
- `src/components/` - 커스텀 컴포넌트
- `src/lib/` - 유틸리티 함수 및 헬퍼
- `public/` - 정적 자산 (이미지, 아이콘 등)

````bash
public/
src/
├── app/ # Next.js App Router 기반 라우팅
│ ├── (main)/ # 메인 라우트 그룹
│ │ ├── page.tsx # 홈페이지
│ │ ├── layout.tsx # 메인 레이아웃
│ │ ├── (components)/ # 홈페이지 관련 컴포넌트
│ │ │ ├── main-banner.tsx
│ │ │ ├── curation-section.tsx
│ │ │ ├── popular-keywords.tsx
│ │ │ └── flower-care-tips.tsx
│ │ │
│ │ ├── search/ # 꽃 검색 페이지
│ │ │ ├── page.tsx
│ │ │ ├── loading.tsx
│ │ │ ├── (components)/
│ │ │ │ ├── search-input.tsx
│ │ │ │ ├── search-results.tsx
│ │ │ │ ├── emotion-filter.tsx
│ │ │ │ └── recent-searches.tsx
│ │ │ └── [keyword]/ # 검색 결과 페이지
│ │ │ ├── page.tsx
│ │ │ └── (components)/
│ │ │ └── result-list.tsx
│ │ │
│ │ ├── flowers/ # 꽃 상세 정보 페이지
│ │ │ ├── page.tsx # 꽃 목록 페이지
│ │ │ ├── (components)/
│ │ │ │ ├── flower-grid.tsx
│ │ │ │ └── filter-section.tsx
│ │ │ └── [id]/ # 개별 꽃 상세 페이지
│ │ │ ├── page.tsx
│ │ │ └── (components)/
│ │ │ ├── flower-detail.tsx
│ │ │ ├── flower-care.tsx
│ │ │ └── related-flowers.tsx
│ │ │
│ │ ├── bouquet-maker/ # 꽃다발 제작 페이지
│ │ │ ├── page.tsx
│ │ │ └── (components)/
│ │ │ ├── bouquet-canvas.tsx
│ │ │ ├── flower-selector.tsx
│ │ │ ├── bouquet-preview.tsx
│ │ │ └── share-card.tsx
│ │ │
│ │ └── columns/ # 플로리스트 칼럼 페이지
│ │ ├── page.tsx # 칼럼 목록
│ │ ├── (components)/
│ │ │ ├── column-grid.tsx
│ │ │ └── category-filter.tsx
│ │ └── [id]/ # 개별 칼럼 상세
│ │ ├── page.tsx
│ │ └── (components)/
│ │ └── column-content.tsx
│ │
│ └── api/ # API 라우트 핸들러
│
├── components/         # 공통/재사용 컴포넌트
│ ├── ui/               # shadcn/ui 컴포넌트
│ ├── common/           # 공통 레이아웃 컴포넌트
│ └── shared/           # 여러 페이지에서 재사용되는 컴포넌트
├── hooks/              # 커스텀 훅
├── lib/                # 유틸리티 함수 및 헬퍼
├── types/              # 타입 정의
├── utils/              # 유틸리티 함수
├── config/             # 설정 파일
├── store/              # 상태 관리 (Zustand)
├── .env.local          # 환경 변수

## 코드 스타일 가이드

이 프로젝트는 일관된 코드 스타일을 유지하기 위해 ESLint와 Prettier를 사용합니다.

### ESLint & Prettier 설정

프로젝트는 Airbnb의 코드 스타일 가이드를 기반으로 하며, TypeScript와 React 관련 규칙이 포함되어 있습니다.

#### 주요 ESLint 설정

```json
{
  "extends": [
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-unused-vars": ["error"]
  }
}
````

#### Prettier 설정

```json
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "all",
  "jsxSingleQuote": true,
  "bracketSpacing": true
}
```

### 코드 품질 관리 명령어

```bash
# 린트 검사 실행
pnpm lint

# 린트 오류 자동 수정
pnpm lint:fix

# 코드 포맷팅
pnpm format
```

### VS Code 설정

VS Code의 `settings.json`에 다음 설정을 추가하세요:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

이 설정은 파일 저장 시 자동으로 코드를 포맷팅하고 ESLint 오류를 수정합니다.
