import { useEffect, useState } from "react";
import useGlobalState from "../../context/GlobalState";
import authService from "../../service/auth.service";
import { useParams } from 'react-router-dom';
import { generalData } from "../../common/generalData";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import BookingForm from "../../components/BookingForm";

const DetailsTutor = () => {
  const { id } = useParams();
  const { user } = useGlobalState();
  const [tutor, setTutor] = useState<any>([]);

  async function getTutor() {
    const res = await authService.getTutors();
    const tutorDetails = res.filter((t: { id: number; }) => t.id === parseInt(id ?? ""));
    setTutor(tutorDetails[0]);
  }
  useEffect(() => {
    getTutor()
  }, [id]);

  return (
    <div>
      <h1>Details Tutor</h1>
      <br /><br />
      <Popover placement="bottom">
        <PopoverHandler>
          <Button
            placeholder='Booking'
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}>Book the session</Button>
        </PopoverHandler>
        <PopoverContent className="w-8/12 p-12" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          <Typography variant="h6" color="blue-gray" className="mb-6" placeholder=''
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}>
            New Meeting
          </Typography>
          <BookingForm tutor={tutor} />
        </PopoverContent>
      </Popover>
      <br /><br />
      <h2>Name: {tutor?.first_name} {tutor?.last_name}</h2>
      <h2>Email: {tutor?.email}</h2>
      <h2>Hoarly Rate: {tutor.hourly_rate}</h2>
      <h2>Area: {generalData.study_area.find(obj => obj.value === tutor.study_area)?.label}</h2>
    </div>
  );
}

export default DetailsTutor;