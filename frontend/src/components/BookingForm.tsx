import React, { useState } from 'react';
import Select from 'react-select';
import moment from 'moment-timezone';
import useGlobalState from '../context/GlobalState';
import { Button, Input } from '@material-tailwind/react';
import TutorService from '../service/tutor/TutorService';
import { useNavigate } from 'react-router-dom';

const TimezoneSelect = ({ onChange }: { onChange: (selectedOption: any) => void }) => {
  const timezones = moment.tz.names().map(tz => ({
    value: tz,
    label: tz,
  }));

  return (
    <Select
      onChange={onChange}
      options={timezones}
      placeholder="Select a timezone"
    />
  );
};

const BookingForm = ({ tutor }: any) => {
  const { user } = useGlobalState.getState();
  const [formData, setFormData] = useState({
    tutor_id: tutor.id,
    user_id: user?.id,
    summary: '',
    start_time: '',
    end_time: '',
    timezone: '',
    attendees: [`${tutor.email}`, `${user?.email}`],
  });
  const navigate = useNavigate();

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTimezoneChange = (selectedOption: { value: any; }) => {
    setFormData({
      ...formData,
      timezone: selectedOption.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const formattedStartTime = formData.start_time.length <= 16 ? `${formData.start_time}:00` : formData.start_time;
    const formattedEndTime = formData.end_time.length <= 16 ? `${formData.end_time}:00` : formData.end_time;

    console.log('Form data:', formData);
    try {
      const bookingData = {
        tutor_id: formData.tutor_id,
        user_id: formData.user_id,
        summary: formData.summary,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        timezone: formData.timezone,
        attendees: formData.attendees,
      };

      // bookingData.append('tutor_id', formData.tutor_id);
      // bookingData.append('user_id', formData.user_id?.toString() || '');
      // bookingData.append('summary', formData.summary);
      // bookingData.append('start_time', formData.start_time);
      // bookingData.append('end_time', formData.end_time);
      // bookingData.append('timezone', formData.timezone);
      // bookingData.append('attendees', JSON.stringify(formData.attendees));

      console.log('Booking data:', bookingData);
      console.log('Form data:', formData);



      const res = await TutorService.createBooking(bookingData);
      if (res) {
        alert('User created successfully');
        navigate('/bookings');
      } else {
        alert('Error creating user');
      }
    } catch (error) {
      console.error('Register error', error);
      alert('Error creating user');
    }

  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Summary</label>
          <input
            type="text"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input
            type="datetime-local"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>End Time:</label>
          <input
            type="datetime-local"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Timezone:</label>
          <TimezoneSelect onChange={handleTimezoneChange} />
        </div>
        <button onClick={handleSubmit} type="submit" className="ml-2 mr-2 select-none rounded-lg bg-green-500 py-3 px-9 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">Add Meeting</button>
      </form>
    </div>
  );
};

export default BookingForm;