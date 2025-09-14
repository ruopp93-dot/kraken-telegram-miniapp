import { Link } from 'react-router-dom'
import WebApp from '@twa-dev/sdk'

const zones = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'RTX 3060 • 15 ПК',
    price: '130 ₽/час',
    color: '#2BE6A0'
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'RTX 4060 Ti • 10 ПК',
    price: '150 ₽/час',
    color: '#00E7D4'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'RTX 4070 • 5 ПК',
    price: '170 ₽/час',
    color: '#F20FFF'
  },
  {
    id: 'ps5',
    name: 'PlayStation 5',
    description: 'PS5 • 2 консоли',
    price: '200 ₽/час',
    color: '#FFC857'
  }
]

function Home() {
  const user = WebApp.initDataUnsafe?.user

  return (
    <div className="page">
      {/* Header with logo */}
      <div className="home-header">
        <img src="/kraken-logo.png" alt="KRAKEN" className="logo" />
        <h1 className="title">КРАКЕН</h1>
        <p className="subtitle">КИБЕР АРЕНА</p>
        {user && (
          <p className="welcome">Привет, {user.first_name}! 👋</p>
        )}
      </div>

      {/* Quick booking button */}
      <Link to="/zones" className="btn btn-primary quick-book">
        🎮 Забронировать сейчас
      </Link>

      {/* Zones grid */}
      <div className="zones-grid">
        <h2 className="section-title">Выберите зону</h2>
        {zones.map((zone) => (
          <Link
            key={zone.id}
            to={`/zone/${zone.id}`}
            className="zone-card card"
            style={{ '--zone-color': zone.color } as React.CSSProperties}
          >
            <div className="zone-header">
              <h3 className="zone-name">{zone.name}</h3>
              <span className="zone-price" style={{ fontFamily: 'var(--font-mono)' }}>
                {zone.price}
              </span>
            </div>
            <p className="zone-description">{zone.description}</p>
            <div className="zone-indicator" style={{ backgroundColor: zone.color }}></div>
          </Link>
        ))}
      </div>

      {/* Info section */}
      <div className="info-section">
        <div className="info-card card">
          <h3>📍 Великий Новгород</h3>
          <p>Современные игровые компьютеры</p>
          <p>Бронирование от 1 часа</p>
        </div>
      </div>

      <style jsx>{`
        .home-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo {
          width: 80px;
          height: 80px;
          margin-bottom: 16px;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 600;
          background: linear-gradient(135deg, var(--kraken-accent), var(--kraken-status));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .subtitle {
          font-size: 1rem;
          color: var(--kraken-text-secondary);
          letter-spacing: 2px;
          margin-bottom: 16px;
        }

        .welcome {
          color: var(--kraken-accent);
          font-weight: 500;
        }

        .quick-book {
          width: 100%;
          margin-bottom: 32px;
          font-size: 1.125rem;
          padding: 16px;
        }

        .section-title {
          margin-bottom: 20px;
          color: var(--kraken-text-primary);
        }

        .zones-grid {
          display: grid;
          gap: 16px;
          margin-bottom: 32px;
        }

        .zone-card {
          position: relative;
          padding: 20px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .zone-card:hover {
          transform: translateY(-2px);
        }

        .zone-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .zone-name {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .zone-price {
          color: var(--kraken-accent);
          font-weight: 500;
        }

        .zone-description {
          color: var(--kraken-text-secondary);
          margin-bottom: 12px;
        }

        .zone-indicator {
          position: absolute;
          top: 0;
          right: 0;
          width: 4px;
          height: 100%;
          opacity: 0.8;
        }

        .info-section {
          margin-top: 32px;
        }

        .info-card h3 {
          margin-bottom: 12px;
          color: var(--kraken-accent);
        }

        .info-card p {
          color: var(--kraken-text-secondary);
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  )
}

export default Home
