/**
 * Footer Component
 * 
 * Displays the footer with developer credit on all pages
 */

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4">
        <p className="text-center text-xs md:text-sm text-muted-foreground">
          designed and developed with ❤️ by <span className="font-medium text-foreground">SARTHAK MISHRA</span>💫
        </p>
      </div>
    </footer>
  );
};

