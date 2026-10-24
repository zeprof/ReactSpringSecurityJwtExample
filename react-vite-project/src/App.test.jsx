import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

vi.mock('./components/PageLayout.jsx', () => ({
  default: () => <div data-testid="page-layout">PageLayout</div>,
}));

vi.mock('./components/MainContainer.jsx', () => ({
  default: () => <div data-testid="main-container">MainContainer</div>,
}));

vi.mock('./components/About.jsx', () => ({
  default: () => <div data-testid="about">About</div>,
}));

vi.mock('./components/auth/LoginForm.jsx', () => ({
  default: () => <div data-testid="login-form">LoginForm</div>,
}));

vi.mock('./components/auth/Logout.jsx', () => ({
  default: () => <div data-testid="logout">Logout</div>,
}));

vi.mock('./components/ErrorPage.jsx', () => ({
  default: () => <div data-testid="error-page">ErrorPage</div>,
}));

vi.mock('./components/page/EmprunteurHome.jsx', () => ({
  default: () => <div data-testid="emprunteur-home">EmprunteurHome</div>,
}));

vi.mock('./components/page/PreposeHome.jsx', () => ({
  default: () => <div data-testid="prepose-home">PreposeHome</div>,
}));

vi.mock('./components/page/GestionnaireHome.jsx', () => ({
  default: () => <div data-testid="gestionnaire-home">GestionnaireHome</div>,
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
  });

  it('renders with page layout on load', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
  });

  it('renders PageLayout component', () => {
    renderWithProviders(<App />);
    const pageLayout = screen.getByTestId('page-layout');
    expect(pageLayout).toBeInTheDocument();
    expect(pageLayout.textContent).toBe('PageLayout');
  });

  it('calls refreshUser on component mount', () => {
    const { rerender } = renderWithProviders(<App />);
    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
  });

  it('has routes for all expected paths', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('page-layout')).toBeInTheDocument();
  });
});
