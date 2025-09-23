'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
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
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import logo from "../../../../public/logo.png";

const drawerWidth = 240;
const collapsedWidth = 60;

const navItems = [
    {
        text: 'Home Page',
        icon: <Home />,
        href: '/',
    },
    {
        text: 'My Orders',
        icon: <Assignment />,
        children: [
            { text: 'All Orders', href: '/orders' },
            { text: 'Drafts', href: '/orders/drafts' },
        ],
    },
    {
        text: 'New Order',
        icon: <AddBox />,
        href: '/new-order',
    },
    {
        text: 'My Account',
        icon: <Person />,
        children: [
            { text: 'Profile', href: '/account/profile' },
            { text: 'Settings', href: '/account/settings' },
        ],
    },
    {
        text: 'FAQ',
        icon: <Info />,
        href: '/faq',
    },
    {
        text: 'Sign Out',
        icon: <Logout />,
        href: '/sign-out',
    },
];

const SideDrawer = () => {
    const [open, setOpen] = useState(true);
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

    const toggleDrawer = () => setOpen((prev) => !prev);

    const handleExpand = (itemText: string) => {
        setExpanded((prev) => ({
            ...prev,
            [itemText]: !prev[itemText],
        }));
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: open ? drawerWidth : collapsedWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: open ? drawerWidth : collapsedWidth,
                    transition: 'width 0.3s ease',
                    overflowX: 'hidden',
                    whiteSpace: 'nowrap',
                    backgroundColor: '#1f324f',
                    color: '#fff',
                    justifyContent: 'space-between',
                },
            }}
        >
            <div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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

                <Divider sx={{ borderColor: '#2c3e50' }} />

                <List>
                    {navItems.map(({ text, icon, href, children }) => {
                        const hasChildren = Array.isArray(children);

                        if (!hasChildren) {
                            return (
                                <Link
                                    href={href || '#'}
                                    key={text}
                                    passHref
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <Tooltip title={!open ? text : ''} placement="right">
                                        <ListItem >
                                            <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
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
                                <Tooltip title={!open ? text : ''} placement="right">
                                    <ListItem onClick={() => handleExpand(text)}>
                                        <ListItemIcon sx={{ color: '#fff', minWidth: '40px' }}>
                                            {icon}
                                        </ListItemIcon>
                                        {open && <ListItemText primary={text} />}
                                        {open && (expanded[text] ? <ExpandLess /> : <ExpandMore />)}
                                    </ListItem>
                                </Tooltip>

                                <Collapse in={expanded[text]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {children.map((child) => (
                                            <Link
                                                href={child.href}
                                                key={child.text}
                                                passHref
                                                style={{
                                                    textDecoration: 'none',
                                                    color: 'inherit',
                                                }}
                                            >
                                                <ListItem sx={{ pl: open ? 6 : 2 }}>
                                                    <ListItemText primary={child.text} />
                                                </ListItem>
                                            </Link>
                                        ))}
                                    </List>
                                </Collapse>
                            </div>
                        );
                    })}
                </List>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: open ? 'flex-end' : 'center',
                    padding: 8,
                    borderTop: '1px solid #2c3e50',
                }}
            >
                <IconButton onClick={toggleDrawer} sx={{ color: '#fff' }}>
                    {open ? <ChevronLeft /> : <Menu />}
                </IconButton>
            </div>
        </Drawer>
    );
};

export default SideDrawer;
