import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArtistList from '../ArtistList';
import { ArtistWithAlbums } from '@/types';
import { deleteAlbum } from '@/app/api/action/albums/albums';

// Mock next/dynamic
jest.mock('next/dynamic', () => () => {
  return function DynamicComponent() {
    return <div data-testid="mock-quill">Mock Quill Editor</div>;
  };
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock react-quill
jest.mock('react-quill', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-quill">Mock Quill Editor</div>,
}));

// Mock AlbumCreation
jest.mock('../AlbumCreation', () => ({
  __esModule: true,
  default: ({ artistId }: { artistId: string }) => {
    return <div data-testid={`mock-album-creation-${artistId}`}>Mock Album Creation</div>;
  },
}));

// Mock AlbumUpdate
jest.mock('../AlbumUpdate', () => ({
  __esModule: true,
  default: ({ albumData }: { albumData: any }) => (
    <div data-testid={`mock-album-update-${albumData.id}`}>
      <div>{albumData.title}</div>
    </div>
  ),
}));

// Mock deleteAlbum
jest.mock('@/app/api/action/albums/albums', () => ({
  deleteAlbum: jest.fn(),
}));

describe('ArtistList Component', () => {
  const mockArtist: ArtistWithAlbums = {
    id: '1',
    name: 'Test Artist',
    imageUrl: '/test-image.jpg',
    bio: 'Test bio',
    genre: 'Rock',
    videoUrl: null,
    codePlayer: null,
    urlPlayer: null,
    socialLinks: [],
    events: [],
    albums: [
      {
        id: '1',
        title: 'Test Album',
        imageUrl: '/test-album.jpg',
        releaseDate: new Date('2024-01-01'),
        artistId: '1',
        links: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockProps = {
    artist: mockArtist,
    onDelete: jest.fn(),
    onUpdate: jest.fn(),
    updateAlbum: jest.fn(),
    createAlbum: jest.fn(),
    getArtists: jest.fn().mockResolvedValue([mockArtist]),
    setArtists: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders artist information correctly', () => {
    render(<ArtistList {...mockProps} />);
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Genre : Rock')).toBeInTheDocument();
  });

  it('renders album information correctly when editing', async () => {
    const user = userEvent.setup();
    render(<ArtistList {...mockProps} />);
    
    // Passer en mode édition
    const editButton = screen.getByTestId('edit-artist-button');
    await user.click(editButton);
    
    // Vérifier que l'album est rendu
    const albumUpdateComponent = screen.getByTestId('mock-album-update-1');
    expect(albumUpdateComponent).toBeInTheDocument();
    expect(albumUpdateComponent).toHaveTextContent('Test Album');
  });

  it('handles artist deletion', async () => {
    const user = userEvent.setup();
    render(<ArtistList {...mockProps} />);
    
    const deleteButton = screen.getByTestId('delete-artist-button');
    await user.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockArtist.id);
  });

  it('handles editing mode toggle', async () => {
    const user = userEvent.setup();
    render(<ArtistList {...mockProps} />);
    
    // Activer le mode édition
    const editButton = screen.getByTestId('edit-artist-button');
    await user.click(editButton);
    expect(screen.getByTestId('artist-name-input')).toBeInTheDocument();
    
    // Désactiver le mode édition
    const cancelButton = screen.getByText('Annuler');
    await user.click(cancelButton);
    expect(screen.queryByTestId('artist-name-input')).not.toBeInTheDocument();
  });

  it('handles artist form submission', async () => {
    const user = userEvent.setup();
    render(<ArtistList {...mockProps} />);
    
    // Activer le mode édition
    const editButton = screen.getByTestId('edit-artist-button');
    await user.click(editButton);
    
    // Modifier les champs
    const nameInput = screen.getByTestId('artist-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Artist Name');
    
    // Soumettre le formulaire
    const saveButton = screen.getByText('Enregistrer');
    await user.click(saveButton);
    
    expect(mockProps.onUpdate).toHaveBeenCalled();
  });

  it('handles new album creation', async () => {
    const user = userEvent.setup();
    render(<ArtistList {...mockProps} />);
    
    // Activer le mode édition
    const editButton = screen.getByTestId('edit-artist-button');
    await user.click(editButton);
    
    // Ajouter un nouvel album
    const addButton = screen.getByText('Ajouter un album');
    await user.click(addButton);
    
    // Vérifier que le composant de création d'album est affiché
    expect(screen.getByTestId(`mock-album-creation-${mockArtist.id}`)).toBeInTheDocument();
  });
});
