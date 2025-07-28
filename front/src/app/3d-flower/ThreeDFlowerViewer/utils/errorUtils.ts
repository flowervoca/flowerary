/**
 * 에러 처리 및 복구 관련 유틸리티 함수들
 */

/**
 * 에러 타입 정의
 */
export enum ErrorType {
  MODEL_LOAD_ERROR = 'MODEL_LOAD_ERROR',
  COLOR_APPLICATION_ERROR = 'COLOR_APPLICATION_ERROR',
  SCENE_SETUP_ERROR = 'SCENE_SETUP_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * 에러 정보 인터페이스
 */
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: Error;
  context?: Record<string, any>;
  timestamp: number;
}

/**
 * 에러 생성 함수
 * @param type - 에러 타입
 * @param message - 에러 메시지
 * @param originalError - 원본 에러 객체
 * @param context - 추가 컨텍스트 정보
 * @returns ErrorInfo 객체
 */
export const createError = (
  type: ErrorType,
  message: string,
  originalError?: Error,
  context?: Record<string, any>,
): ErrorInfo => {
  return {
    type,
    message,
    originalError,
    context,
    timestamp: Date.now(),
  };
};

/**
 * 안전한 함수 실행 유틸리티
 * @param fn - 실행할 함수
 * @param fallback - 에러 발생 시 반환할 기본값
 * @param errorType - 에러 타입
 * @returns 함수 실행 결과 또는 기본값
 */
export const safeExecute = <T>(
  fn: () => T,
  fallback: T,
  errorType: ErrorType = ErrorType.UNKNOWN_ERROR,
): T => {
  try {
    return fn();
  } catch (error) {
    console.warn(
      `Safe execution failed (${errorType}):`,
      error instanceof Error ? error.message : error,
    );
    return fallback;
  }
};

/**
 * 비동기 함수 안전 실행 유틸리티
 * @param fn - 실행할 비동기 함수
 * @param fallback - 에러 발생 시 반환할 기본값
 * @param errorType - 에러 타입
 * @returns Promise<함수 실행 결과 또는 기본값>
 */
export const safeExecuteAsync = async <T>(
  fn: () => Promise<T>,
  fallback: T,
  errorType: ErrorType = ErrorType.UNKNOWN_ERROR,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.warn(
      `Safe async execution failed (${errorType}):`,
      error instanceof Error ? error.message : error,
    );
    return fallback;
  }
};

/**
 * 재시도 가능한 함수 실행 유틸리티
 * @param fn - 실행할 함수
 * @param maxRetries - 최대 재시도 횟수
 * @param retryDelay - 재시도 간격 (ms)
 * @param errorType - 에러 타입
 * @returns Promise<함수 실행 결과>
 */
export const executeWithRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000,
  errorType: ErrorType = ErrorType.UNKNOWN_ERROR,
): Promise<T | null> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error(String(error));

      if (attempt < maxRetries) {
        console.warn(
          `Attempt ${attempt + 1} failed (${errorType}), retrying in ${retryDelay}ms...`,
          lastError.message,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay),
        );
      }
    }
  }

  console.error(
    `All ${maxRetries + 1} attempts failed (${errorType}):`,
    lastError?.message,
  );
  return null;
};

/**
 * 에러 복구 전략 인터페이스
 */
export interface RecoveryStrategy<T> {
  canRecover: (error: ErrorInfo) => boolean;
  recover: (error: ErrorInfo) => Promise<T | null>;
}

/**
 * 에러 복구 매니저 클래스
 */
export class ErrorRecoveryManager<T> {
  private strategies: RecoveryStrategy<T>[] = [];

  /**
   * 복구 전략 추가
   * @param strategy - 복구 전략
   */
  addStrategy(strategy: RecoveryStrategy<T>): void {
    this.strategies.push(strategy);
  }

  /**
   * 에러 복구 시도
   * @param error - 에러 정보
   * @returns 복구 결과 또는 null
   */
  async attemptRecovery(
    error: ErrorInfo,
  ): Promise<T | null> {
    for (const strategy of this.strategies) {
      if (strategy.canRecover(error)) {
        try {
          const result = await strategy.recover(error);
          if (result !== null) {
            return result;
          }
        } catch (recoveryError) {
          console.warn(
            'Recovery strategy failed:',
            recoveryError instanceof Error
              ? recoveryError.message
              : recoveryError,
          );
        }
      }
    }
    return null;
  }
}

/**
 * 기본 모델 로딩 복구 전략
 */
export const createModelLoadingRecoveryStrategy =
  (): RecoveryStrategy<string> => ({
    canRecover: (error: ErrorInfo) =>
      error.type === ErrorType.MODEL_LOAD_ERROR,
    recover: async (error: ErrorInfo) => {
      // 기본 모델 경로 반환 또는 캐시된 모델 사용 등의 복구 로직
      console.log(
        'Attempting to recover from model loading error...',
      );
      return null; // 실제 구현에서는 복구 로직 추가
    },
  });

/**
 * 기본 색상 적용 복구 전략
 */
export const createColorApplicationRecoveryStrategy =
  (): RecoveryStrategy<boolean> => ({
    canRecover: (error: ErrorInfo) =>
      error.type === ErrorType.COLOR_APPLICATION_ERROR,
    recover: async (error: ErrorInfo) => {
      // 기본 색상 적용 또는 재시도 로직
      console.log(
        'Attempting to recover from color application error...',
      );
      return false; // 실제 구현에서는 복구 로직 추가
    },
  });
