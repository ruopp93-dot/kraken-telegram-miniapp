import { Link, useParams } from 'react-router-dom'

const mockPCs = {
  standard: Array.from({ length: 15 }, (_, i) => ({
    id: `S-${String(i + 1).padStart(2, '0')}`,
    label: `S-${String(i + 1).padStart(2, '0')}`,
    status: i < 12 ? 'free' : i < 14 ? 'busy' : 'maintenance',
    specs: 'RTX 3060 • i5-12400F',
    monitor: 'Samsung Odyssey 25" 240Hz',
    nextAvailable: i >= 12 && i < 14 ? '14:30' : null
  })),
  vip: Array.from({ length: 10 }, (_, i) => ({
    id: `VIP-${String(i + 1).padStart(2, '0')}`,
    label: `VIP-${String(i + 1).padStart(2, '0')}`,
    status: i < 8 ? 'free' : 'busy',
    specs: 'RTX 4060 Ti • i5-12400F',
    monitor: 'MSI 25" 360Hz',
    nextAvailable: i >= 8 ? '15:00' : null
  })),
  premium: Array.from({ length: 5 }, (_, i) => ({
    id: `PR-${String(i + 1).padStart(2, '0')}`,
    label: `PR-${String(i + 1).padStart(2, '0')}`,
    status: i < 3 ? 'free' : 'busy',
    specs: 'RTX 4070 • i5-12400F',
    monitor: 'LG 27" 240Hz',
    nextAvailable: i >= 3 ? '16:00' : null
  })),
  ps5: Array.from({ length: 2 }, (_, i) => ({
    id: `PS5-${String(i + 1).padStart(2, '0')}`,
    label: `PS5-${String(i + 1).padStart(2, '0')}`,
    status: i < 1 ? 'free' : 'busy',
    specs: 'PlayStation 5',
    monitor: 'Игровая консоль',
    nextAvailable: i >= 1 ? '17:30' : null
  }))
}

const zoneNames = {
  standard: 'Standard',
  vip: 'VIP',
  premium: 'Premium',
  ps5: 'PlayStation 5'
}

function PcList() {
  const { zoneId } = useParams<{ zoneId: string }>()
  const pcs = mockPCs[zoneId as keyof typeof mockPCs] || []
  const zoneName = zoneNames[zoneId as keyof typeof zoneNames] || 'Неизвестная зона'

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'free': return '🟢'
      case 'busy': return '🔴'
      case 'maintenance': return '🟡'
      default: return '⚪'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'free': return 'Свободен'
      case 'busy': return 'Занят'
      case 'maintenance': return 'Тех. работы'
      default: return 'Неизвестно'
    }
  }

  return (
    <div className="page">
      <div className="header">
        <Link to="/zones" className="header-back">← Назад</Link>
        <h1 className="header-title">{zoneName}</h1>
        <div></div>
      </div>

      <div className="zone-summary card">
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-number">{pcs.filter(pc => pc.status === 'free').length}</span>
            <span className="stat-label">свободно</span>
          </div>
          <div className="stat">
            <span className="stat-number">{pcs.filter(pc => pc.status === 'busy').length}</span>
            <span className="stat-label">занято</span>
          </div>
          <div className="stat">
            <span className="stat-number">{pcs.filter(pc => pc.status === 'maintenance').length}</span>
            <span className="stat-label">тех. работы</span>
          </div>
        </div>
      </div>

      <div className="pc-grid">
        {pcs.map((pc) => (
          <div key={pc.id} className="pc-card-wrapper">
            {pc.status === 'free' ? (
              <Link to={`/booking/${pc.id}`} className="pc-card card">
                <div className="pc-header">
                  <div className="pc-label">{pc.label}</div>
                  <div className="pc-status">
                    <span className="status-icon">{getStatusIcon(pc.status)}</span>
                    <span className="status-text status-free">{getStatusText(pc.status)}</span>
                  </div>
                </div>
                <div className="pc-specs">
                  <p className="spec-line">{pc.specs}</p>
                  <p className="spec-line monitor">{pc.monitor}</p>
                </div>
              </Link>
            ) : (
              <div className="pc-card card disabled">
                <div className="pc-header">
                  <div className="pc-label">{pc.label}</div>
                  <div className="pc-status">
                    <span className="status-icon">{getStatusIcon(pc.status)}</span>
                    <span className={`status-text status-${pc.status}`}>{getStatusText(pc.status)}</span>
                  </div>
                </div>
                <div className="pc-specs">
                  <p className="spec-line">{pc.specs}</p>
                  <p className="spec-line monitor">{pc.monitor}</p>
                  {pc.nextAvailable && (
                    <p className="next-available">Свободен с {pc.nextAvailable}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .zone-summary {
          margin-bottom: 24px;
        }

        .summary-stats {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 600;
          font-family: var(--font-mono);
          color: var(--kraken-accent);
        }

        .stat-label {
          font-size: 0.85rem;
          color: var(--kraken-text-secondary);
        }

        .pc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .pc-card {
          padding: 16px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .pc-card:hover {
          transform: translateY(-2px);
        }

        .pc-card.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pc-card.disabled:hover {
          transform: none;
        }

        .pc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .pc-label {
          font-size: 1.125rem;
          font-weight: 600;
          font-family: var(--font-mono);
        }

        .pc-status {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-icon {
          font-size: 0.9rem;
        }

        .status-text {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .pc-specs {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .spec-line {
          font-size: 0.9rem;
          color: var(--kraken-text-secondary);
          margin: 0;
        }

        .spec-line.monitor {
          color: var(--kraken-text-muted);
          font-size: 0.8rem;
        }

        .next-available {
          font-size: 0.8rem;
          color: var(--kraken-warning);
          margin: 4px 0 0 0;
          font-family: var(--font-mono);
        }

        @media (max-width: 768px) {
          .pc-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default PcList
