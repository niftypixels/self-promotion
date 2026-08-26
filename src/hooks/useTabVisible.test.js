import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useTabVisible from './useTabVisible';

function setHidden(hidden) {
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    get: () => hidden,
  });
}

describe('useTabVisible', () => {
  afterEach(() => {
    setHidden(false);
  });

  it('returns true when the document is visible', () => {
    setHidden(false);
    const { result } = renderHook(() => useTabVisible());
    expect(result.current).toBe(true);
  });

  it('returns false when the document is hidden on mount', () => {
    setHidden(true);
    const { result } = renderHook(() => useTabVisible());
    expect(result.current).toBe(false);
  });

  it('updates state when a visibilitychange event fires', () => {
    setHidden(false);
    const { result } = renderHook(() => useTabVisible());
    expect(result.current).toBe(true);

    act(() => {
      setHidden(true);
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe(false);
  });

  it('removes the visibilitychange listener on unmount', () => {
    const { unmount } = renderHook(() => useTabVisible());
    unmount();

    expect(() => {
      setHidden(true);
      document.dispatchEvent(new Event('visibilitychange'));
    }).not.toThrow();
  });
});
