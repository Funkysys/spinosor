import { deleteAlbum } from "@/app/api/albums/albums";
import { ArtistWithAlbums } from "@/types";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ArtistList from "../ArtistList";

// Mock next/dynamic
jest.mock("next/dynamic", () => () => {
  return function DynamicComponent() {
    return <div data-testid="mock-quill">Mock Quill Editor</div>;
  };
});

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <div data-testid="mock-image" {...props} />;
  },
}));

// Mock react-quill
jest.mock("react-quill", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-quill">Mock Quill Editor</div>,
}));

// Mock AlbumCreation
jest.mock("../AlbumCreation", () => ({
  __esModule: true,
  default: ({ artistId }: { artistId: string }) => {
    return (
      <div data-testid={`mock-album-creation-${artistId}`}>
        Mock Album Creation
      </div>
    );
  },
}));

// Mock AlbumUpdate
jest.mock("../AlbumUpdate", () => ({
  __esModule: true,
  default: ({ albumData }: { albumData: any }) => (
    <div data-testid={`mock-album-update-${albumData.id}`}>
      <div>{albumData.title}</div>
    </div>
  ),
}));

// Mock deleteAlbum
jest.mock("@/app/api/action/albums/albums", () => ({
  deleteAlbum: jest.fn(),
}));

