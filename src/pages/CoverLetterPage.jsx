import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { CoverLetterForm } from '../features/coverLetter/CoverLetterForm';
import { LetterPreview } from '../features/coverLetter/LetterPreview';

const generateLetter = ({ name, jobTitle, company, tone, skills }) => {
  const toneMap = {
    Professional: 'I am writing to express my strong interest',
    Confident: 'I am excited to bring my expertise',
    Friendly: 'I would love to join',
    Formal: 'I respectfully submit my application for',
    Assertive: 'My track record makes me an ideal candidate for',
    Creative: 'Building exceptional products is my passion, which is why',
  };

  const opener = toneMap[tone] || toneMap.Professional;
  const skillList = skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : ['React', 'TypeScript', 'modern web technologies'];

  return `${name}
[Your Location] · [your.email@example.com] · [linkedin.com/in/yourprofile]
${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Hiring Manager
${company}

Dear Hiring Manager,

${opener} in the ${jobTitle} position at ${company}. Having followed ${company}'s work closely, I am consistently impressed by the quality and impact of your engineering, and I believe my background aligns strongly with what you're looking for.

Over the past several years, I have honed deep expertise in ${skillList.slice(0, 3).join(', ')} — building performant, scalable, and user-centric products that make a genuine difference. In my most recent role, I led the redesign of a core product feature that improved user engagement by 40% and reduced load time by over 60%, directly contributing to a 15% increase in user retention.

What draws me to ${company} in particular is the caliber of your engineering culture and your commitment to crafting tools that developers and users genuinely love. The ${jobTitle} role feels like a natural fit — I thrive in environments where attention to detail, cross-functional collaboration, and continuous iteration are valued.

I am particularly excited about:
• Bringing deep expertise in ${skillList[0] || 'React'} to help scale your product infrastructure
• Collaborating with world-class engineers to ship high-impact features
• Contributing to a culture of technical excellence and thoughtful product decisions

I would be thrilled to chat more about how my background can contribute to ${company}'s mission. Thank you sincerely for your time and consideration — I look forward to the possibility of working together.

Warm regards,
${name}`;
};

const CoverLetterPage = () => {
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleGenerate = async (form) => {
    setFormData(form);
    setLoading(true);
    setLetter('');
    await new Promise((r) => setTimeout(r, 1800));
    setLetter(generateLetter(form));
    setLoading(false);
  };

  const handleRegenerate = () => formData && handleGenerate(formData);

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-neutral-50 font-[family-name:var(--font-heading)] flex items-center gap-2">
          <Mail className="w-6 h-6 text-teal-400" />
          Cover Letter Generator
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          AI-powered cover letters tailored to the role — edit inline before sending
        </p>
      </motion.div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        {/* Form */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-neutral-200 mb-5">Job Details</h2>
          <CoverLetterForm onGenerate={handleGenerate} loading={loading} />
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 flex flex-col min-h-[500px]">
          <LetterPreview letter={letter} loading={loading} onRegenerate={handleRegenerate} />
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage;

