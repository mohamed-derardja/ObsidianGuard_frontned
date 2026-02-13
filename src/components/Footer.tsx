import logo from "@/assets/logo_obsidian_root.svg";

const Footer = () => (
  <footer id="footer" className="border-t border-border py-12 mt-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Obsidian Guard" className="w-9 h-9 object-contain" />
          <span className="font-bold">Obsidian <span className="text-gradient">Guard</span></span>
        </div>
        <p className="text-xs text-muted-foreground">Built for Hackathon 2026 — Advanced Cybersecurity Analysis Platform</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">About</a>
          <a href="#" className="hover:text-foreground transition-colors">Blog</a>
          <a href="#" className="hover:text-foreground transition-colors">Report Phishing</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
