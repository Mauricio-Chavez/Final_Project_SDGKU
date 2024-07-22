import { useState } from "react";
import useGlobalState from "../../../context/GlobalState";
import { set } from "react-hook-form";
import authService from "../../../service/auth.service";
import { Button } from "@material-tailwind/react";



const HomeTutor = () => {
  const { user, setUser } = useGlobalState();
  const [visible, setVisible] = useState(user?.is_visible || false);

  const updateVisible = () => {
    console.log(!visible);
    setVisible(!visible);
    const res = authService.updateVisibility(visible);
    setUser(
      {
        ...user,
        is_visible: visible
      }
    )
  }

  return (
    <div>
      <h1>Home Tutor</h1>
      <p>Hello {user?.first_name}</p>
      <Button
        placeholder=''
        onPointerEnterCapture={() => { }}
        onPointerLeaveCapture={() => { }}
        onClick={updateVisible}
      >
        {user?.is_visible ? 'Hide Profile' : 'Show Profile'}
      </Button>
    </div>
  );
}

export default HomeTutor;