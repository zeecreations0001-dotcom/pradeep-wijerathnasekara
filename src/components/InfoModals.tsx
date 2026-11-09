import React, { useState } from 'react';
import { X, Send, Mail, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { Language } from '../data/translations';

interface ContactModalProps {
  isOpen: boolean;
  language?: Language;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, language = 'en', onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const isSi = language === 'si';
  const [department, setDepartment] = useState(isSi ? 'පුවත් කාමර සංස්කාරක මණ්ඩලය' : 'Newsroom Editorial');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-desk-title"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        className="bg-[#faf6ee] text-black max-w-lg w-full border border-[#d8c7a8] shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:opacity-75 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3
          id="contact-desk-title"
          className="font-headline italic text-2xl font-bold text-black mb-1"
        >
          {isSi ? 'සංස්කාරක මණ්ඩලය අමතන්න' : 'Contact the Newsroom'}
        </h3>
        <p className="font-serif text-xs text-black mb-6">
          {isSi
            ? 'අපගේ සංස්කාරකවරුන් හා සම්බන්ධ වන්න, අදහස් යෝජනා ඉදිරිපත් කරන්න හෝ තොරතුරු දැනුම් දෙන්න.'
            : 'Reach our editors, submit an Op-Ed proposal, or notify our investigative desk.'}
        </p>

        {submitted ? (
          <div className="py-8 text-center bg-[#f4ebd9] border border-[#d8c7a8]">
            <CheckCircle2 className="w-10 h-10 text-black mx-auto mb-2" />
            <h4 className="font-serif font-bold text-sm text-black mb-1">
              {isSi ? 'පණිවිඩය සාර්ථකව ලැබිණි' : 'Dispatch Received'}
            </h4>
            <p className="font-serif text-xs text-black">
              {isSi
                ? 'ප්‍රදීප් විජේරත්නසේකර අධ්‍යාපනික බ්ලොග් අඩවිය හා සම්බන්ධ වීම පිළිබඳව ස්තූතියි. ඔබගේ පණිවිඩය අදාළ අංශය වෙත යොමු කරන ලදී.'
                : 'Thank you for contacting Pradeep Wijerathnasekara Educational Blog. Your message has been routed to our team.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-black font-sans mb-1">
                {isSi ? 'සම්පූර්ණ නම' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isSi ? 'ඔබගේ නම' : 'Jane Doe'}
                className="w-full text-xs font-serif px-3 py-2 bg-[#fdfbf7] text-black border border-[#d8c7a8] focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-black font-sans mb-1">
                {isSi ? 'විද්‍යුත් තැපැල් ලිපිනය' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs font-serif px-3 py-2 bg-[#fdfbf7] text-black border border-[#d8c7a8] focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-black font-sans mb-1">
                {isSi ? 'අංශය' : 'Department'}
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs font-serif px-3 py-2 bg-[#fdfbf7] text-black border border-[#d8c7a8] focus:outline-none focus:border-black"
              >
                {isSi ? (
                  <>
                    <option>පුවත් කාමර සංස්කාරක මණ්ඩලය</option>
                    <option>කර්තෘ වෙත ලිපි</option>
                    <option>මත විමසුම් සහ ආරාධිත තීරු ලිපි</option>
                    <option>ඡායාරූප සහ ලේඛනාගාර අංශය</option>
                    <option>මාධ්‍ය සබඳතා අංශය</option>
                    <option>බෙදාහැරීම් හා පාඨක සේවා අංශය</option>
                  </>
                ) : (
                  <>
                    <option>Newsroom Editorial</option>
                    <option>Letters to the Editor</option>
                    <option>Opinion & Guest Columnists</option>
                    <option>Photography & Archives</option>
                    <option>Press & Media Relations</option>
                    <option>Circulation & Reader Support</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-black font-sans mb-1">
                {isSi ? 'පණිවිඩය' : 'Correspondence'}
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isSi ? 'ඔබගේ සටහන මෙහි ලියන්න...' : 'Write your note or tip...'}
                className="w-full text-xs font-serif px-3 py-2 bg-[#fdfbf7] text-black border border-[#d8c7a8] focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#facc15] hover:bg-[#ffd200] text-black text-[11px] font-black tracking-widest uppercase transition-colors cursor-pointer shadow-xs border border-[#eab308]"
            >
              {isSi ? 'පණිවිඩය යවන්න' : 'SEND DISPATCH'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#dfd0ba] grid grid-cols-2 gap-4 text-[11px] text-black font-sans">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-black shrink-0" />
            <span>220 W 42nd St, New York, NY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-black shrink-0" />
            <span>+1 (212) 556-1234</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'shortcodes' | 'post_types';
}

export const ShowcaseModal: React.FC<ShowcaseModalProps> = ({
  isOpen,
  onClose,
  title,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="showcase-modal-title"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        className="bg-[#faf6ee] text-black max-w-xl w-full border border-[#d8c7a8] shadow-2xl p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:opacity-75 p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3
          id="showcase-modal-title"
          className="font-headline italic text-2xl font-bold text-black mb-2"
        >
          {title}
        </h3>
        <p className="font-serif text-xs text-black mb-6">
          Theme elements and formatting modules included in Pradeep Wijerathnasekara Educational Blog.
        </p>

        {type === 'shortcodes' ? (
          <div className="space-y-6 text-xs font-serif text-black">
            {/* Blockquote shortcode */}
            <div className="border p-4 bg-[#f4ebdc] border-[#dfcead] rounded-xs">
              <span className="font-sans font-bold text-[10px] tracking-wider uppercase text-black block mb-2">
                [editorial_quote]
              </span>
              <blockquote className="border-l-2 border-black pl-4 italic text-black text-sm">
                “Journalism can never be silent: that is its greatest virtue and its greatest fault.”
                <cite className="block text-[11px] font-sans not-italic text-black mt-1 font-semibold">
                  — Henry Anatole Grunwald
                </cite>
              </blockquote>
            </div>

            {/* Dropcap shortcode */}
            <div className="border p-4 bg-[#f4ebdc] border-[#dfcead] rounded-xs">
              <span className="font-sans font-bold text-[10px] tracking-wider uppercase text-black block mb-2">
                [dropcap]
              </span>
              <p className="first-letter-drop leading-relaxed text-black">
                Classic typography commands respect. The drop-cap element aligns with traditional letterpress standards, anchoring the start of editorial narratives with historical gravity.
              </p>
            </div>

            {/* Column split shortcode */}
            <div className="border p-4 bg-[#f4ebdc] border-[#dfcead] rounded-xs">
              <span className="font-sans font-bold text-[10px] tracking-wider uppercase text-black block mb-2">
                [columns_2]
              </span>
              <div className="grid grid-cols-2 gap-4 text-black">
                <p>Curabitur vel feugiat massa, sed facilisis ligula. Duis eleifend nunc sit amet mi dapibus ornare.</p>
                <p>Nam ac nisl non ipsum vestibulum vehicula vulputate sagittis magna. Integer eget sagittis nulla praesent.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs font-serif text-black">
            <div className="p-3 border border-[#dfcead] bg-[#f4ebdc] rounded-xs">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-black mb-1">
                Standard Editorial Post
              </h4>
              <p className="text-black">
                Single or multi-column layout with hero imagery, author byline, formatted quote pullouts, and reader comments.
              </p>
            </div>
            <div className="p-3 border border-[#dfcead] bg-[#f4ebdc] rounded-xs">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-black mb-1">
                Photojournalism Gallery Post
              </h4>
              <p className="text-black">
                Full-bleed high resolution photo essays with archival metadata, exposure records, and carousel views.
              </p>
            </div>
            <div className="p-3 border border-[#dfcead] bg-[#f4ebdc] rounded-xs">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-black mb-1">
                Opinion & Op-Ed Column
              </h4>
              <p className="text-black">
                Distinguished author portrait column, stylized pull quotes, and linked contributor archives.
              </p>
            </div>
            <div className="p-3 border border-[#dfcead] bg-[#f4ebdc] rounded-xs">
              <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-black mb-1">
                Breaking Dispatch Post
              </h4>
              <p className="text-black">
                Real-time chronological wire report with live timestamp updates and bulleted facts summaries.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
