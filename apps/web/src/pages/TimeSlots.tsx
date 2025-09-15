import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format, addDays, addMinutes, isSameDay } from 'date-fns'
import { ru } from 'date-fns/locale'
import WebApp from '@twa-dev/sdk'

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
]

const durations = [
  { hours: 1, label: '1 час', price: 130 },
  { hours: 2, label: '2 часа', price: 250 },
  { hours: 3, label: '3 часа', price: 350 },
  { hours: 4, label: '4 часа', price: 450 },
  { hours: 5, label: '5 часов', price: 450 }
]

function TimeSlots() {
  const { pcId } = useParams<{ pcId: string }>()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState(durations[0])
  const [isBooking, setIsBooking] = useState(false)

  const user = WebApp.initDataUnsafe?.user
  const today = new Date()
  const dates = Array.from({ length: 8 }, (_, i) => addDays(today, i))

  const isSlotAvailable = (time: string) => {
    // Mock availability - in real app this would come from API
    const unavailableSlots = ['14:00', '14:30', '15:00', '19:00', '19:30']
    return !unavailableSlots.includes(time)
  }

  const handleBooking = async () => {
    if (!selectedTime || !user) return
    
    setIsBooking(true)
    
    // Mock booking API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    WebApp.showAlert(`Бронирование подтверждено!\n\nПК: ${pcId}\nДата: ${format(selectedDate, 'dd MMMM', { locale: ru })}\nВремя: ${selectedTime}\nДлительность: ${selectedDuration.label}`)
    
    setIsBooking(false)
  }

  const totalPrice = selectedDuration.price

  return (
    <div className="page">
      <div className="header">
        <Link to={`/zone/${pcId?.split('-')[0].toLowerCase()}`} className="header-back">← Назад</Link>
        <h1 className="header-title">Бронирование {pcId}</h1>
        <div></div>
      </div>

      {/* Date Selection */}
      <div className="section">
        <h3 className="section-title">Выберите дату</h3>
        <div className="date-scroll">
          {dates.map((date) => (
            <button
              key={date.toISOString()}
              className={`date-card ${isSameDay(date, selectedDate) ? 'selected' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="date-day">{format(date, 'EEE', { locale: ru })}</div>
              <div className="date-number">{format(date, 'd')}</div>
              <div className="date-month">{format(date, 'MMM', { locale: ru })}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration Selection */}
      <div className="section">
        <h3 className="section-title">Длительность</h3>
        <div className="duration-grid">
          {durations.map((duration) => (
            <button
              key={duration.hours}
              className={`duration-card ${selectedDuration.hours === duration.hours ? 'selected' : ''}`}
              onClick={() => setSelectedDuration(duration)}
            >
              <div className="duration-label">{duration.label}</div>
              <div className="duration-price">{duration.price} ₽</div>
            </button>
          ))}
        </div>
      </div>

      {/* Time Selection */}
      <div className="section">
        <h3 className="section-title">Выберите время</h3>
        <div className="time-grid">
          {timeSlots.map((time) => {
            const isAvailable = isSlotAvailable(time)
            const isSelected = selectedTime === time
            
            return (
              <button
                key={time}
                className={`time-slot ${isSelected ? 'selected' : ''} ${!isAvailable ? 'unavailable' : ''}`}
                onClick={() => isAvailable && setSelectedTime(time)}
                disabled={!isAvailable}
              >
                {time}
              </button>
            )
          })}
        </div>
      </div>

      {/* Booking Summary */}
      {selectedTime && (
        <div className="booking-summary card">
          <h4>Детали бронирования</h4>
          <div className="summary-row">
            <span>ПК:</span>
            <span>{pcId}</span>
          </div>
          <div className="summary-row">
            <span>Дата:</span>
            <span>{format(selectedDate, 'dd MMMM yyyy', { locale: ru })}</span>
          </div>
          <div className="summary-row">
            <span>Время:</span>
            <span>{selectedTime} - {format(addMinutes(new Date(`2000-01-01T${selectedTime}`), selectedDuration.hours * 60), 'HH:mm')}</span>
          </div>
          <div className="summary-row">
            <span>Длительность:</span>
            <span>{selectedDuration.label}</span>
          </div>
          <div className="summary-row total">
            <span>Итого:</span>
            <span>{totalPrice} ₽</span>
          </div>
          
          <button 
            className="btn btn-primary book-button"
            onClick={handleBooking}
            disabled={isBooking}
          >
            {isBooking ? (
              <>
                <div className="spinner"></div>
                Бронируем...
              </>
            ) : (
              '🎮 Забронировать'
            )}
          </button>
        </div>
      )}

      <style>{`
        .section {
          margin-bottom: 32px;
        }

        .section-title {
          margin-bottom: 16px;
          color: var(--kraken-text-primary);
        }

        .date-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .date-card {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 16px;
          background: var(--kraken-glass);
          border: 1px solid var(--kraken-glass-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 70px;
        }

        .date-card:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .date-card.selected {
          background: var(--kraken-accent);
          color: var(--kraken-bg-primary);
          border-color: var(--kraken-accent);
        }

        .date-day {
          font-size: 0.75rem;
          text-transform: uppercase;
          opacity: 0.8;
        }

        .date-number {
          font-size: 1.25rem;
          font-weight: 600;
          font-family: var(--font-mono);
        }

        .date-month {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .duration-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 12px;
        }

        .duration-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px;
          background: var(--kraken-glass);
          border: 1px solid var(--kraken-glass-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .duration-card:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .duration-card.selected {
          background: var(--kraken-accent);
          color: var(--kraken-bg-primary);
          border-color: var(--kraken-accent);
        }

        .duration-label {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .duration-price {
          font-family: var(--font-mono);
          font-size: 0.9rem;
        }

        .time-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 8px;
        }

        .time-slot {
          padding: 12px 8px;
          background: var(--kraken-glass);
          border: 1px solid var(--kraken-glass-border);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-mono);
          font-size: 0.9rem;
        }

        .time-slot:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .time-slot.selected {
          background: var(--kraken-accent);
          color: var(--kraken-bg-primary);
          border-color: var(--kraken-accent);
        }

        .time-slot.unavailable {
          opacity: 0.4;
          cursor: not-allowed;
          background: var(--kraken-glass);
        }

        .time-slot.unavailable:hover {
          background: var(--kraken-glass);
        }

        .booking-summary {
          position: sticky;
          bottom: 20px;
          margin-top: 32px;
        }

        .booking-summary h4 {
          margin-bottom: 16px;
          color: var(--kraken-accent);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .summary-row.total {
          font-weight: 600;
          font-size: 1rem;
          color: var(--kraken-accent);
          border-top: 1px solid var(--kraken-glass-border);
          padding-top: 8px;
          margin-top: 12px;
        }

        .book-button {
          width: 100%;
          margin-top: 16px;
          font-size: 1.1rem;
          padding: 16px;
        }

        .book-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default TimeSlots
