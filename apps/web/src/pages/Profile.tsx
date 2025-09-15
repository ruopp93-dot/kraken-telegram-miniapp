import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import WebApp from '@twa-dev/sdk'

const mockBookings = [
  {
    id: '1',
    pcId: 'VIP-05',
    date: '2024-09-15',
    startTime: '14:00',
    endTime: '16:00',
    duration: 2,
    price: 300,
    status: 'active'
  },
  {
    id: '2',
    pcId: 'S-12',
    date: '2024-09-14',
    startTime: '19:00',
    endTime: '21:00',
    duration: 2,
    price: 260,
    status: 'completed'
  }
]

function Profile() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings'>('bookings')
  const [notifications, setNotifications] = useState(true)
  
  const user = WebApp.initDataUnsafe?.user
  const activeBookings = mockBookings.filter(b => b.status === 'active')
  const pastBookings = mockBookings.filter(b => b.status === 'completed')

  const handleCancelBooking = (bookingId: string) => {
    WebApp.showConfirm(
      'Отменить бронирование?',
      (confirmed) => {
        if (confirmed) {
          WebApp.showAlert(`Бронирование ${bookingId} отменено`)
        }
      }
    )
  }

  return (
    <div className="page">
      <div className="header">
        <Link to="/" className="header-back">← Назад</Link>
        <h1 className="header-title">Профиль</h1>
        <div></div>
      </div>

      {/* User Info */}
      <div className="user-info card">
        <div className="user-avatar">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="Avatar" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">
              {user?.first_name?.[0] || '👤'}
            </div>
          )}
        </div>
        <div className="user-details">
          <h3 className="user-name">
            {user?.first_name} {user?.last_name}
          </h3>
          <p className="user-username">@{user?.username || 'username'}</p>
          <div className="user-stats">
            <span className="stat">
              <span className="stat-number">{activeBookings.length}</span>
              <span className="stat-label">активных</span>
            </span>
            <span className="stat">
              <span className="stat-number">{pastBookings.length}</span>
              <span className="stat-label">завершено</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Мои брони
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Настройки
        </button>
      </div>

      {/* Content */}
      <div className="tab-content">
        {activeTab === 'bookings' ? (
          <div className="bookings-section">
            {activeBookings.length > 0 && (
              <div className="bookings-group">
                <h4 className="group-title">Активные брони</h4>
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="booking-card card">
                    <div className="booking-header">
                      <span className="pc-label">{booking.pcId}</span>
                      <span className="booking-status active">Активна</span>
                    </div>
                    <div className="booking-details">
                      <p className="booking-date">
                        {format(new Date(booking.date), 'dd MMMM yyyy', { locale: ru })}
                      </p>
                      <p className="booking-time">
                        {booking.startTime} - {booking.endTime} ({booking.duration}ч)
                      </p>
                      <p className="booking-price">{booking.price} ₽</p>
                    </div>
                    <button 
                      className="cancel-btn"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Отменить
                    </button>
                  </div>
                ))}
              </div>
            )}

            {pastBookings.length > 0 && (
              <div className="bookings-group">
                <h4 className="group-title">История</h4>
                {pastBookings.map((booking) => (
                  <div key={booking.id} className="booking-card card">
                    <div className="booking-header">
                      <span className="pc-label">{booking.pcId}</span>
                      <span className="booking-status completed">Завершена</span>
                    </div>
                    <div className="booking-details">
                      <p className="booking-date">
                        {format(new Date(booking.date), 'dd MMMM yyyy', { locale: ru })}
                      </p>
                      <p className="booking-time">
                        {booking.startTime} - {booking.endTime} ({booking.duration}ч)
                      </p>
                      <p className="booking-price">{booking.price} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mockBookings.length === 0 && (
              <div className="empty-state">
                <p>У вас пока нет броней</p>
                <Link to="/" className="btn btn-primary">
                  Забронировать ПК
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="settings-section">
            <div className="setting-item card">
              <div className="setting-info">
                <h4>Уведомления</h4>
                <p>Получать напоминания о бронях</p>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="info-section card">
              <h4>О приложении</h4>
              <p>KRAKEN Cyber Arena v1.0</p>
              <p>Великий Новгород</p>
              <p>Telegram: @KRAKEN_CYBERbot</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .user-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .user-avatar {
          flex-shrink: 0;
        }

        .avatar-img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }

        .avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--kraken-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: var(--kraken-bg-primary);
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          margin-bottom: 4px;
        }

        .user-username {
          color: var(--kraken-text-secondary);
          margin-bottom: 12px;
        }

        .user-stats {
          display: flex;
          gap: 20px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-family: var(--font-mono);
          font-weight: 600;
          color: var(--kraken-accent);
        }

        .stat-label {
          font-size: 0.8rem;
          color: var(--kraken-text-muted);
        }

        .tabs {
          display: flex;
          margin-bottom: 24px;
          background: var(--kraken-glass);
          border-radius: 12px;
          padding: 4px;
        }

        .tab {
          flex: 1;
          padding: 12px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: var(--kraken-text-secondary);
        }

        .tab.active {
          background: var(--kraken-accent);
          color: var(--kraken-bg-primary);
        }

        .bookings-group {
          margin-bottom: 32px;
        }

        .group-title {
          margin-bottom: 16px;
          color: var(--kraken-accent);
        }

        .booking-card {
          margin-bottom: 16px;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .pc-label {
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: 1.1rem;
        }

        .booking-status {
          font-size: 0.85rem;
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 500;
        }

        .booking-status.active {
          background: var(--kraken-success);
          color: var(--kraken-bg-primary);
        }

        .booking-status.completed {
          background: var(--kraken-glass);
          color: var(--kraken-text-muted);
        }

        .booking-details p {
          margin: 4px 0;
          font-size: 0.9rem;
        }

        .booking-date {
          color: var(--kraken-text-secondary);
        }

        .booking-time {
          color: var(--kraken-text-primary);
          font-family: var(--font-mono);
        }

        .booking-price {
          color: var(--kraken-accent);
          font-weight: 600;
        }

        .cancel-btn {
          margin-top: 12px;
          padding: 8px 16px;
          background: var(--kraken-error);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--kraken-text-secondary);
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .setting-info h4 {
          margin-bottom: 4px;
        }

        .setting-info p {
          color: var(--kraken-text-secondary);
          font-size: 0.9rem;
        }

        .toggle {
          position: relative;
          width: 50px;
          height: 24px;
        }

        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--kraken-glass);
          border-radius: 24px;
          transition: 0.2s;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          transition: 0.2s;
        }

        .toggle input:checked + .toggle-slider {
          background: var(--kraken-accent);
        }

        .toggle input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .info-section {
          margin-top: 24px;
        }

        .info-section h4 {
          margin-bottom: 12px;
          color: var(--kraken-accent);
        }

        .info-section p {
          color: var(--kraken-text-secondary);
          margin: 4px 0;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  )
}

export default Profile
