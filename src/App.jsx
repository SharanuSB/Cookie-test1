import './App.css'
import CookieBanner from './CookieBanner'

function App() {
  return (
    <div className="app">
      <h1>DPDP Act Consent Management System</h1>
      <p className="subtitle">Protecting Your Digital Privacy Rights</p>

      <main className="main-content">
        <section className="content-section">
          <div className="section-icon">📜</div>
          <h2>About DPDP Act</h2>
          <p>
            The Digital Personal Data Protection (DPDP) Act, 2023 is India's comprehensive data protection law 
            that governs the processing of digital personal data. It establishes a framework for protecting 
            personal data while ensuring individuals' rights and promoting responsible data handling practices.
          </p>
        </section>

        <section className="content-section">
          <div className="section-icon">🔒</div>
          <h2>Key Features of Our Consent Management System</h2>
          <ul className="features-list">
            <li>Transparent data collection practices</li>
            <li>Granular consent options for different types of data processing</li>
            <li>Easy-to-understand privacy notices</li>
            <li>User-friendly consent management interface</li>
            <li>Real-time consent tracking and management</li>
            <li>Compliance with DPDP Act requirements</li>
          </ul>
        </section>

        <section className="content-section">
          <div className="section-icon">⚖️</div>
          <h2>Your Rights Under DPDP Act</h2>
          <ul className="rights-list">
            <li>Right to access your personal data</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to erasure of personal data</li>
            <li>Right to withdraw consent</li>
            <li>Right to grievance redressal</li>
            <li>Right to nominate a representative</li>
          </ul>
        </section>

        <section className="content-section">
          <div className="section-icon">🛡️</div>
          <h2>How We Protect Your Data</h2>
          <p>
            Our consent management system ensures that your personal data is:
          </p>
          <ul className="protection-list">
            <li>Collected only for specified purposes</li>
            <li>Processed lawfully and fairly</li>
            <li>Stored securely with appropriate safeguards</li>
            <li>Retained only for necessary duration</li>
            <li>Protected against unauthorized access</li>
          </ul>
        </section>
      </main>

      <CookieBanner />
    </div>
  )
}

export default App
