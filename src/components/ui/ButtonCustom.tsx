import { Button } from "@mui/material";

const ButtonCustom = ({ title, onClick }: ButtonCustomProps) => {
  return (
    <Button sx={{ my: 1, mx: 3, p: 2}} onClick={onClick}>
      {title}
    </Button>
  );
};

type ButtonCustomProps = {
  title: string;
  onClick: () => void;
};

export default ButtonCustom;
