export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm">
          &copy; {year} Aqua Index Analyzer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
