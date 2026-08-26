import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useIsMobile from './useIsMobile';

function mockMatchMedia(matches) {
  const listeners = new Set();
  const mql = {
    matches,
    media: '',
    addEventListener: (event, handler) => listeners.add(handler),
    removeEventListener: (event, handler) => listeners.delete(handler),
    dispatch: (newMatches) => {
      mql.matches = newMatches;
      listeners.forEach((handler) => handler({ matches: newMatches }));
    },
  };
  return mql;
}

describe('useIsMobile', () => {
  let mql;

  beforeEach(() => {
    mql = mockMatchMedia(false);
    vi.stubGlobal('matchMedia', vi.fn(() => mql));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the initial match state', () => {
    mql = mockMatchMedia(true);
    vi.stubGlobal('matchMedia', vi.fn(() => mql));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('updates when the media query change event fires', () => {
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      mql.dispatch(true);
    });

    expect(result.current).toBe(true);
  });

  it('removes the change listener on unmount', () => {
    const { unmount } = renderHook(() => useIsMobile());
    unmount();

    expect(() => mql.dispatch(true)).not.toThrow();
  });

  it('passes the provided query string to matchMedia', () => {
    const matchMediaSpy = vi.fn(() => mql);
    vi.stubGlobal('matchMedia', matchMediaSpy);

    renderHook(() => useIsMobile('(max-width: 500px)'));
    expect(matchMediaSpy).toHaveBeenCalledWith('(max-width: 500px)');
  });
});
