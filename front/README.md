# Flowerary Frontend

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
# macOS (Homebrew)
brew install pnpm

# macOS, Linux (curl)
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

<br/>
<br/>

## 프로젝트 구조

- `src/app/page.tsx` - 홈페이지
- `src/app/...page/(components)/` - 페이지별 관련 컴포넌트
- `src/components/` - 커스텀 컴포넌트
- `src/lib/` - 유틸리티 함수 및 헬퍼
- `public/` - 정적 자산 (이미지, 아이콘 등)

```bash
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
├── assets/             # 이미지, 폰트 등
├── .env.local          # 환경 변수
```

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
```

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

VS Code의 `settings.json`에 다음 설정을 추가하세요
파일 저장 시 자동으로 코드를 포맷팅하고 ESLint 오류를 수정합니다.

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

<br/>
<br/>

## Tailwind Merge (cn 유틸리티) 사용 가이드

이 프로젝트에서는 Tailwind CSS 클래스를 조건부로 적용하거나 병합하기 위해 `cn` 유틸리티 함수를 사용합니다. 이 함수는 `clsx`와 `tailwind-merge` 라이브러리를 결합하여 더 강력한 기능을 제공합니다.

### 기본 개념

- **clsx**: 조건부로 클래스를 결합하는 라이브러리
- **tailwind-merge**: Tailwind CSS 클래스 충돌을 해결해주는 라이브러리
- **cn**: 두 라이브러리를 결합한 유틸리티 함수 (`lib/utils.ts`에 정의됨)

```tsx
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 사용 방법

#### 기본 사용법

```tsx
import { cn } from "@/lib/utils";

// 기본 사용
<div className={cn('text-red-500 p-4')}>기본 텍스트</div>

// 조건부 클래스 적용
<div className={cn(
  'p-4 rounded',
  isActive && 'bg-blue-500 text-white'
)}>
  조건부 스타일
</div>

// 삼항 연산자 사용
<div className={cn(
  'p-4 rounded',
  isActive
    ? 'bg-blue-500 text-white'
    : 'bg-gray-100 text-gray-800'
)}>
  상태에 따라 변경
</div>
```

#### 클래스 오버라이드

`tailwind-merge`의 가장 강력한 기능은 충돌하는 클래스를 자동으로 처리한다는 것입니다:

```tsx
// bg-red-500은 bg-blue-500으로 대체됩니다
<div className={cn('p-4 bg-red-500', 'bg-blue-500')}>
  파란색 배경
</div>

// width 클래스 충돌 해결
<div className={cn('w-4 h-4', 'w-6')}>
  너비는 w-6, 높이는 h-4가 됩니다
</div>
```

#### 컴포넌트에서의 활용

`Button` 컴포넌트는 `cn` 함수를 활용하는 좋은 예시입니다:

```tsx
// src/components/ui/button.tsx 예시
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(
        buttonVariants({ variant, size, className }),
      )}
      {...props}
    />
  );
}
```

이 패턴을 사용하면:

1. 컴포넌트의 기본 스타일을 정의하면서도,
2. 외부에서 전달된 `className`으로 필요한 부분만 오버라이드할 수 있습니다.

### 장점

1. **가독성 향상**: 조건부 스타일을 명확하게 표현할 수 있습니다.
2. **클래스 충돌 해결**: 동일한 속성을 가진 여러 클래스가 있을 때 가장 마지막에 선언된 클래스가 적용됩니다.
3. **코드 간소화**: 복잡한 조건부 클래스 로직을 단순화할 수 있습니다.
4. **컴포넌트 재사용성 향상**: 기본 스타일을 유지하면서도 필요에 따라 커스터마이징이 가능합니다.

### 활용 예시

- 조건부 클래스 적용
- 커스텀 컴포넌트에서의 활용
- 클래스 오버라이드 기능
- 공식 문서: https://github.com/dcastil/tailwind-merge

<br/>
<br/>

## shadcn/ui 컴포넌트 활용 가이드

