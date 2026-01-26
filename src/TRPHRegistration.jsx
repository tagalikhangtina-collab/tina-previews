import React, { useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Shield,
  Users,
  Trophy,
  FileText,
  AlertCircle,
  Bike,
  UserCheck,
  Building,
  Download,
  Upload,
  CreditCard,
} from "lucide-react";

// --- Constants & Content Data ---
const MEMBERSHIP_TIERS = {
  COMMUNITY: "community",
  CLUB: "club",
  TEAM: "team",
};

const DOCUMENTS = {
  HANDBOOK: { name: "TRPH Cycling Club Handbook.pdf", url: "#" },
  BYLAWS: { name: "TRPH_Bylaws_SEC_Form_101_NS.pdf", url: "#" },
  COC: { name: "TRPH CODE OF CONDUCT.pdf", url: "#" },
};

const STEPS = [
  { id: 1, title: "Welcome", icon: Bike },
  { id: 2, title: "Membership", icon: Users },
  { id: 3, title: "Governance", icon: Building },
  { id: 4, title: "Code of Conduct", icon: Shield },
  { id: 5, title: "Undertaking", icon: UserCheck },
  { id: 6, title: "Application", icon: FileText },
  { id: 7, title: "Review", icon: Check },
];

// --- Components ---
const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
}) => {
  const baseStyle =
    "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg",
    secondary:
      "bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-900 hover:bg-slate-50",
    outline:
      "bg-transparent text-slate-600 hover:text-slate-900 border border-transparent hover:border-slate-200",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      type="button"
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "", selected = false, onClick }) => (
  <div
    onClick={onClick}
    className={[
      "bg-white rounded-xl p-6 border-2 transition-all duration-200",
      onClick ? "cursor-pointer hover:shadow-md" : "",
      selected
        ? "border-slate-900 shadow-lg ring-1 ring-slate-900"
        : "border-slate-100 shadow-sm",
      className,
    ].join(" ")}
  >
    {children}
  </div>
);

const Checkbox = ({ id, label, checked, onChange, required = false }) => (
  <div
    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
    onClick={() => onChange(!checked)}
  >
    <div
      className={[
        "mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
        checked ? "bg-slate-900 border-slate-900" : "border-slate-300 bg-white",
      ].join(" ")}
    >
      {checked && <Check size={14} className="text-white" />}
    </div>

    <label
      htmlFor={id}
      className="text-slate-700 text-sm leading-relaxed cursor-pointer select-none"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  </div>
);

const DocumentDownload = ({ title, filename, variant = "default" }) => (
  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      alert(`Downloading: ${filename}`);
    }}
    className={[
      "flex items-center justify-between p-3 rounded-lg border transition-all group",
      variant === "highlight"
        ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
        : "bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900",
    ].join(" ")}
  >
    <div className="flex items-center gap-3">
      <FileText size={18} />
      <span className="font-medium text-sm">{title}</span>
    </div>
    <Download
      size={16}
      className="opacity-0 group-hover:opacity-100 transition-opacity"
    />
  </a>
);

