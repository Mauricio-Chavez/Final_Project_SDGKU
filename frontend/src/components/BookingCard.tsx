import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { format } from 'date-fns';
import useGlobalState from "../context/GlobalState";

const BookingCard = ({ meet }: any) => {
  const { user } = useGlobalState.getState();
  const formattedDateStart = format(new Date(meet.start_time), 'PPPpp');
  const formattedDateEnd = format(new Date(meet.end_time), 'PPPpp');
  const handleClick = () => {
    window.open(`${meet.meeting_link}`, '_blank');
  };
  return (
    <Card className="mt-6 w-96" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
      <CardBody placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <Typography variant="h5" color="blue-gray" className="mb-2" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          Summary: {meet.summary}
        </Typography>
        <Typography placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
          {formattedDateStart} <br /> to <br /> {formattedDateEnd}
          {user && user.role === 0 && (
            <>
              <br />Tutor email: {meet.attendees[0]}
            </>
          )}
          {user && user.role === 1 && (
            <>
              <br />Student email: {meet.attendees[1]}
            </>
          )}
        </Typography>
      </CardBody>
      <CardFooter className="pt-0" placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>
        <Button onClick={handleClick} placeholder='' onPointerEnterCapture={() => { }} onPointerLeaveCapture={() => { }}>Go Meeting</Button>
      </CardFooter>
    </Card>
  );
}

export default BookingCard;