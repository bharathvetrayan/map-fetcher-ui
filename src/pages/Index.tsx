import ScrapeForm from "@/components/ScrapeForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-semibold text-foreground">Maps Data Extractor</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Extract Business Data
              <span className="block text-primary">From Google Maps</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simply enter your search criteria and location to get comprehensive business data exported to Google Sheets
            </p>
          </div>
          
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <ScrapeForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by advanced scraping technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;