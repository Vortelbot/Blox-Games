
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { editImageWithAI } from '../services/gemini';

interface AIStudioProps {
  user: User;
}

const AIStudio: React.FC<AIStudioProps> = ({ user }) => {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!image || !prompt) return;
    setIsProcessing(true);
    setError(null);
    
    const result = await editImageWithAI(image, prompt);
    if (result) {
      setImage(result);
    } else {
      setError("AI was unable to process this request. Check your prompt or image quality.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-black tracking-tighter mb-4 flex items-center justify-center gap-4">
          <i className="fas fa-wand-magic-sparkles text-purple-500"></i>
          AI <span className="text-purple-500">Studio</span>
        </h2>
        <p className="text-[#8b8ea8] text-lg max-w-2xl mx-auto">
          Modify images using text prompts. Powered by Gemini 2.5 Flash. Try "Add a retro filter", "Make it cyberpunk style", or "Put a crown on my head".
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div 
            className={`relative aspect-square rounded-3xl border-4 border-dashed border-[#1a1d2e] bg-[#0d0f1f] flex items-center justify-center overflow-hidden transition-all ${!image ? 'hover:border-purple-500/50' : ''}`}
            onClick={() => !image && fileInputRef.current?.click()}
          >
            {image ? (
              <img src={image} className="w-full h-full object-cover" alt="Source" />
            ) : (
              <div className="text-center p-8">
                <i className="fas fa-cloud-upload-alt text-4xl text-[#4b5563] mb-4"></i>
                <div className="font-bold text-[#8b8ea8]">Click to upload base image</div>
              </div>
            )}
            {image && (
              <button 
                onClick={(e) => { e.stopPropagation(); setImage(null); }}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        <div className="space-y-6 flex flex-col justify-center">
          <div className="bg-[#0d0f1f] p-8 rounded-3xl border border-[#1a1d2e]">
            <label className="block text-xs font-black text-[#4b5563] uppercase tracking-widest mb-4">Modification Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Add a sunset background and make the style painterly..."
              className="w-full h-32 bg-[#060812] border border-[#1a1d2e] rounded-2xl p-4 text-sm focus:outline-none focus:border-purple-500 transition-all resize-none mb-6"
            />

            {error && <div className="p-4 bg-red-500/10 text-red-500 text-sm rounded-xl mb-6 flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>}

            <button
              onClick={handleEdit}
              disabled={!image || !prompt || isProcessing}
              className="w-full py-5 bg-purple-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-500/20 hover:bg-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all relative overflow-hidden group"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-3">
                  <i className="fas fa-spinner animate-spin"></i>
                  GENERATING MAGIC...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <i className="fas fa-magic"></i>
                  TRANSFORM IMAGE
                </div>
              )}
            </button>

            <div className="mt-8 pt-8 border-t border-white/5 space-y-3">
              <div className="text-[10px] text-[#4b5563] font-black uppercase">Tips for best results:</div>
              <ul className="text-xs text-[#8b8ea8] space-y-2 list-disc pl-4">
                <li>Be specific about colors and lighting</li>
                <li>Describe styles (e.g., "Neon", "Cyberpunk", "Vintage")</li>
                <li>Focus on additions or removals one at a time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIStudio;
