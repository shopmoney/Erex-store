import React, { useState } from 'react';
import { Mail, MessageCircle, Youtube, Copy, Check, ExternalLink, ArrowUpRight } from 'lucide-react';

export function ContactSection() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const email = 'erextech77@gmail.com';
  const phone = '08126588150';
  const whatsappUrl = 'https://wa.me/2348126588150?text=Hello%20Erex%20Technologies%2C%20I%20am%20interested%20in%20your%20AI%20guides%20and%20workflows.';
  const tiktokUrl = 'https://www.tiktok.com/@erex.technologies';
  const youtubeUrl = 'https://www.youtube.com/@erextechnologies';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 xl:px-14 w-full border-t border-[#1E2333]/80 scroll-mt-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12141F] border border-[#1E2333] text-[11px] font-semibold text-[#16C79A] uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16C79A] animate-pulse" />
          <span>Connect & Support</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F5F6FA] tracking-tight">
          Connect with Erex Technologies
        </h2>
        <p className="text-sm sm:text-base text-[#8A90A6] mt-2 leading-relaxed">
          Follow our tutorials on TikTok and YouTube, or message us directly on WhatsApp or Email for purchase inquiries and AI guidance.
        </p>
      </div>

      {/* Responsive Grid of 4 Contact / Social Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        
        {/* 1. WHATSAPP */}
        <div className="product-card rounded-2xl p-5 flex flex-col justify-between group hover:border-[#16C79A]/50 transition-all duration-300 min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#16C79A]/10 border border-[#16C79A]/30 text-[#16C79A] flex items-center justify-center group-hover:scale-105 transition-transform">
                {/* Official WhatsApp SVG Vector */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15s-.778.98-.954 1.181c-.176.201-.351.226-.653.075s-1.272-.469-2.424-1.496c-.896-.799-1.5-1.787-1.677-2.088s-.019-.464.132-.614c.135-.134.301-.351.452-.527.15-.176.201-.301.301-.502.1-.201.05-.376-.025-.527s-.678-1.632-.929-2.235c-.244-.587-.492-.507-.677-.516l-.578-.01c-.2 0-.527.075-.803.376s-1.055 1.03-1.055 2.511c0 1.482 1.08 2.912 1.231 3.113.15.201 2.126 3.245 5.15 4.553.719.312 1.28.498 1.718.637.723.23 1.38.197 1.9.12.58-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.076-.125-.276-.201-.577-.351zM12.042 21.916h-.008c-1.748 0-3.463-.47-4.962-1.359l-.356-.21-3.69.967.985-3.597-.232-.369A9.92 9.92 0 0 1 2.125 12c0-5.464 4.453-9.916 9.925-9.916 2.648 0 5.138 1.031 7.012 2.906a9.86 9.86 0 0 1 2.906 7.016c0 5.467-4.453 9.91-9.926 9.91z"/>
                </svg>
              </div>
              <span className="text-[11px] font-mono text-[#16C79A] bg-[#16C79A]/10 border border-[#16C79A]/20 px-2 py-0.5 rounded-full">
                Instant Chat
              </span>
            </div>
            
            <h3 className="font-display font-bold text-base text-[#F5F6FA] mb-1">WhatsApp</h3>
            <p className="text-xs text-[#8A90A6] mb-3 leading-relaxed">
              Fast questions, instant checkout support, and custom assistance.
            </p>
            <div className="font-mono text-sm text-[#F5F6FA] font-medium mb-4 flex items-center gap-2">
              <span>{phone}</span>
              <button 
                onClick={handleCopyPhone}
                title="Copy phone number"
                className="text-[#8A90A6] hover:text-[#16C79A] p-1 rounded transition-colors cursor-pointer"
              >
                {copiedPhone ? <Check className="w-3.5 h-3.5 text-[#16C79A]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-[#16C79A]/15 hover:bg-[#16C79A] text-[#16C79A] hover:text-[#05060A] text-xs font-semibold border border-[#16C79A]/30 hover:border-transparent transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(22,199,154,0.15)] hover:shadow-[0_0_20px_rgba(22,199,154,0.35)]"
          >
            <span>Message on WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 2. EMAIL */}
        <div className="product-card rounded-2xl p-5 flex flex-col justify-between group hover:border-[#2E5EFF]/50 transition-all duration-300 min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#2E5EFF]/10 border border-[#2E5EFF]/30 text-[#2E5EFF] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-[#2E5EFF] bg-[#2E5EFF]/10 border border-[#2E5EFF]/20 px-2 py-0.5 rounded-full">
                Direct Mail
              </span>
            </div>
            
            <h3 className="font-display font-bold text-base text-[#F5F6FA] mb-1">Email Support</h3>
            <p className="text-xs text-[#8A90A6] mb-3 leading-relaxed">
              Official requests, consulting proposals, and guide feedback.
            </p>
            <div className="font-mono text-xs text-[#F5F6FA] font-medium mb-4 flex items-center justify-between bg-[#05060A] p-2 rounded-lg border border-[#1E2333] min-w-0">
              <span className="truncate mr-1" title={email}>{email}</span>
              <button 
                onClick={handleCopyEmail}
                title="Copy email address"
                className="text-[#8A90A6] hover:text-[#2E5EFF] p-1 rounded transition-colors cursor-pointer flex-shrink-0"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#16C79A]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-[#2E5EFF]/15 hover:bg-[#2E5EFF] text-[#2E5EFF] hover:text-white text-xs font-semibold border border-[#2E5EFF]/30 hover:border-transparent transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(46,94,255,0.15)] hover:shadow-[0_0_20px_rgba(46,94,255,0.35)]"
          >
            <span>Send Email</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 3. TIKTOK */}
        <div className="product-card rounded-2xl p-5 flex flex-col justify-between group hover:border-[#F5F6FA]/40 transition-all duration-300 min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/20 text-[#F5F6FA] flex items-center justify-center group-hover:scale-105 transition-transform">
                {/* Official TikTok SVG Vector */}
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </div>
              <span className="text-[11px] font-mono text-[#8A90A6] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                Shorts & Tips
              </span>
            </div>
            
            <h3 className="font-display font-bold text-base text-[#F5F6FA] mb-1">TikTok</h3>
            <p className="text-xs text-[#8A90A6] mb-3 leading-relaxed">
              Bite-sized AI tools, prompt shortcuts, and quick workflow demos.
            </p>
            <div className="font-medium text-xs text-[#F5F6FA] mb-4 bg-[#05060A] p-2 rounded-lg border border-[#1E2333] flex flex-col gap-0.5 min-w-0">
              <div className="truncate">
                <span className="text-[#8A90A6]">Channel: </span>
                <span className="text-white font-semibold">erex technologies</span>
              </div>
              <span className="font-mono text-[11px] text-[#8A90A6] truncate">@erex.technologies</span>
            </div>
          </div>

          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold border border-white/20 hover:border-transparent transition-all duration-200 cursor-pointer"
          >
            <span>Follow on TikTok</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 4. YOUTUBE */}
        <div className="product-card rounded-2xl p-5 flex flex-col justify-between group hover:border-[#FF0000]/40 transition-all duration-300 min-w-0">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF4444] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Youtube className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-[#FF4444] bg-[#FF0000]/10 border border-[#FF0000]/20 px-2 py-0.5 rounded-full">
                Tutorials
              </span>
            </div>
            
            <h3 className="font-display font-bold text-base text-[#F5F6FA] mb-1">YouTube</h3>
            <p className="text-xs text-[#8A90A6] mb-3 leading-relaxed">
              Deep dives, career tutorials, and complete AI implementation guides.
            </p>
            <div className="font-medium text-xs text-[#F5F6FA] mb-4 bg-[#05060A] p-2 rounded-lg border border-[#1E2333]">
              <span className="text-[#8A90A6]">Channel: </span>
              <span className="text-white font-semibold">erex technologies</span>
            </div>
          </div>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-[#FF0000]/15 hover:bg-[#FF0000] text-[#FF6666] hover:text-white text-xs font-semibold border border-[#FF0000]/30 hover:border-transparent transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(255,0,0,0.15)] hover:shadow-[0_0_20px_rgba(255,0,0,0.35)]"
          >
            <span>Subscribe on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </section>
  );
}