const StepIndicator = ({ currentStep }) => (
  <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-10 hidden md:block">
    <div className="max-w-4xl mx-auto px-6 py-4">
      <div className="flex justify-between items-center relative">
        {/* Progress Bar Background */}
        <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-10" />
        {/* Progress Bar Fill */}
        <div
          className="absolute left-0 top-1/2 h-1 bg-slate-900 -z-10 transition-all duration-500 ease-in-out"
          style={{
            width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 bg-white px-2"
            >
              <div
                className={[
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white scale-110"
                    : "",
                  isCompleted
                    ? "border-slate-900 bg-white text-slate-900"
                    : "",
                  !isActive && !isCompleted
                    ? "border-slate-200 text-slate-300"
                    : "",
                ].join(" ")}
              >
                <Icon size={18} />
              </div>

              <span
                className={[
                  "text-xs font-medium transition-colors",
                  isActive || isCompleted ? "text-slate-900" : "text-slate-300",
                ].join(" ")}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const MobileStepIndicator = ({ currentStep }) => (
  <div className="md:hidden bg-slate-900 text-white p-4 sticky top-0 z-10 shadow-md">
    <div className="flex items-center justify-between">
      <span className="font-semibold text-sm">
        Step {currentStep} of {STEPS.length}
      </span>
      <span className="text-sm opacity-80">{STEPS[currentStep - 1].title}</span>
    </div>
    <div className="w-full bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
      <div
        className="bg-white h-full transition-all duration-300"
        style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
      />
    </div>
  </div>
);

// --- Main Application ---
export default function TRPHRegistration() {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    tier: "",
    agreements: {
      governance: false,
      coc: false,
      handbook: false,
      discipline: false,
      ignorance: false,
    },
    personal: {
      fullName: "",
      email: "",
      phone: "",
      emergencyName: "",
      emergencyContact: "",
      nominator: "", // Club only
      clubStatus: "", // Team only
      stravaLink: "",
      paymentProof: "", // Payment file name
    },
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 7));
    scrollToTop();
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const updateFormData = (section, field, value) => {
    setFormData((prev) => {
      if (section === "tier") {
        return { ...prev, tier: value };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    });
  };

  // --- Step Content Renderers ---
  const renderStep1_Welcome = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-4">
        {/* Logo Image in Welcome Screen */}
        <div className="w-32 h-32 mx-auto mb-6 shadow-xl rounded-2xl overflow-hidden bg-white flex items-center justify-center">
          <img
            src="F6108385-3CBC-429C-A40E-97CE1119596C.jpeg"
            alt="TRPH Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const next = e.currentTarget.nextSibling;
              if (next && next.style) next.style.display = "flex";
            }}
          />
          <div className="w-full h-full bg-slate-900 items-center justify-center hidden">
            <Bike size={48} className="text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Welcome to TRPH
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          The official registration portal for the TRPH Cycling Club, Inc.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-12">
        <Card className="bg-slate-50 border-none">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Users className="text-slate-700" size={20} /> Our Mission
          </h3>
          <p className="text-slate-600 leading-relaxed">
            To bring together passionate cyclists through community, camaraderie,
            and competition. We empower every rider to rise above self and ride as
            one.
          </p>
        </Card>

        <Card className="bg-slate-50 border-none">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Trophy className="text-slate-700" size={20} /> Our Vision
          </h3>
          <p className="text-slate-600 leading-relaxed">
            To be a premier cycling and multisport organization that bridges
            community, club, and competition—fostering inclusivity, discipline,
            and performance.
          </p>
        </Card>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-center font-bold text-slate-900">Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Community
            </div>
            <div className="font-medium text-slate-800">Unity • Respect • Fun</div>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Club
            </div>
            <div className="font-medium text-slate-800">
              Integrity • Commitment • Camaraderie
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white border border-slate-100 shadow-sm">
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Team
            </div>
            <div className="font-medium text-slate-800">
              Excellence • Growth • Resilience
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={handleNext} className="w-full md:w-auto text-lg px-12">
          Start Registration Journey <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );

  const renderStep2_Membership = () => (
    <div className="space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Club Membership Application
        </h2>
        <p className="text-slate-600 mt-2">
          You are currently a member of the{" "}
          <span className="font-semibold">Cycling Community</span>. Take the next
          step to become a verified Club Member.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Community Tier - Current Status */}
        <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200 opacity-75 relative">
          <div className="absolute top-4 right-4 bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Current Status
          </div>

          <div className="mb-4 text-slate-400">
            <Users size={48} />
          </div>

          <h3 className="text-xl font-bold text-slate-700 mb-2">
            Cycling Community
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Open participation and social riding.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex gap-2 text-sm text-slate-500">
              <Check size={16} /> Open to all riders
            </li>
            <li className="flex gap-2 text-sm text-slate-500">
              <Check size={16} /> Social riding focus
            </li>
          </ul>
        </div>

        {/* Club Tier - Target */}
        <Card
          selected={formData.tier === MEMBERSHIP_TIERS.CLUB}
          onClick={() => updateFormData("tier", "", MEMBERSHIP_TIERS.CLUB)}
          className="relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer border-indigo-200 hover:border-indigo-500"
        >
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={100} className="text-indigo-900" />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
              Upgrade Application
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">Cycling Club</h3>

            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex gap-2 text-sm text-slate-600">
                <Check size={16} className="text-green-500 mt-0.5" /> Official
                Verification
              </li>
              <li className="flex gap-2 text-sm text-slate-600">
                <Check size={16} className="text-green-500 mt-0.5" /> Voting Rights
              </li>
              <li className="flex gap-2 text-sm text-slate-600">
                <Check size={16} className="text-green-500 mt-0.5" /> Exclusive
                Benefits
              </li>
            </ul>

            <div className="text-center py-2 bg-indigo-50 text-indigo-700 rounded text-sm font-bold">
              Php 2,000.00 / year
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 mt-6 max-w-3xl mx-auto">
        <Trophy className="text-amber-600 flex-shrink-0" size={20} />
        <p className="text-sm text-amber-800">
          <strong>Note on Competitive Team:</strong> Recruitment for the Competitive
          Team is based strictly on performance selection and invitation by Team
          Leads. It is not available for direct application here.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft size={20} /> Back
        </Button>
        <Button onClick={handleNext} disabled={!formData.tier}>
          Continue to Governance <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );

  const renderStep3_Governance = () => (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Governance & By-Laws</h2>
        <p className="text-slate-600 mt-2">
          Understanding the structure of our organization.
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <h3 className="font-bold text-slate-900 mb-2">Legal Status</h3>
          <p className="text-sm text-slate-600">
            TRPH is registered with the SEC as a non-stock, non-profit corporation.
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-bold text-slate-900 mb-2">Governance</h3>
            <p className="text-sm text-slate-600">
              Managed by a Board of Directors and elected Officers (President, VP,
              Secretary, Treasurer).
            </p>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-900 mb-2">Voting Rights</h3>
            <p className="text-sm text-slate-600">
              Only{" "}
              <span className="font-semibold text-slate-900">
                Cycling Club Members
              </span>{" "}
              in good standing may vote or be elected. Community members do not
              have voting rights.
            </p>
          </Card>
        </div>

        <Card>
          <h3 className="font-bold text-slate-900 mb-2">Discipline & Appeals</h3>
          <p className="text-sm text-slate-600 mb-3">
            The Board has authority to suspend or expel members for cause. Removed
            members have the right to appeal in writing within 30 days.
          </p>
          <div className="bg-slate-50 p-3 rounded text-sm text-slate-500 italic">
            Full details are available in the official By-Laws document.
          </div>
        </Card>
      </div>

      <div className="pt-4 border-t border-slate-200 mt-6">
        <div className="mb-6">
          <DocumentDownload
            title="Download Full TRPH By-Laws (SEC Form 101-NS)"
            filename={DOCUMENTS.BYLAWS.name}
            variant="highlight"
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <Checkbox
            id="gov-check"
            label="I have read and understood the Governance structure of TRPH."
            checked={formData.agreements.governance}
            onChange={(checked) => updateFormData("agreements", "governance", checked)}
            required
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft size={20} /> Back
        </Button>
        <Button onClick={handleNext} disabled={!formData.agreements.governance}>
          Accept & Continue <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );

  const renderStep4_CoC = () => (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900">Code of Conduct</h2>
        <p className="text-slate-600 mt-2">Non-negotiable behavioral standards.</p>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <Shield size={18} /> Official TRPH Conduct Policy
          </h3>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("Downloading Code of Conduct");
            }}
            className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium"
          >
            <Download size={12} /> Save PDF
          </a>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 leading-relaxed scrollbar-thin">
          <section>
            <h4 className="font-bold text-slate-900 mb-2">1. Scope & Application</h4>
            <p>
              This Code applies to ALL activities: group rides, training sessions,
              races, online platform interactions, and partner engagements.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 mb-2">
              2. Non-Negotiable Standards
            </h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Safety:</strong> Ride responsibly at all times. Follow traffic
                rules and ride leader instructions implicitly.
              </li>
              <li>
                <strong>Respect:</strong> Zero tolerance for harassment, intimidation,
                or discrimination of any kind.
              </li>
              <li>
                <strong>Integrity:</strong> Do not engage in behavior that damages
                TRPH's reputation or undermines leadership.
              </li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 mb-2">
              3. Tier-Specific Expectations
            </h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-semibold">Community:</span> Focus on safe riding
                and inclusivity.
              </li>
              <li>
                <span className="font-semibold">Club:</span> Must act as role models,
                adhere strictly to protocols, and use benefits ethically.
              </li>
              <li>
                <span className="font-semibold">Team:</span> Highest standard of
                professionalism, consistent training, sportsmanship, and brand
                integrity.
              </li>
            </ul>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 mb-2">4. Disciplinary Actions</h4>
            <p>
              Violations may result in warnings, suspension, loss of benefits, or
              expulsion. Serious offenses (e.g., reckless riding, public disparagement)
              face immediate review.
            </p>
          </section>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 p-6">
          <div className="mb-4">
            <DocumentDownload
              title="Download TRPH Code of Conduct (PDF)"
              filename={DOCUMENTS.COC.name}
            />
          </div>

          <Checkbox
            id="coc-check"
            label="I acknowledge the TRPH Code of Conduct and agree to be bound by its standards."
            checked={formData.agreements.coc}
            onChange={(checked) => updateFormData("agreements", "coc", checked)}
            required
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft size={20} /> Back
        </Button>
        <Button onClick={handleNext} disabled={!formData.agreements.coc}>
          Acknowledge & Continue <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );

  const renderStep5_Undertaking = () => (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-slate-900 rounded-full mx-auto flex items-center justify-center mb-4">
          <UserCheck size={32} className="text-white" />
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          Acknowledgment & Undertaking
        </h2>
        <p className="text-slate-600 mt-2">
          Please confirm your understanding to proceed to the application.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-6">
          <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
            <FileText size={16} /> Reference Documents
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Please ensure you have downloaded and read these documents before
            proceeding.
          </p>

          <div className="space-y-2">
            <DocumentDownload
              title="Member's Handbook"
              filename={DOCUMENTS.HANDBOOK.name}
            />
            <DocumentDownload
              title="By-Laws (SEC Form 101-NS)"
              filename={DOCUMENTS.BYLAWS.name}
            />
            <DocumentDownload
              title="Code of Conduct"
              filename={DOCUMENTS.COC.name}
            />
          </div>
        </div>

        <p className="text-slate-800 font-medium mb-4">
          By submitting this application, I officially acknowledge the following:
        </p>

        <Checkbox
          id="handbook-check"
          label="I have received access to and reviewed the Member’s Handbook, By-Laws, and Code of Conduct."
          checked={formData.agreements.handbook}
          onChange={(checked) => updateFormData("agreements", "handbook", checked)}
          required
        />

        <Checkbox
          id="discipline-check"
          label="I agree to comply with all rules and understand that failure to do so may result in disciplinary action (suspension or termination)."
          checked={formData.agreements.discipline}
          onChange={(checked) => updateFormData("agreements", "discipline", checked)}
          required
        />

        <Checkbox
          id="ignorance-check"
          label="I understand that ignorance of the rules does not exempt me from accountability."
          checked={formData.agreements.ignorance}
          onChange={(checked) => updateFormData("agreements", "ignorance", checked)}
          required
        />

        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
          I also accept that membership is non-transferable and subject to Board approval.
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft size={20} /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            !formData.agreements.handbook ||
            !formData.agreements.discipline ||
            !formData.agreements.ignorance
          }
        >
          Proceed to Application <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );

  const renderStep6_Application = () => (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Membership Application</h2>

        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-700">
          Applying for:{" "}
          <span className="uppercase text-slate-900 font-bold">{formData.tier}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 border-b pb-2 mb-4">
            Personal Information
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                value={formData.personal.fullName}
                onChange={(e) =>
                  updateFormData("personal", "fullName", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                value={formData.personal.email}
                onChange={(e) =>
                  updateFormData("personal", "email", e.target.value)
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              value={formData.personal.phone}
              onChange={(e) =>
                updateFormData("personal", "phone", e.target.value)
              }
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 border-b pb-2 mb-4">
            Emergency Contact
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                value={formData.personal.emergencyName}
                onChange={(e) =>
                  updateFormData("personal", "emergencyName", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                value={formData.personal.emergencyContact}
                onChange={(e) =>
                  updateFormData("personal", "emergencyContact", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Tier Specific Fields */}
        {formData.tier === MEMBERSHIP_TIERS.CLUB && (
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm space-y-6">
            <h3 className="font-bold text-indigo-900 border-b border-indigo-200 pb-2 mb-4 flex items-center gap-2">
              <Shield size={18} /> Club Requirements
            </h3>

            <div>
              <label className="block text-sm font-medium text-indigo-900 mb-1">
                Nominator Name (Existing Club Member)
              </label>
              <input
                type="text"
                placeholder="Enter name of sponsoring member"
                className="w-full p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-900 focus:border-transparent"
                value={formData.personal.nominator}
                onChange={(e) =>
                  updateFormData("personal", "nominator", e.target.value)
                }
              />
            </div>

            <div className="border-t border-indigo-200 pt-4">
              <h4 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} /> Membership Dues Payment
              </h4>

              <div className="grid md:grid-cols-2 gap-6">
                {/* QR Code Section */}
                <div className="bg-white p-4 rounded-lg border border-indigo-200 flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-indigo-500 font-bold uppercase tracking-wide mb-2">
                    Scan to Pay (GCash/Maya)
                  </p>

                  <div className="w-48 h-48 bg-slate-900 rounded-lg flex items-center justify-center mb-2 relative overflow-hidden group">
                    <div className="absolute inset-2 border-4 border-white border-dashed opacity-50" />
                    <span className="text-white text-xs font-mono opacity-70">
                      QR CODE PLACEHOLDER
                    </span>
                  </div>

                  <p className="text-sm font-bold text-indigo-900">
                    Amount: Php 2,000.00
                  </p>
                </div>

                {/* Upload Section */}
                <div className="flex flex-col justify-center">
                  <label className="block text-sm font-medium text-indigo-900 mb-2">
                    Upload Proof of Payment
                  </label>

                  <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 bg-white hover:bg-indigo-50 transition-colors text-center cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="payment-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) updateFormData("personal", "paymentProof", file.name);
                      }}
                    />

                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      <Upload size={24} className="text-indigo-400" />
                      <span className="text-sm text-indigo-600 font-medium">
                        {formData.personal.paymentProof
                          ? formData.personal.paymentProof
                          : "Click to upload image"}
                      </span>
                      <span className="text-xs text-indigo-400">JPG, PNG (Max 5MB)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {formData.tier === MEMBERSHIP_TIERS.TEAM && (
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 shadow-sm space-y-4">
            <h3 className="font-bold text-amber-900 border-b border-amber-200 pb-2 mb-4 flex items-center gap-2">
              <Trophy size={18} /> Competitive Team Requirements
            </h3>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-1">
                Current Club Status
              </label>

              <select
                className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                value={formData.personal.clubStatus}
                onChange={(e) =>
                  updateFormData("personal", "clubStatus", e.target.value)
                }
              >
                <option value="">Select Status...</option>
                <option value="active">Active Club Member in Good Standing</option>
                <option value="pending">Club Application Pending</option>
                <option value="none">Not a Club Member (Not Eligible)</option>
              </select>
            </div>

            <div className="bg-white bg-opacity-60 p-4 rounded text-sm text-amber-800">
              <strong>Selection Process:</strong> Your application will be forwarded to the
              Team Leads for performance assessment.
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 border-b pb-2 mb-4">
            Social Connectivity
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Strava / Social Profile Link
            </label>

            <input
              type="url"
              placeholder="https://..."
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              value={formData.personal.stravaLink}
              onChange={(e) =>
                updateFormData("personal", "stravaLink", e.target.value)
              }
            />

            <p className="text-xs text-slate-500 mt-1">Used for verification purposes.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ChevronLeft size={20} /> Back
        </Button>
        <Button onClick={handleNext}>
          Submit Application <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );

  const renderStep7_Review = () => (
    <div className="space-y-8 animate-fadeIn max-w-2xl mx-auto text-center py-10">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-6 animate-bounce">
        <Check size={48} />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Application Submitted
        </h2>
        <p className="text-lg text-slate-600">
          Thank you,{" "}
          <span className="font-semibold text-slate-900">
            {formData.personal.fullName}
          </span>
          . Your application for{" "}
          <span className="font-bold uppercase">{formData.tier}</span> membership has
          been received.
        </p>
      </div>

      <Card className="bg-slate-50 border-slate-200 text-left">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle size={20} /> What Happens Next?
        </h3>

        {formData.tier === MEMBERSHIP_TIERS.COMMUNITY && (
          <p className="text-slate-700 mb-2">
            Welcome to the Community! You will receive an email shortly with links to
            our public Viber community and ride schedules.
          </p>
        )}

        {formData.tier === MEMBERSHIP_TIERS.CLUB && (
          <ul className="list-disc pl-5 text-slate-700 space-y-2">
            <li>Officers will review your application and verify your nomination.</li>
            <li>Your payment proof will be verified by the Treasurer.</li>
            <li>Membership becomes active upon final Board approval.</li>
          </ul>
        )}

        {formData.tier === MEMBERSHIP_TIERS.TEAM && (
          <ul className="list-disc pl-5 text-slate-700 space-y-2">
            <li>Your profile has been forwarded to Team Leads.</li>
            <li>You may be contacted for a performance assessment or interview.</li>
            <li>Final selection is subject to Team Management approval.</li>
          </ul>
        )}
      </Card>

      <p className="text-sm text-slate-500">
        You will receive a confirmation email at{" "}
        <strong>{formData.personal.email}</strong>.
      </p>

      <div className="pt-8">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Return to Home
        </Button>
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 md:static">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex items-center justify-center">
              {/* HEADER LOGO */}
              <img
                src="F6108385-3CBC-429C-A40E-97CE1119596C.jpeg"
                alt="TRPH Logo"
                className="h-12 w-auto object-contain mr-3"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const next = e.currentTarget.nextSibling;
                  if (next && next.style) next.style.display = "flex";
                }}
              />

              <div className="hidden items-center justify-center bg-slate-900 rounded-md w-8 h-8 mr-2">
                <Bike size={18} className="text-white" />
              </div>
            </div>

            <span>
              TRPH <span className="text-slate-400 font-normal">Registration</span>
            </span>
          </div>

          {currentStep < 7 && (
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden md:block">
              Step {currentStep} of {STEPS.length}
            </div>
          )}
        </div>
      </header>

      {/* Progress Indicators */}
      {currentStep < 7 && (
        <>
          <StepIndicator currentStep={currentStep} />
          <MobileStepIndicator currentStep={currentStep} />
        </>
      )}

      {/* Content Area */}
      <main className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        {currentStep === 1 && renderStep1_Welcome()}
        {currentStep === 2 && renderStep2_Membership()}
        {currentStep === 3 && renderStep3_Governance()}
        {currentStep === 4 && renderStep4_CoC()}
        {currentStep === 5 && renderStep5_Undertaking()}
        {currentStep === 6 && renderStep6_Application()}
        {currentStep === 7 && renderStep7_Review()}
      </main>
    </div>
  );
}