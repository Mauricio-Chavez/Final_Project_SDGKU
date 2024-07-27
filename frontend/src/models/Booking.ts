interface Booking{
  id?: number;
  user_id: number;
  tutor_id: number;
  summary: string;
  start_time: Date;
  end_time: Date;
  timezone: string;
  attendees: number[];
  meeting_link: string;
}

export default Booking;