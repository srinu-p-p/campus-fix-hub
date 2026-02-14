const Index = () => {
  // Redirect to Landing - this file exists for compatibility
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
  return null;
};

export default Index;
