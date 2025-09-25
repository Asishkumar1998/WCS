"use client";

import React, { useState } from "react";
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
    Divider,
    Collapse,
    useMediaQuery,
    Theme,
} from "@mui/material";
import {
    Home,
    Assignment,
    AddBox,
    Person,
    Info,
    Logout,
    Menu,
    ChevronLeft,
    ExpandLess,
    ExpandMore,
    Mail,
} from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // ✅ to detect current route
import logo from "../../../../public/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { toggleDrawer } from "@/app/store/features/uiSlice";

const drawerWidth = 240;
const collapsedWidth = 60;

const navItems = [
    {
        text: "Home Page",
        icon: <Home />,
        href: "/",
    },
    {
        text: "My Orders",
        icon: <Assignment />,
        children: [
            { text: "All Orders", href: "/orders" },
            { text: "Drafts", href: "/orders/drafts" },
        ],
    },
    {
        text: "New Order",
        icon: <AddBox />,
        href: "/new-order",
    },
    {
        text: "Notifications",
        icon: <Mail />,
        href: "/notifications",
    },
    {
        text: "FAQ",
        icon: <Info />,
        href: "/faq",
    },
    {
        text: "Sign Out",
        icon: <Logout />,
        href: "/sign-out",
    },
];

const SideDrawer = () => {
    const dispatch = useDispatch();
    const open = useSelector((state: RootState) => state.ui.drawerOpen);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const pathname = usePathname(); // ✅ active link detection
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const handleExpand = (itemText: string) => {
        // Don’t expand if drawer is collapsed
        if (!open) return;
        setExpanded((prev) => ({
            ...prev,
            [itemText]: !prev[itemText],
        }));
    };

    const renderNavItem = ({ text, icon, href, children }: any) => {
        const hasChildren = Array.isArray(children);

        // ✅ detect if active
        const isActive =
            href && pathname === href
                ? true
                : hasChildren
                    ? children.some((c: any) => pathname.startsWith(c.href))
                    : false;

        if (!hasChildren) {
            return (
                <Link
                    href={href || "#"}
                    key={text}
                    passHref
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => isMobile} // ✅ close on mobile
                >
                    <Tooltip title={!open ? text : ""} placement="right">
                        <ListItem
                            sx={{
                                backgroundColor: isActive ? "#2c4a6e" : "transparent",
                                "&:hover": { backgroundColor: "#2c4a6e" },
                            }}
                        >
                            <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
                                {icon}
                            </ListItemIcon>
                            {open && <ListItemText primary={text} />}
                        </ListItem>
                    </Tooltip>
                </Link>
            );
        }

        return (
            <div key={text}>
                <Tooltip title={!open ? text : ""} placement="right">
                    <ListItem
                        onClick={() => handleExpand(text)}
                        sx={{
                            backgroundColor: isActive ? "#2c4a6e" : "transparent",
                            "&:hover": { backgroundColor: "#2c4a6e" },
                        }}
                    >
                        <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
                            {icon}
                        </ListItemIcon>
                        {open && <ListItemText primary={text} />}
                        {open && (expanded[text] ? <ExpandLess /> : <ExpandMore />)}
                    </ListItem>
                </Tooltip>

                {/* ✅ only show children if drawer is open */}
                {open && (
                    <Collapse in={expanded[text]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {children.map((child) => {
                                const childActive = pathname.startsWith(child.href);
                                return (
                                    <Link
                                        href={child.href}
                                        key={child.text}
                                        passHref
                                        style={{ textDecoration: "none", color: "inherit" }}
                                        onClick={() => isMobile} // ✅ close on mobile
                                    >
                                        <ListItem
                                            sx={{
                                                pl: 6,
                                                backgroundColor: childActive ? "#345a82" : "transparent",
                                                "&:hover": { backgroundColor: "#345a82" },
                                            }}
                                        >
                                            <ListItemText primary={child.text} />
                                        </ListItem>
                                    </Link>
                                );
                            })}
                        </List>
                    </Collapse>
                )}
            </div>
        );
    };

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"} // ✅ responsive
            open={open}
            sx={{
                width: open ? drawerWidth : collapsedWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: open ? drawerWidth : collapsedWidth,
                    transition: "width 0.3s ease",
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    backgroundColor: "#1f324f",
                    color: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                },
            }}
        >
            {/* Top Section */}
            <div>
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                    }}
                >
                    <Image
                        src={logo}
                        width={open ? 100 : 50}
                        height={open ? 100 : 50}
                        alt="Logo"
                    />
                </div>

                <Divider sx={{ borderColor: "#2c3e50" }} />

                {/* Nav Items */}
                <List>{navItems.map(renderNavItem)}</List>
            </div>

            {/* Bottom Section: Profile + Toggle */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    borderTop: "1px solid #2c3e50",
                    padding: open ? "0 8px" : "8px 0",
                }}
            >
                {open ? (
                    // Expanded layout
                    <ListItem
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {/* Profile */}
                        <Link
                            href="/account/profile"
                            passHref
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                                flexGrow: 1,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <ListItemIcon sx={{ color: "#fff", minWidth: "40px" }}>
                                <Person />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </Link>

                        {/* Collapse Arrow */}
                        <IconButton onClick={() => dispatch(toggleDrawer())} sx={{ color: "#fff" }}>
                            <ChevronLeft />
                        </IconButton>
                    </ListItem>
                ) : (
                    // Collapsed layout
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <Tooltip title="Profile" placement="right">
                            <IconButton component={Link} href="/account/profile" sx={{ color: "#fff" }}>
                                <Person />
                            </IconButton>
                        </Tooltip>

                        <IconButton onClick={() => dispatch(toggleDrawer())} sx={{ color: "#fff" }}>
                            <Menu />
                        </IconButton>
                    </div>
                )}
            </div>
        </Drawer>
    );
};

export default SideDrawer;
