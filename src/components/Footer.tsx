import { Shield } from "lucide-react";

const Footer = () => (
  <footer id="footer" className="border-t border-border py-12 mt-20">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="font-bold">Phish<span className="text-primary">Sleuth</span></span>
          <span className="text-xs text-muted-foreground ml-2">🇮🇳 Made for India</span>
        </div>
        <p className="text-xs text-muted-foreground">Built in 24 hours for Hackathon 2026</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">About</a>
          <a href="#" className="hover:text-primary transition-colors">Blog</a>
          <a href="#" className="hover:text-primary transition-colors">Report Phishing</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
