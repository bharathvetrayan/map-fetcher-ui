import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Google Maps Scraper Form Component
const ScrapeForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [leadCount, setLeadCount] = useState("");
  const [status, setStatus] = useState<"idle" | "in-progress" | "completed">("idle");
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState("");
  const [errors, setErrors] = useState({ searchTerm: false, location: false, leadCount: false });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if already in progress or completed
    if (status !== "idle") return;
    
    // Reset errors
    setErrors({ searchTerm: false, location: false, leadCount: false });
    
    // Validate all fields are filled
    const newErrors = {
      searchTerm: !searchTerm.trim(),
      location: !location.trim(),
      leadCount: !leadCount.trim()
    };
    
    if (newErrors.searchTerm || newErrors.location || newErrors.leadCount) {
      setErrors(newErrors);
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields."
      });
      return;
    }
    
    setStatus("in-progress");
    
    try {
      const response = await fetch("http://localhost:5678/webhook-test/34db0692-d5a5-47eb-92b0-e3b6fd159e1d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchTerm,
          location,
          leadCount: parseInt(leadCount)
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if we have a Google Sheets URL in the response
        if (data.googleSheet) {
          setGoogleSheetsUrl(data.googleSheet);
          setStatus("completed");
          toast({
            title: "Success!",
            description: "Leads have been scraped and are ready to view."
          });
        } else {
          setStatus("completed");
          toast({
            title: "Success!",
            description: "Scraping process completed."
          });
        }
        console.log("Webhook sent successfully:", { searchTerm, location, leadCount });
      } else {
        throw new Error("Failed to send webhook");
      }
    } catch (error) {
      setStatus("idle");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start scraping process. Please try again."
      });
      console.error("Error sending webhook:", error);
    }
  };

  const handleViewLeads = () => {
    if (googleSheetsUrl) {
      window.open(googleSheetsUrl, '_blank');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-medium border-0">
        <CardHeader className="text-center pb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-semibold">Google Maps Scraper</CardTitle>
          <CardDescription className="text-muted-foreground">
            Extract business data from Google Maps with ease
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="searchTerm" className="text-sm font-medium">
                Search Term
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="searchTerm"
                  type="text"
                  placeholder="e.g., restaurants, plumbers, hotels"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 h-11 ${errors.searchTerm ? 'border-destructive' : ''}`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., New York, London, Tokyo"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`pl-10 h-11 ${errors.location ? 'border-destructive' : ''}`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="leadCount" className="text-sm font-medium">
                Lead Count
              </Label>
              <Input
                id="leadCount"
                type="number"
                placeholder="e.g., 50, 100, 200"
                value={leadCount}
                onChange={(e) => setLeadCount(e.target.value)}
                className={`h-11 ${errors.leadCount ? 'border-destructive' : ''}`}
                required
                min="1"
              />
            </div>

            <Button
              type={status === "completed" && googleSheetsUrl ? "button" : "submit"}
              onClick={status === "completed" && googleSheetsUrl ? handleViewLeads : undefined}
              className="w-full h-11 bg-gradient-primary hover:opacity-90 transition-all duration-200"
              disabled={status === "in-progress"}
            >
              {status === "in-progress" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  In Progress...
                </>
              ) : status === "completed" && googleSheetsUrl ? (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  View Leads
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Scraping
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScrapeForm;