import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Magic8Ball from './Magic8Ball';

describe('Magic8Ball', () => {
  it('renders all six faces', () => {
    const { container } = render(<Magic8Ball />);
    expect(container.querySelectorAll('.face')).toHaveLength(6);
  });

  it('applies no transform when focus is null', () => {
    const { container } = render(<Magic8Ball />);
    const cube = container.querySelector('#cube');
    expect(cube.style.transform).toBe('');
  });

  it('rotates the cube to match a known focus face', () => {
    const { container } = render(<Magic8Ball focus='face3' />);
    const cube = container.querySelector('#cube');
    expect(cube.style.transform).toBe('rotateX(0deg) rotateY(90deg)');
  });

  it('updates the transform when focus changes', () => {
    const { container, rerender } = render(<Magic8Ball focus='face1' />);
    const cube = container.querySelector('#cube');
    expect(cube.style.transform).toBe('rotateX(0deg) rotateY(0deg)');

    rerender(<Magic8Ball focus='face5' />);
    expect(cube.style.transform).toBe('rotateX(-90deg) rotateY(0deg)');
  });

  it('ignores an unknown focus value', () => {
    const { container, rerender } = render(<Magic8Ball focus='face1' />);
    const cube = container.querySelector('#cube');
    expect(cube.style.transform).toBe('rotateX(0deg) rotateY(0deg)');

    rerender(<Magic8Ball focus='not-a-face' />);
    expect(cube.style.transform).toBe('rotateX(0deg) rotateY(0deg)');
  });
});
