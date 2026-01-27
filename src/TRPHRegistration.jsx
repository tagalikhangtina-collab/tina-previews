import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check, FileText, Upload, AlertCircle, Menu, X, CheckCircle2 } from 'lucide-react';
import { supabase } from "./lib/supabaseClient";
/**
 * TRPH Cycling Club - Membership Application & Onboarding
 * * DESIGN SYSTEM:
 * - Minimalist Black & White
 * - Formal, structured typography
 * - Step-based progression
 */
// --- Constants & Config ---
const TOTAL_STEPS = 8;
const STORAGE_KEY = 'trph_onboarding_state';
const LINKS = {
  handbook: '/docs/TRPH_Cycling_Club_Handbook.pdf',
  bylaws: '/docs/TRPH_Bylaws_SEC_Form_101_NS.pdf',
  conduct: '/docs/TRPH_Code_of_Conduct.pdf',
};
const STEPS_INFO = [
  { id: 1, title: 'Welcome' },
  { id: 2, title: 'Values' },
  { id: 3, title: 'Benefits' },
  { id: 4, title: 'Governance' },
  { id: 5, title: 'Conduct' },
  { id: 6, title: 'Acknowledgment' },
  { id: 7, title: 'Application' },
  { id: 8, title: 'Next Steps' },
];
const INITIAL_FORM_DATA = {
  fullName: '',
  email: '',
  mobile: '',
  city: '',
  emergencyName: '',
  emergencyNumber: '',
  nominator: '',
  cyclingBackground: '',
  paymentRef: '',
  hasPaid: false,
  paymentFile: null,
};
const INITIAL_CONSENT = {
  handbook: false,
  bylaws: false,
  conduct: false,
};
// --- Components ---
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseStyles = "px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800 border border-black",
    secondary: "bg-white text-black border border-black hover:bg-gray-50",
    text: "bg-transparent text-gray-500 hover:text-black text-xs font-normal normal-case",
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
const PDFLink = ({ title, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black border-b border-gray-300 hover:border-black pb-0.5 transition-colors mt-4"
  >
    <FileText className="w-4 h-4" />
    Read and Download: {title}
  </a>
);
const SectionTitle = ({ children }) => (
  <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6 border-l-4 border-black pl-4">
    {children}
  </h2>
);
const ProgressBar = ({ currentStep }) => {
  const progress = ((currentStep) / TOTAL_STEPS) * 100;
  return (
    <div className="w-full bg-gray-100 h-1 fixed top-0 left-0 z-50">
      <div 
        className="bg-black h-1 transition-all duration-500 ease-in-out" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
// --- Main Application Component ---
export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [consent, setConsent] = useState(INITIAL_CONSENT);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false); // Sub-state for Step 7
  const [reviewConfirm, setReviewConfirm] = useState({
    infoAccurate: false,
    agreeRules: false,
  });
  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only restore if valid data exists and we aren't already finished
        if (parsed.step < 8) {
          setCurrentStep(parsed.step);
          setFormData(parsed.formData || INITIAL_FORM_DATA);
          setConsent(parsed.consent || INITIAL_CONSENT);
        }
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);
  // Save state to localStorage on change
  useEffect(() => {
    if (currentStep < 8) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        step: currentStep,
        formData,
        consent
      }));
    }
  }, [currentStep, formData, consent]);
  const handleNext = () => {
    // Validation Logic
    if (currentStep === 6) {
      if (!consent.handbook || !consent.conduct) {
        alert("You must acknowledge all documents to proceed.");
        return;
      }
    }
    if (currentStep === 7) {
      // Step 7 logic is handled by the form submission handler
      setIsReviewing(true);
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  const handleBack = () => {
    if (isReviewing) {
      setIsReviewing(false);
      return;
    }
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  const submitApplication = async () => {
    setIsSubmitting(true);

    try {
      // 1) Upload payment proof (required)
      const file = formData.paymentFile;
      if (!file) {
        alert("Please upload proof of payment to proceed.");
        setIsSubmitting(false);
        return;
      }

      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const safeEmail = (formData.email || "unknown")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-");

      const filePath = `registrations/${Date.now()}-${safeEmail}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // 2) Insert application row with the file path
      const payload = {
        status: "pending",
        full_name: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        city: formData.city,
        emergency_name: formData.emergencyName,
        emergency_number: formData.emergencyNumber,
        nominator: formData.nominator,
        cycling_background: formData.cyclingBackground,
        payment_ref: formData.paymentRef || null,
        has_paid: true,
        payment_proof_path: filePath,
        consent_handbook: !!consent.handbook,
        consent_conduct: !!consent.conduct,
      };

      const { data, error } = await supabase
        .from("registrations")
        .insert(payload)
        .select("id")
        .single();

      if (error) throw error;

      setApplicationId(data.id);
      setCurrentStep(8);
      localStorage.removeItem(STORAGE_KEY);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert("Sorry — submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  // --- Render Steps ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gray-50 p-8 border border-gray-100">
              <h3 className="font-bold text-gray-500 text-sm uppercase mb-2">Our Mission</h3>
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-gray-900">
                “To bring together passionate cyclists through community, camaraderie, and competition. We aim to create meaningful connections, uphold excellence and integrity within our club, and nurture talent through training and teamwork—empowering every rider to rise above self and ride as one.”
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 border border-gray-100">
              <h3 className="font-bold text-gray-500 text-sm uppercase mb-2">Our Vision</h3>
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-gray-900">
                “To be recognized as a premier cycling and multisport organization that bridges community, club, and competition—fostering inclusivity, discipline, and performance. We envision TRPH as a lifelong home for riders seeking purpose, friendship, and achievement on and off the road.”
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <SectionTitle>Core Values</SectionTitle>
             
             <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-bold text-lg uppercase border-b border-black pb-2">As a Cycling Community</h4>
                  <ul className="space-y-3 text-sm">
                    <li><strong className="block">Unity</strong> We welcome riders of all levels and backgrounds.</li>
                    <li><strong className="block">Respect</strong> We value safety, sportsmanship, and mutual encouragement.</li>
                    <li><strong className="block">Fun</strong> We celebrate every ride and the friendships it builds.</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-bold text-lg uppercase border-b border-black pb-2">As a Cycling Club</h4>
                  <ul className="space-y-3 text-sm">
                    <li><strong className="block">Integrity</strong> We uphold high standards of conduct and membership.</li>
                    <li><strong className="block">Commitment</strong> We take pride in representing TRPH with loyalty and discipline.</li>
                    <li><strong className="block">Camaraderie</strong> We build trust and belonging within our close-knit group.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-lg uppercase border-b border-black pb-2">As a Competitive Team</h4>
                  <ul className="space-y-3 text-sm">
                    <li><strong className="block">Excellence</strong> We train with purpose and race with honor.</li>
                    <li><strong className="block">Growth</strong> We develop talent and push our limits together.</li>
                    <li><strong className="block">Resilience</strong> We embrace challenges as opportunities to rise stronger.</li>
                  </ul>
                </div>
             </div>
             <PDFLink title="Complete Member’s Handbook (PDF)" href={LINKS.handbook} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionTitle>Benefits of Membership</SectionTitle>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black text-white p-6">
                <h3 className="font-bold text-xl mb-4">Club Privileges</h3>
                <ul className="space-y-3 text-sm opacity-90">
                  <li className="flex gap-2"><Check className="w-4 h-4 shrink-0" /> Participation in exclusive Club rides and activities</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 shrink-0" /> Eligibility to vote and hold office (subject to good standing)</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 shrink-0" /> Priority access to Club-organized training, events, and initiatives</li>
                </ul>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-6">
                <h3 className="font-bold text-xl mb-4 text-black">Partner Discounts & Benefits</h3>
                <p className="text-xs text-gray-500 mb-4">Exclusive perks from our partners:</p>
                <div className="grid grid-cols-2 gap-2 text-sm font-medium">
                  <div>• Dans Bike Shop</div>
                  <div>• Neo Zigma</div>
                  <div>• Bistro by Leblanc</div>
                  <div>• JB Multisports</div>
                  <div>• WheyKing Nutrition</div>
                  <div>• Farsports / Elilee / Brakco</div>
                  <div>• TSB</div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 italic border-t pt-4">
              Note: Benefits are subject to continued compliance with Club rules and policies.
            </p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionTitle>Governance</SectionTitle>
            <div className="prose prose-sm max-w-none text-gray-700">
              <p className="font-medium text-black">TRPH Cycling Club, Inc. is a non-stock, non-profit corporation registered under Philippine law.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>The organization is governed by a <strong>Board of Trustees</strong> and elected <strong>Officers</strong>.</li>
                <li>Club Members in good standing have voting rights and may hold office.</li>
                <li>Membership dues, discipline, and appeals are governed strictly by the By-Laws.</li>
                <li>Amendments to the By-Laws follow formal governance procedures in accordance with applicable laws and regulations.</li>
              </ul>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionTitle>Code of Conduct</SectionTitle>
            <div className="bg-red-50 border-l-4 border-red-900 p-6">
              <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5"/> Important Standard
              </h3>
              <p className="text-sm text-red-900/80 mb-4">
                The Code of Conduct applies to all TRPH-related activities. Violations may result in disciplinary action, including suspension or removal from the club roster.
              </p>
              <ul className="space-y-2 text-sm text-red-900/80 list-disc pl-4">
                <li>Higher standards of conduct apply to Verified Club Members compared to general community members.</li>
                <li>We promote respect, safety, integrity, and sportsmanship at all times.</li>
                <li>Members have the right to due process and appeal in disciplinary proceedings.</li>
              </ul>
            </div>
            <PDFLink title="TRPH Code of Conduct (PDF)" href={LINKS.conduct} />
          </div>
        );
      case 6:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionTitle>Acknowledgment</SectionTitle>
            <p className="text-gray-600">Please affirm your understanding of the governance documents before applying.</p>
            
            <div className="space-y-4">
              {[
                { key: 'handbook', label: 'I have read and understood the TRPH Member’s Handbook.' },
                { key: 'conduct', label: 'I reaffirm my understanding of the TRPH Code of Conduct.' }
              ].map((item) => (
                <label key={item.key} className="flex items-start gap-4 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="peer h-6 w-6 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:bg-black checked:border-black"
                      checked={consent[item.key]}
                      onChange={(e) => setConsent(prev => ({...prev, [item.key]: e.target.checked}))}
                    />
                    <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none opacity-0 peer-checked:opacity-100" />
                  </div>
                  <span className="text-sm font-medium pt-0.5">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 7:
        if (isReviewing) {
          return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <SectionTitle>Review Application</SectionTitle>
               <div className="bg-gray-50 p-6 text-sm space-y-4 border border-gray-200">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Full Name</span>
                      <span className="font-medium">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">City</span>
                      <span className="font-medium">{formData.city}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Email</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Mobile</span>
                      <span className="font-medium">{formData.mobile}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Emergency Contact</span>
                      <span className="font-medium">{formData.emergencyName} ({formData.emergencyNumber})</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase">Nominator</span>
                      <span className="font-medium">{formData.nominator}</span>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-gray-200">
                    <span className="block text-gray-500 text-xs uppercase mb-1">Background</span>
                    <p className="italic text-gray-700">{formData.cyclingBackground}</p>
                 </div>
                 <div className="pt-4 border-t border-gray-200">
                    <span className="block text-gray-500 text-xs uppercase mb-1">Proof of Payment</span>
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Uploaded (Ref: {formData.paymentRef || 'N/A'})
                    </div>
                 </div>
               </div>
               <div className="space-y-4 pt-4">
                 <label className="flex items-start gap-3 cursor-pointer">
                   <input type="checkbox" className="mt-1 h-4 w-4 accent-black" checked={reviewConfirm.infoAccurate}
                     onChange={(e) =>
                       setReviewConfirm((p) => ({ ...p, infoAccurate: e.target.checked }))
                     }
                   />
                   <span className="text-xs text-gray-600">I confirm that the information provided is accurate.</span>
                 </label>
                 <label className="flex items-start gap-3 cursor-pointer">
                   <input type="checkbox" className="mt-1 h-4 w-4 accent-black" checked={reviewConfirm.agreeRules}
                     onChange={(e) =>
                       setReviewConfirm((p) => ({ ...p, agreeRules: e.target.checked }))
                     }
                   />
                   <span className="text-xs text-gray-600">I agree to comply with all TRPH rules, policies, and standards.</span>
                 </label>
               </div>
               <div className="flex flex-col gap-3">
                 <Button onClick={submitApplication} disabled={isSubmitting || !reviewConfirm.infoAccurate || !reviewConfirm.agreeRules} className="w-full">
                   {isSubmitting ? 'Submitting...' : 'Submit Final Application'}
                 </Button>
                 <Button variant="text" onClick={() => setIsReviewing(false)} disabled={isSubmitting}>
                   Edit Information
                 </Button>
               </div>
            </div>
          );
        }
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionTitle>Membership Application</SectionTitle>
            
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Full Name</label>
                  <input required type="text" className="w-full p-3 border border-gray-300 focus:border-black outline-none transition-colors" 
                    value={formData.fullName} onChange={e => updateForm('fullName', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Email Address</label>
                  <input required type="email" className="w-full p-3 border border-gray-300 focus:border-black outline-none transition-colors" 
                    value={formData.email} onChange={e => updateForm('email', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Mobile Number</label>
                  <input required type="tel" className="w-full p-3 border border-gray-300 focus:border-black outline-none transition-colors" 
                    value={formData.mobile} onChange={e => updateForm('mobile', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">City of Residence</label>
                  <input required type="text" className="w-full p-3 border border-gray-300 focus:border-black outline-none transition-colors" 
                    value={formData.city} onChange={e => updateForm('city', e.target.value)} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-4 border border-gray-100">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Emergency Contact Name</label>
                  <input required type="text" className="w-full p-3 border border-gray-300 focus:border-black outline-none transition-colors" 
                    value={formData.emergencyName} onChange={e => updateForm('emergencyName', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase">Emergency Contact Number</label>
                  <input required type="tel" className="w-full p-3 border border-gray-300 focus:border-black outline-none transition-colors" 
                    value={formData.emergencyNumber} onChange={e => updateForm('emergencyNumber', e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Endorsing Club Member (Nominator)</label>
                <input required type="text" placeholder="Name of existing member" className="w-full p-3 border border-gray-300 focus:border-black outline-none transition-colors" 
                  value={formData.nominator} onChange={e => updateForm('nominator', e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase">Cycling Background & Involvement in TRPH</label>
                <textarea required rows={4} className="w-full p-3 border border-gray-300 focus:border-black outline-none transition-colors resize-none" 
                  value={formData.cyclingBackground} onChange={e => updateForm('cyclingBackground', e.target.value)} />
              </div>
              <div className="border-t border-black pt-6 mt-8">
                <h3 className="font-bold text-lg mb-4">Membership Dues Payment</h3>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-1/3 aspect-square border border-gray-300 flex items-center justify-center bg-white">
                    <img src="/images/trph-qr.png"
                      alt="TRPH Payment QR Code"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase">Proof of Payment</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*,application/pdf"
                          className="hidden" 
                          id="file-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            // 5MB size limit
                            if (file.size > 5 * 1024 * 1024) {
                              alert("File too large. Please upload a file under 5MB.");
                              e.target.value = "";
                              updateForm("hasPaid", false);
                              updateForm("paymentFile", null);
                              return;
                            }
                            updateForm("paymentFile", file);
                            updateForm("hasPaid", true);
                          }}
                        />
                        <label htmlFor="file-upload" className={`w-full p-4 border flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors ${formData.hasPaid ? 'border-green-600 text-green-700 bg-green-50' : 'border-gray-300 text-gray-500'}`}>
                          {formData.hasPaid ? <><CheckCircle2 className="w-5 h-5"/> Uploaded Successfully</> : <><Upload className="w-5 h-5"/> Upload Screenshot/PDF</>}
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold uppercase">Reference Number (Optional)</label>
                       <input type="text" className="w-full p-3 border border-gray-300 focus:border-black outline-none transition-colors" 
                         value={formData.paymentRef} onChange={e => updateForm('paymentRef', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <Button type="submit" disabled={!formData.hasPaid} className="w-full">
                  Review Application
                </Button>
                {!formData.hasPaid && <p className="text-center text-xs text-red-500 mt-2">Please upload proof of payment to proceed.</p>}
              </div>
            </form>
          </div>
        );
      case 8:
        return (
          <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500 py-10">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold uppercase">Application Submitted</h2>
            <div className="max-w-md mx-auto space-y-4">
              <p className="text-gray-600">
                Your application has been received by the TRPH Board of Trustees.
              </p>
              <div className="bg-gray-100 p-4 rounded text-sm font-mono border border-gray-300">
                ID: {applicationId}
              </div>
              <div className="text-sm text-gray-500 space-y-2 text-left bg-gray-50 p-6 rounded-lg mt-8">
                <p className="font-bold text-black uppercase mb-2">Next Steps:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Your application will be reviewed by Club Officers.</li>
                  <li>You may be contacted for a brief interview or clarification.</li>
                  <li>Notification of approval or rejection will be sent via email.</li>
                  <li>Membership privileges activate upon final confirmation.</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 flex justify-center">
               <Button onClick={() => window.print()} variant="secondary">
                 Print / Save Application Summary
               </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-20">
      <ProgressBar currentStep={currentStep} />
      
      {/* Header */}
      <header className="fixed top-1 left-0 right-0 bg-white/95 backdrop-blur-sm z-40 border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-8 mt-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center overflow-hidden">
            {/* Logo Placeholder - In production this is <Image src="/brand/trph-logo.jpg" ... /> */}
            <span className="text-white font-bold text-xs tracking-tighter">TRPH</span>
          </div>
          <h1 className="font-bold text-sm md:text-base tracking-wide uppercase hidden md:block">TRPH Cycling Club, Inc.</h1>
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
           Step {currentStep > TOTAL_STEPS ? TOTAL_STEPS : currentStep} / {TOTAL_STEPS}
        </div>
      </header>
      {/* Main Content Area */}
      <main className="pt-24 md:pt-32 px-4 md:px-8 max-w-3xl mx-auto min-h-[60vh]">
        {renderStepContent()}
      </main>
      {/* Navigation Footer */}
      {currentStep < 8 && !isReviewing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
           <div className="max-w-3xl mx-auto flex items-center justify-between">
              <Button 
                onClick={handleBack} 
                variant="text" 
                disabled={currentStep === 1}
                className={currentStep === 1 ? 'opacity-0' : ''}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              {currentStep < 7 && (
                <Button onClick={handleNext}>
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              )}
           </div>
        </div>
      )}
      {/* Persistent Footer Links */}
      <footer className="mt-20 py-8 text-center text-xs text-gray-400 border-t border-gray-100">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
           {Object.entries(LINKS).map(([key, href]) => (
             <a key={key} href={href} className="hover:text-black hover:underline transition-colors capitalize">
               {key}
             </a>
           ))}
        </div>
        <p>&copy; {new Date().getFullYear()} TRPH Cycling Club, Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}