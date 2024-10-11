import React from "react";
import { SxProps } from "@mui/material";
import Stack from '@mui/material/Stack';
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography"

interface BoxWithIcon {
    iconUrl: string;
    text: string;
    boxSx: SxProps;
    typographySX: SxProps;
    onClick: () => void;
}

const BoxWithIcon: React.FC<BoxWithIcon> = (props) => {
    return (
        <Box sx={props.boxSx} onClick={props.onClick}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={props.iconUrl} alt="icon" sx={{ width: 32, height: 32}} variant="square" />
                <Typography component="p" sx={props.typographySX}>{props.text}</Typography>
            </Stack>
        </Box>
    )
}

export default BoxWithIcon;