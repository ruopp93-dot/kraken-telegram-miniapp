import { Link } from 'react-router-dom'

const zones = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'RTX 3060 • Samsung Odyssey 240Hz',
    specs: 'Intel i5-12400F • 15 ПК',
    price: '130 ₽/час',
    available: 12,
    total: 15,
    color: '#2BE6A0'
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'RTX 4060 Ti • MSI 360Hz',
    specs: 'Intel i5-12400F • 10 ПК',
    price: '150 ₽/час',
    available: 8,
    total: 10,
    color: '#00E7D4'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'RTX 4070 • LG 27" 240Hz',
    specs: 'Intel i5-12400F • 5 ПК',
    price: '170 ₽/час',
    available: 3,
    total: 5,
    color: '#F20FFF'
  },
  {
    id: 'ps5',
    name: 'PlayStation 5',
    description: 'PS5 • Эксклюзивы PlayStation',
    specs: '2 консоли • Доп. джойстик +50₽',
    price: '200 ₽/час',
    available: 1,
    total: 2,
    color: '#FFC857'
  }
]

function ZoneSelect() {
  return (
    <div className="page">
      <div className="header">
        <Link to="/" className="header-back">← Назад</Link>
        <h1 className="header-title">Выбор зоны</h1>
        <div></div>
      </div>

      <div className="zones-list">
        {zones.map((zone) => (
          <Link
            key={zone.id}
            to={`/zone/${zone.id}`}
            className="zone-item card"
          >
            <div className="zone-content">
              <div className="zone-info">
                <h3 className="zone-name">{zone.name}</h3>
                <p className="zone-description">{zone.description}</p>
                <p className="zone-specs">{zone.specs}</p>
              </div>
              
              <div className="zone-meta">
                <div className="zone-price" style={{ fontFamily: 'var(--font-mono)' }}>
                  {zone.price}
                </div>
                <div className="zone-availability">
                  <span className={`availability-count ${zone.available === 0 ? 'unavailable' : ''}`}>
                    {zone.available}/{zone.total}
                  </span>
                  <span className="availability-label">свободно</span>
                </div>
              </div>
            </div>
            
            <div 
              className="zone-indicator" 
              style={{ backgroundColor: zone.color }}
            ></div>
          </Link>
        ))}
      </div>

      <div className="info-banner card">
        <h4>ℹ️ Информация</h4>
        <ul>
          <li>Минимальное время бронирования: 1 час</li>
          <li>Шаг бронирования: 30 минут</li>
          <li>Отмена бесплатно до начала сеанса</li>
        </ul>
      </div>

      <style>{`
        .zones-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .zone-item {
          position: relative;
          padding: 20px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .zone-item:hover {
          transform: translateY(-2px);
        }

        .zone-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .zone-info {
          flex: 1;
        }

        .zone-name {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .zone-description {
          color: var(--kraken-text-secondary);
          margin-bottom: 4px;
          font-size: 0.9rem;
        }

        .zone-specs {
          color: var(--kraken-text-muted);
          font-size: 0.85rem;
        }

        .zone-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .zone-price {
          color: var(--kraken-accent);
          font-weight: 600;
          font-size: 1.1rem;
        }

        .zone-availability {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 0.85rem;
        }

        .availability-count {
          font-weight: 600;
          color: var(--kraken-success);
        }

        .availability-count.unavailable {
          color: var(--kraken-error);
        }

        .availability-label {
          color: var(--kraken-text-muted);
          font-size: 0.75rem;
        }

        .zone-indicator {
          position: absolute;
          top: 0;
          right: 0;
          width: 4px;
          height: 100%;
          opacity: 0.8;
        }

        .info-banner {
          margin-top: 24px;
        }

        .info-banner h4 {
          margin-bottom: 12px;
          color: var(--kraken-accent);
        }

        .info-banner ul {
          margin: 0;
          padding-left: 20px;
          color: var(--kraken-text-secondary);
        }

        .info-banner li {
          margin-bottom: 4px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  )
}

export default ZoneSelect