프로젝트는 [shadcn/ui](https://ui.shadcn.com/)를 사용하여 재사용 가능한 UI 컴포넌트를 구성합니다. shadcn/ui는 Radix UI를 기반으로 하며, 접근성과 커스터마이징이 용이한 컴포넌트 라이브러리입니다.

### 컴포넌트 설치 방법

새로운 shadcn/ui 컴포넌트를 추가하려면 다음 명령어를 사용합니다:

```bash
# 컴포넌트 추가
pnpm dlx shadcn@latest add <컴포넌트명>

# 예시: input 컴포넌트 추가
pnpm dlx shadcn@latest add input

# 여러 컴포넌트 한 번에 추가
pnpm dlx shadcn@latest add button input card avatar
```

### 컴포넌트 구조 이해하기

shadcn/ui 컴포넌트는 `/components/ui` 디렉토리에 저장됩니다. 각 컴포넌트는 다음과 같은 패턴으로 구성됩니다:

#### Input 컴포넌트 예시 (`src/components/ui/input.tsx`)

```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        // 기본 스타일
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // 포커스 상태 스타일
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        // 오류 상태 스타일
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        // 외부에서 전달된 className
        className,
      )}
      {...props}
    />
  );
}

export { Input };
```

shadcn/ui 컴포넌트는:

1. `cn` 유틸리티를 활용하여 Tailwind CSS 클래스를 관리합니다.
2. 외부에서 전달받은 `className`을 통해 쉽게 스타일을 확장할 수 있습니다.
3. 상태에 따른 스타일(포커스, 오류 상태 등)을 명확하게 정의합니다.

### 컴포넌트 사용 방법

#### 기본 사용법

```tsx
import { Input } from '@/components/ui/input';

function MyForm() {
  return (
    <div>
      <Input
        placeholder='이메일을 입력하세요'
        type='email'
      />
      <Input
        type='password'
        placeholder='비밀번호를 입력하세요'
      />
    </div>
  );
}
```

#### 스타일 커스터마이징

```tsx
import { Input } from '@/components/ui/input';

function CustomizedInputs() {
  return (
    <div className='space-y-4'>
      {/* 기본 Input */}
      <Input placeholder='기본 입력 필드' />

      {/* 커스텀 스타일 적용 */}
      <Input
        placeholder='커스텀 입력 필드'
        className='border-blue-500 focus-visible:ring-blue-500/50'
      />

      {/* 오류 상태 표시 */}
      <Input
        placeholder='오류 있는 필드'
        aria-invalid='true'
      />
    </div>
  );
}
```

#### 폼 라이브러리와 함께 사용하기

```tsx
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4'
    >
      <div>
        <label htmlFor='email'>이메일</label>
        <Input
          id='email'
          {...register('email', { required: true })}
        />
      </div>
      <div>
        <label htmlFor='password'>비밀번호</label>
        <Input
          id='password'
          type='password'
          {...register('password', { required: true })}
        />
      </div>
      <Button type='submit'>로그인</Button>
    </form>
  );
}
```

### 컴포넌트 커스터마이징

shadcn/ui 컴포넌트는 소스 코드가 프로젝트에 직접 복사되므로, 필요에 따라 자유롭게 수정할 수 있습니다:

1. **기본 스타일 변경**: 컴포넌트 파일의 `className` 값을 직접 수정합니다.
2. **변형 추가**: 컴포넌트에 새로운 변형(variant)이나 크기(size)를 추가할 수 있습니다.
3. **기능 확장**: 컴포넌트에 새로운 기능이나 속성을 추가할 수 있습니다.

```tsx
// Input 컴포넌트 확장 예시
function EnhancedInput({
  hasIcon,
  icon,
  className,
  ...props
}: React.ComponentProps<'input'> & {
  hasIcon?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className='relative'>
      {hasIcon && (
        <div className='absolute left-3 top-1/2 -translate-y-1/2'>
          {icon}
        </div>
      )}
      <Input
        className={cn(hasIcon && 'pl-10', className)}
        {...props}
      />
    </div>
  );
}
```

### 추가 자료

- [shadcn/ui 공식 문서](https://ui.shadcn.com/)
- [Radix UI 공식 문서](https://www.radix-ui.com/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/docs)
- [Tailwind Merge GitHub](https://github.com/dcastil/tailwind-merge)

## Tailwind Merge (cn 유틸리티) 사용 가이드

이 프로젝트에서는 Tailwind CSS 클래스를 조건부로 적용하거나 병합하기 위해 `cn` 유틸리티 함수를 사용합니다. 이 함수는 `clsx`와 `tailwind-merge` 라이브러리를 결합하여 더 강력한 기능을 제공합니다.

### 활용 예시

이 프로젝트의 `/cn-example` 페이지에서 다양한 활용 사례를 확인할 수 있습니다:

- 조건부 클래스 적용
- 커스텀 컴포넌트에서의 활용
- 클래스 오버라이드 기능
