import {
  Button as MuiButton,
  ButtonProps,
  styled,
  ButtonBaseProps,
} from "@mui/material";
import { ReactNode } from "react";

interface CustomButtonProps extends ButtonProps{

}

const Button = styled(MuiButton)<ButtonProps>({
  width: "8rem",
  padding: "0.5rem",
  fontSize: '.75rem',
  display: "flex",
  alignItems:"center",
  justifyContent: "center",
  gap: 5
  
});
export function StyledButton(Props : CustomButtonProps) {

  return (
    <Button variant="contained" {...Props}></Button>
  )

}