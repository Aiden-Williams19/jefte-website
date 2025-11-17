import React, { useState, useEffect } from 'react';
import './BookingForm.css';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    eventLocation: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);

  // Fetch booked dates on component mount
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/availability');
        const data = await response.json();
        if (data.success) {
          setBookedDates(data.bookedDates || []);
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    fetchBookedDates();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Check if selected date is booked
    if (name === 'eventDate' && value && bookedDates.includes(value)) {
      setErrors(prev => ({
        ...prev,
        eventDate: 'This date is already booked. Please select another date.'
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Please select an event type';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.eventDate = 'Event date cannot be in the past';
      } else if (bookedDates.includes(formData.eventDate)) {
        newErrors.eventDate = 'This date is already booked. Please select another date.';
      }
    }

    if (!formData.eventLocation.trim()) {
      newErrors.eventLocation = 'Event location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:3001/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          eventLocation: '',
          message: ''
        });

        // Refresh booked dates after successful booking
        const availabilityResponse = await fetch('http://localhost:3001/api/availability');
        const availabilityData = await availabilityResponse.json();
        if (availabilityData.success) {
          setBookedDates(availabilityData.bookedDates || []);
        }

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      } else {
        // Check if it's a booking conflict error
        if (response.status === 409 || data.error?.includes('already booked')) {
          setErrors(prev => ({
            ...prev,
            eventDate: data.error || 'This date is already booked. Please select another date.'
          }));
          setSubmitStatus('error');
        } else {
          setSubmitStatus('error');
        }
        console.error('Error sending email:', data.error || data.details);
        
        // Reset error message after 5 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="booking-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Book a Session</h2>
          <p className="section-subtitle">
            Ready to capture your special moments? Fill out the form below and I'll get back to you soon.
          </p>
        </div>

        <div className="booking-form-container">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="John Doe"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="eventType">
                  Event Type <span className="required">*</span>
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  className={errors.eventType ? 'error' : ''}
                >
                  <option value="">Select event type</option>
                  <option value="weddings">Weddings</option>
                  <option value="commercial">Commercial</option>
                  <option value="corporate">Corporate</option>
                  <option value="matric balls">Matric Balls</option>
                  <option value="videos">Videos</option>
                  <option value="normal">Normal/Portrait</option>
                </select>
                {errors.eventType && <span className="error-message">{errors.eventType}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventDate">
                  Event Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className={errors.eventDate ? 'error' : ''}
                  min={new Date().toISOString().split('T')[0]}
                  onFocus={(e) => {
                    // Disable booked dates
                    const input = e.target;
                    input.addEventListener('input', function() {
                      if (bookedDates.includes(this.value)) {
                        setErrors(prev => ({
                          ...prev,
                          eventDate: 'This date is already booked. Please select another date.'
                        }));
                      }
                    });
                  }}
                />
                {errors.eventDate && <span className="error-message">{errors.eventDate}</span>}
                {isLoadingAvailability && (
                  <span style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                    Loading availability...
                  </span>
                )}
                {!isLoadingAvailability && bookedDates.length > 0 && (
                  <span style={{ fontSize: '12px', color: '#666', display: 'block', marginTop: '5px' }}>
                    {bookedDates.length} date{bookedDates.length !== 1 ? 's' : ''} already booked
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="eventLocation">
                  Event Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="eventLocation"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  className={errors.eventLocation ? 'error' : ''}
                  placeholder="City, Venue Name"
                />
                {errors.eventLocation && <span className="error-message">{errors.eventLocation}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Additional Details</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Tell me more about your event, any specific requirements, or questions you might have..."
              />
            </div>

            {submitStatus === 'success' && (
              <div className="success-message">
                <span>✓</span>
                Thank you! Your booking request has been submitted. I'll contact you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="error-message" style={{ 
                backgroundColor: '#fee', 
                color: '#c33', 
                padding: '15px', 
                borderRadius: '5px', 
                marginBottom: '20px',
                border: '1px solid #fcc'
              }}>
                <span>✗</span>
                There was an error submitting your request. Please try again or contact us directly.
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