describe("ArtistList Component", () => {
  const mockArtist: ArtistWithAlbums = {
    id: "1",
    name: "Test Artist",
    imageUrl: "/test-image.jpg",
    bio: "Test bio",
    genre: "Rock",
    videoUrl: null,
    codePlayer: null,
    slug: "test-artist",
    urlPlayer: null,
    socialLinks: [],
    events: [],
    albums: [
      {
        id: "1",
        title: "Test Album",
        slug: "test-album",
        imageUrl: "/test-album.jpg",
        releaseDate: new Date("2024-01-01"),
        artistId: "1",
        links: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProps = {
    artists: [mockArtist],
    onDelete: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders artist information correctly", () => {
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );
    expect(screen.getByText("Test Artist")).toBeInTheDocument();
    expect(screen.getByText("Genre : Rock")).toBeInTheDocument();
  });

  it("renders album information correctly when editing", async () => {
    const user = userEvent.setup();
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    // Passer en mode édition
    const editButton = screen.getByTestId("edit-artist-button");
    await user.click(editButton);

    // Vérifier que l'album est rendu
    const albumUpdateComponent = screen.getByTestId("mock-album-update-1");
    expect(albumUpdateComponent).toBeInTheDocument();
    expect(albumUpdateComponent).toHaveTextContent("Test Album");
  });

  it("handles artist deletion", async () => {
    const user = userEvent.setup();
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    const deleteButton = screen.getByTestId("delete-artist-button");
    await user.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalledWith(mockArtist.id);
  });

  it("handles editing mode toggle", async () => {
    const user = userEvent.setup();
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    // Activer le mode édition
    const editButton = screen.getByTestId("edit-artist-button");
    await user.click(editButton);
    expect(screen.getByTestId("artist-name-input")).toBeInTheDocument();

    // Désactiver le mode édition
    const cancelButton = screen.getByText("Annuler");
    await user.click(cancelButton);
    expect(screen.queryByTestId("artist-name-input")).not.toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const user = userEvent.setup();
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    // Activer le mode édition
    await user.click(screen.getByTestId("edit-artist-button"));

    // Soumettre le formulaire
    const form = screen.getByTestId("artist-form");
    await user.click(screen.getByTestId("save-button"));

    expect(form).toBeInTheDocument();
  });

  it("handles new album creation", async () => {
    const user = userEvent.setup();
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    // Activer le mode édition
    await user.click(screen.getByTestId("edit-artist-button"));

    // Ajouter un nouvel album
    const addButton = screen.getByText("Ajouter un album");
    await user.click(addButton);

    // Vérifier que le composant de création d'album est affiché
    expect(
      screen.getByTestId(`mock-album-creation-${mockArtist.id}`)
    ).toBeInTheDocument();
  });

  it("handles loading state correctly", () => {
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
        isLoading={true}
      />
    );
    expect(screen.getByTestId("loading-state")).toBeInTheDocument();
  });

  it("handles social links display and editing", async () => {
    const artistWithLinks = {
      ...mockArtist,
      socialLinks: JSON.stringify([
        { id: 1, name: "Twitter", url: "https://twitter.com/test" },
        { id: 2, name: "Instagram", url: "https://instagram.com/test" },
      ]),
    };

    const user = userEvent.setup();
    render(
      <ArtistList
        artists={[artistWithLinks]}
        onDelete={mockProps.onDelete}
        isLoading={false}
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );

    // Vérifier l'affichage des liens sociaux
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("Instagram")).toBeInTheDocument();

    // Passer en mode édition
    await user.click(screen.getByTestId("edit-artist-button"));

    // Vérifier les champs d'édition des liens
    const linkInputs = screen.getAllByPlaceholderText("URL du lien");
    expect(linkInputs).toHaveLength(2);

    // Tester la suppression d'un lien
    const removeButtons = screen.getAllByText("x");
    await user.click(removeButtons[0]);
    expect(screen.getAllByPlaceholderText("URL du lien")).toHaveLength(1);
  });

  it("handles bio editing with ReactQuill", async () => {
    const user = userEvent.setup();
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    // Passer en mode édition
    await user.click(screen.getByTestId("edit-artist-button"));

    // Vérifier que l'éditeur est présent
    expect(screen.getByTestId("mock-quill")).toBeInTheDocument();
  });

  it("validates required fields on form submission", async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    // Passer en mode édition
    await user.click(screen.getByTestId("edit-artist-button"));

    // Vider le champ nom
    const nameInput = screen.getByTestId("artist-name-input");
    await user.clear(nameInput);

    // Tenter de soumettre le formulaire
    await user.click(screen.getByText("Enregistrer"));

    expect(consoleSpy).toHaveBeenCalledWith(
      "Le nom de l'artiste est obligatoire"
    );
    consoleSpy.mockRestore();
  });

  it("handles album deletion", async () => {
    const user = userEvent.setup();
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    // Passer en mode édition
    await user.click(screen.getByTestId("edit-artist-button"));

    // Supprimer un album
    const deleteAlbumButton = screen.getByTestId("delete-album-1");
    await user.click(deleteAlbumButton);

    expect(deleteAlbum).toHaveBeenCalledWith(mockArtist.albums[0]);
  });

  it("handles empty artists array", () => {
    render(
      <ArtistList
        artists={[]}
        onDelete={mockProps.onDelete}
        isLoading={false}
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    const emptyMessage = screen.getByTestId("empty-artists-message");
    expect(emptyMessage).toBeInTheDocument();
  });

  it("handles invalid social links JSON", () => {
    const artistWithInvalidLinks = {
      ...mockArtist,
      socialLinks: "invalid json",
    };

    render(
      <ArtistList
        artists={[artistWithInvalidLinks]}
        onDelete={mockProps.onDelete}
        isLoading={false}
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    expect(
      screen.getByText("Aucun lien social disponible.")
    ).toBeInTheDocument();
  });

  it("handles genre validation", async () => {
    const user = userEvent.setup();
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );
    await user.click(screen.getByTestId("edit-artist-button"));

    const genreInput = screen.getByLabelText(/genre/i);
    await user.clear(genreInput);

    await user.click(screen.getByText("Enregistrer"));
    expect(alertMock).toHaveBeenCalledWith("Le genre est obligatoire");

    alertMock.mockRestore();
  });

  it("handles image validation", async () => {
    const user = userEvent.setup();
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    const artistWithoutImage = {
      ...mockArtist,
      imageUrl: "",
    };

    render(
      <ArtistList
        artists={[artistWithoutImage]}
        onDelete={mockProps.onDelete}
        isLoading={false}
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    );
    await user.click(screen.getByTestId("edit-artist-button"));

    // Soumettre le formulaire sans image
    await user.click(screen.getByTestId("save-button"));
    expect(alertMock).toHaveBeenCalledWith("L'image est obligatoire");

    alertMock.mockRestore();
  });

  it("handles album form validation", async () => {
    const user = userEvent.setup();
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    // Passer en mode édition
    await user.click(screen.getByTestId("edit-artist-button"));

    // Ajouter un nouvel album
    await user.click(screen.getByText("Ajouter un album"));

    // Vérifier que le formulaire de création d'album est affiché
    expect(
      screen.getByTestId(`mock-album-creation-${mockArtist.id}`)
    ).toBeInTheDocument();
  });

  it("handles ReactQuill value change", async () => {
    const user = userEvent.setup();
    render(
      <ArtistList
        onAlbumUpdate={function (): void {
          throw new Error("Function not implemented.");
        }}
        {...mockProps}
      />
    );

    // Passer en mode édition
    await user.click(screen.getByTestId("edit-artist-button"));

    // Vérifier que l'éditeur est présent
    const quillEditor = screen.getByTestId("mock-quill");
    expect(quillEditor).toBeInTheDocument();

    // Simuler un changement dans l'éditeur
    const mockOnChange = jest.fn();
    quillEditor.addEventListener("change", mockOnChange);
    fireEvent.change(quillEditor, {
      target: { textContent: "Nouvelle biographie" },
    });

    expect(quillEditor).toBeInTheDocument();
  });
});
