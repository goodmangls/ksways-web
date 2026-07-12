// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HtmlLangSync } from './HtmlLangSync';

describe('HtmlLangSync', () => {
  afterEach(cleanup);

  it('sets ko-KR on the document element for the kr locale', () => {
    render(<HtmlLangSync locale="kr" />);

    expect(document.documentElement.lang).toBe('ko-KR');
  });

  it('sets en for the en locale', () => {
    render(<HtmlLangSync locale="en" />);

    expect(document.documentElement.lang).toBe('en');
  });
});
