"use client";

import React from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    InputBase,
    Badge,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    HelpOutline,
    Mail,
    ShoppingCart,
    Person,
    Search,
} from "@mui/icons-material";

const drawerWidth = 240; // adjust to your sidebar width

export default function Navbar() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: "#b5001a",
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* Left Section (empty or logo) */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} />

                {/* Center - Search */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "white",
                        borderRadius: 1,
                        px: 1,
                        width: { xs: "60%", sm: "50%", md: "40%" },
                    }}
                >
                    <Search sx={{ color: "gray", fontSize: 20 }} />
                    <InputBase
                        placeholder="Search…"
                        sx={{ ml: 1, flex: 1, color: "black" }}
                    />
                </Box>

                {/* Right Section */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton color="inherit">
                        <HelpOutline />
                    </IconButton>
                    <IconButton color="inherit">
                        <Badge badgeContent={9} color="error">
                            <Mail />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit">
                        <Badge badgeContent={0} color="error">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleMenu}>
                        <Person />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
