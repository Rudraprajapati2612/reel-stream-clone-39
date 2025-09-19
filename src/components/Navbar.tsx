import { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onApiKeyChange: (key: string) => void;
  hasApiKey: boolean;
}

const Navbar = ({ onApiKeyChange, hasApiKey }: NavbarProps) => {
  const [show, setShow] = useState(false);
  const [showApiInput, setShowApiInput] = useState(!hasApiKey);
  const [apiKeyInput, setApiKeyInput] = useState("");

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleApiKeySubmit = () => {
    if (apiKeyInput.trim()) {
      onApiKeyChange(apiKeyInput.trim());
      setShowApiInput(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-500 ${
      show ? "bg-background/95 backdrop-blur-md" : "bg-transparent"
    }`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl md:text-3xl font-bold text-netflix-red">
            NETFLIX
          </h1>
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-netflix-red">
              Home
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-netflix-red">
              TV Shows
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-netflix-red">
              Movies
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-netflix-red">
              My List
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showApiInput ? (
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter TMDB API Key"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-48 bg-background/80"
                onKeyPress={(e) => e.key === "Enter" && handleApiKeySubmit()}
              />
              <Button onClick={handleApiKeySubmit} variant="default">
                Set
              </Button>
            </div>
          ) : (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  className="w-48 bg-background/80"
                />
              </div>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApiInput(true)}
                className="text-xs"
              >
                API
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;