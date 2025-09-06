// Mock data for authentication components

// Data passed as props to the root component
export const mockRootProps = {
  isAuthModalOpen: false,
  authMode: "login",
  isLoading: false,
  authError: null,
  user: null,
  onAuthModalToggle: () => {},
  onAuthModeChange: () => {},
  onLogin: () => {},
  onSignup: () => {},
  onGoogleAuth: () => {},
  onCloseModal: () => {}
};