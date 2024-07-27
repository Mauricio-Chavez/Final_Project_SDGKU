import './Booking.css';
import BookingCard from '../../components/BookingCard';
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import useGlobalState from '../../context/GlobalState';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Booking from '../../models/Booking';
import TutorService from '../../service/tutor/TutorService';
import BookingForm from '../../components/BookingForm';

const BookingPage = () => {
  const [bookings, setBooking] = useState<Booking[]>([]);
  const currentDate = new Date();


  async function getBookings() {
    const res = await TutorService.getBookings();
    setBooking(res);
  }

  useEffect(() => {
    getBookings()
  }, []);


  return (
    <div className='booking'>
      <h1>Booking</h1>
      <div className="cards-container">
        {
          bookings.filter(meet => new Date(meet.end_time) >= currentDate).map((meet) => {
            return (
              <BookingCard meet={meet} />
            );
          })
        }
      </div>
    </div>
  );
};

export default BookingPage;