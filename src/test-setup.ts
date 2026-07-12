import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom은 scrollIntoView를 구현하지 않는다 (QuoteForm 검증 실패 시 포커스 이동에서 사용).
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
