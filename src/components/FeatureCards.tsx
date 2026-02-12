import { motion } from "framer-motion";
import { Globe, TrendingUp, ShieldCheck, Brain, Briefcase } from "lucide-react";

const features = [
  { icon: Globe, title: "Web Security Analyst", desc: "Deep URL + visual analysis for detecting spoofed pages and domain tricks" },
  { icon: TrendingUp, title: "Threat Researcher", desc: "Daily evolution trends, attack pattern recognition & intelligence feeds" },
  { icon: ShieldCheck, title: "Moderator", desc: "Review, flag & report suspicious cases with one-click actions" },
  { icon: Brain, title: "Context Manager", desc: "Understands email tone, urgency signals & social engineering cues" },
  { icon: Briefcase, title: "Entrepreneur", desc: "Business protection dashboards & team-wide security insights" },
];

const FeatureCards = () => (
  <section id="features" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Role-Based <span className="text-gradient-cyan">Intelligence</span></h2>
        <p className="text-muted-foreground max-w-lg mx-auto">Purpose-built modules for every security role in your organization</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6 text-center group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:neon-glow transition-all duration-300">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-2">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureCards;
