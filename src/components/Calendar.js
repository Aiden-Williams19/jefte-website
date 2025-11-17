import React, { useState } from 'react';
import './Calendar.css';

const Calendar = ({ selectedDate, onDateSelect, bookedDates = [], disabled = false }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const formatDate = (day) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateBooked = (day) => {
    if (!day) return false;
    const dateString = formatDate(day);
    return bookedDates.includes(dateString);
  };

  const isDatePast = (day) => {
    if (!day) return false;
    const dateString = formatDate(day);
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isToday = (day) => {
    if (!day) return false;
    const dateString = formatDate(day);
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    const dateString = formatDate(day);
    return dateString === selectedDate;
  };

  const handleDateClick = (day) => {
    if (!day || disabled) return;
    if (isDateBooked(day) || isDatePast(day)) return;
    const dateString = formatDate(day);
    onDateSelect(dateString);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthName = monthNames[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  // Count booked dates in current month
  const bookedInMonth = days.filter(day => day && isDateBooked(day)).length;

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          className="calendar-nav-btn" 
          onClick={handlePrevMonth}
          type="button"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3 className="calendar-month-year">
          {monthName} {year}
        </h3>
        <button 
          className="calendar-nav-btn" 
          onClick={handleNextMonth}
          type="button"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {bookedInMonth > 0 && (
        <div className="calendar-info">
          <span className="calendar-info-text">
            <span className="info-icon">📅</span>
            {bookedInMonth} date{bookedInMonth !== 1 ? 's' : ''} booked this month
          </span>
        </div>
      )}

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((day, index) => {
            const booked = day && isDateBooked(day);
            const past = day && isDatePast(day);
            const todayClass = day && isToday(day) ? 'calendar-day-today' : '';
            const selectedClass = day && isSelected(day) ? 'calendar-day-selected' : '';
            const disabledClass = !day || booked || past ? 'calendar-day-disabled' : '';
            const bookedClass = booked ? 'calendar-day-booked' : '';

            return (
              <button
                key={index}
                type="button"
                className={`calendar-day ${todayClass} ${selectedClass} ${disabledClass} ${bookedClass}`}
                onClick={() => handleDateClick(day)}
                disabled={!day || booked || past || disabled}
                aria-label={day ? `${monthName} ${day}, ${year}${booked ? ' (Booked)' : ''}` : ''}
                aria-disabled={!day || booked || past || disabled}
              >
                {day || ''}
                {booked && <span className="booked-indicator" aria-label="Booked">✕</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color legend-today"></span>
          <span className="legend-text">Today</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-available"></span>
          <span className="legend-text">Available</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-booked"></span>
          <span className="legend-text">Booked</span>
        </div>
        <div className="legend-item">
          <span className="legend-color legend-past"></span>
          <span className="legend-text">Past</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

