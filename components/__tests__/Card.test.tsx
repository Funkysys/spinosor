import { render, screen } from '@testing-library/react';
import Card from '../Card';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <div data-testid="mock-image" {...props} />;
  },
}));

describe('Card Component', () => {
  const mockProps = {
    id: '1',
    name: 'Test Artist',
    imageUrl: '/test-image.jpg',
    bio: 'This is a test description',
    genre: 'Rock',
    events: []
  };

  it('renders card with correct artist name', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
  });

  it('renders card with correct genre', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText(mockProps.genre)).toBeInTheDocument();
  });

  it('renders card image with correct alt text', () => {
    render(<Card id="1"  events={[]}  name="Test Artist" imageUrl="/test-image.jpg" />);
    const image = screen.getByTestId('mock-image');
    expect(image).toHaveAttribute('alt', 'image du projet Test Artist');
  });
});
