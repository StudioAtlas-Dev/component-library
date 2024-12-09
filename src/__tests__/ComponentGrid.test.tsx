import { render, screen } from '@testing-library/react';
import ComponentGrid from '@/components/ComponentGrid';

describe('ComponentGrid', () => {
  const mockComponents = [
    {
      name: 'Test Component',
      path: 'test-component',
      type: 'Section Component',
      tags: ['test', 'mock'],
    }
  ];

  it('renders component cards correctly', () => {
    render(<ComponentGrid components={mockComponents} />);
    
    // Check if component name is rendered
    expect(screen.getByText('Test Component')).toBeInTheDocument();
    
    // Check if component type is rendered
    expect(screen.getByText('Section Component')).toBeInTheDocument();
    
    // Check if tags are rendered
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('mock')).toBeInTheDocument();
    
    // Check if the link is present with correct href
    const link = screen.getByRole('gridcell');
    expect(link).toHaveAttribute('href', '/components/test-component');
    
    // Check if image is present with correct alt text
    const image = screen.getByAltText('Preview of Test Component component');
    expect(image).toBeInTheDocument();
  });

  it('renders empty grid when no components provided', () => {
    render(<ComponentGrid components={[]} />);
    const grid = screen.getByRole('grid');
    expect(grid).toBeEmptyDOMElement();
  });
}); 