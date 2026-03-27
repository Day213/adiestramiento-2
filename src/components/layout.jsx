
export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        {children}
      </div>
    </div>
  );
};
