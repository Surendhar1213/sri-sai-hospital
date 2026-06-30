import './Doctors.css';
import PageBanner from '../PageBanner/PageBanner';

// ── Placeholder image imports (replace with real paths) ──────
import drAnuradhaImg    from '../../assets/Doctors/Doctors.png';
import drJayashreeImg   from '../../assets/Doctors/Doctors.png';
import drArunkarthickImg from '../../assets/Doctors/Doctors.png';

interface Doctor {
  id: number;
  name: string;
  credentials: string | null;
  role: string;
  centre: string | null;
  expertiseLabel: string;
  expertise: string[];
  image: string;
}

// ── Data ─────────────────────────────────────────────────────
const specialists: Doctor[] = [
  {
    id: 1,
    name: 'Dr. R. Anuradha',
    credentials: 'MD, DGO',
    role: 'Senior Obstetrician & Gynecologist',
    centre: null,
    expertiseLabel: 'Areas of Expertise',
    expertise: [
      'High-Risk Pregnancy',
      'Infertility Treatment',
      'PCOS Management',
      'Menopause Care',
      "Women's Wellness",
      'Pelvic Floor Disorders',
    ],
    image: drAnuradhaImg,
  },
  {
    id: 2,
    name: 'Dr. R. Jayashree',
    credentials: null,
    role: 'Consultant Dermatologist & Cosmetologist',
    centre: 'Coimbatore Centre',
    expertiseLabel: 'Special Interests',
    expertise: [
      'Acne Management',
      'Laser Hair Removal',
      'Skin Lightening Therapy',
      'Anti-Aging Treatments',
      'Pigmentation Correction',
    ],
    image: drJayashreeImg,
  },
  {
    id: 3,
    name: 'Dr. R. Arunkarthick',
    credentials: null,
    role: 'Consultant Dermatologist & Aesthetic Specialist',
    centre: 'Coimbatore Centre',
    expertiseLabel: 'Special Interests',
    expertise: [
      'Laser Treatments',
      'Tattoo Removal',
      'Hair Restoration Solutions',
      'Skin Rejuvenation',
      'Cosmetic Dermatology',
    ],
    image: drArunkarthickImg,
  },
];

// ── Sub-components ────────────────────────────────────────────

interface DoctorCardProps {
  doctor: Doctor;
  index: number;
}

function DoctorCard({ doctor, index }: DoctorCardProps) {
  return (
    <div
      className="doctors-card"
      style={{ animationDelay: `${0.10 + index * 0.14}s` }}
    >
      {/* Photo */}
      <div className="doctors-photo-wrap">
        <img
          src={doctor.image}
          alt={`Portrait of ${doctor.name}`}
          className="doctors-photo"
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />

        <div className="doctors-photo-overlay" aria-hidden="true" />

        {doctor.centre && (
          <span className="doctors-centre-badge">{doctor.centre}</span>
        )}
      </div>

      {/* Body */}
      <div className="doctors-card-body">
        {/* Name & role */}
        <div>
          <h3 className="doctors-name">{doctor.name}</h3>
          {doctor.credentials && (
            <p className="doctors-credentials">{doctor.credentials}</p>
          )}
          <p className="doctors-role">{doctor.role}</p>
        </div>

        {/* Gold separator */}
        <div className="doctors-card-sep" aria-hidden="true" />

        {/* Expertise tags */}
        <div>
          <p className="doctors-expertise-label">{doctor.expertiseLabel}</p>
          <div className="doctors-tags">
            {doctor.expertise.map((item) => (
              <span key={item} className="doctors-tag">
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────

export default function Doctors() {
  return (
    <>
      <PageBanner title="Doctors" />
    <section className="doctors-section" aria-labelledby="doctors-heading">
      {/* Ambient background */}
      <div className="doctors-bg-texture" aria-hidden="true" />

      <div className="container doctors-container">

        {/* Section Header */}
        <div className="doctors-header section-title">

          <h2 className="doctors-heading" id="doctors-heading">
            Meet Our <em>Specialists</em>
          </h2>

          {/* Ornamental divider */}
          <div className="doctors-divider" aria-hidden="true">
            <span className="doctors-divider-line" />
            <span className="doctors-divider-diamond" />
            <span className="doctors-divider-line" />
          </div>
        </div>

        {/* Cards */}
        <div className="doctors-grid">
          {specialists.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
          ))}
        </div>

      </div>
    </section>
    </>
  );
}
