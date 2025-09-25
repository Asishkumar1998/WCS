'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
} from '@mui/material';

import {
  HelpOutline,
  Mail,
  ShoppingCart,
  Person,
  Search,
} from '@mui/icons-material';

import ShinyBarChartHorizontal from '@/components/ui/Charts/ShinyBarChartHorizontal';
import ServiceCard from '@/components/features/WelcomePage/ServiceCard';
import UpdatesSection from '@/components/features/WelcomePage/UpdateSection';
import NewsSection from '@/components/features/WelcomePage/NewsSection';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const news = [
  { title: 'WCS Processing New FDA Digital Documents, Business As Usual', date: 'Feb 20, 2024' },
  { title: 'Unwrapping the Sweet Surprise: Japanese KitKats Take Center Stage', date: 'Feb 15, 2024' },
  { title: 'A New Era: China and Canada Join the Apostille Treaty', date: 'Feb 1, 2024' },
  { title: 'FDA Plans More Digital Documents - CFG, COE, EPL', date: 'Jan 4, 2024' },
  { title: 'China is Up and Running', date: 'Dec 5, 2023' },
];

const updates = [
  { title: 'Electronic Export Documents - CFG, COE, EPL', date: 'Aug 10, 2023' },
  { title: 'New Test', date: 'Aug 10, 2023' },
  { title: 'Test Heading 10th Aug 2023', date: 'Aug 10, 2023' },
];

const services = [
  {
    icon: "/usembassy-dashboard-logo.png",
    title: "U.S. Apostilles & Legalizations",
    description: "Fast and reliable apostille services for US documents"
  },
  {
    icon: "/globalembassy-dashboard-logo.png",
    title: "Global Authentication (Canada, Europe, UK & Others)",
    description: "International document authentication for worldwide use"
  },
  {
    icon: "/translation-dashboard-logo.png",
    title: "Translation Service",
    description: "Certified translation services in multiple languages"
  },
  {
    icon: "/visaservice-dashboard-logo.png",
    title: "Visa Service",
    description: "Expert visa application assistance and processing"
  }
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/orders/${query.trim()}`);
    }
  };
  return (
    <Container maxWidth="xl" sx={{ px: 0 }}>
      {/* ✅ Top Navbar with Title, Search, and Icons */}
      <AppBar position="static" sx={{ backgroundColor: "#b5001a", mb: 4 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left - WCS Express Title */}
          <Typography variant="h6" sx={{ fontWeight: 600, display: { xs: "none", sm: "none", md: "block" } }}>
            Welcome to WCS Express
          </Typography>

          {/* Center - Search */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 1,
              px: 1,
              width: { xs: "40%", sm: "50%", md: "60%" },
            }}
          >
            <Search sx={{ color: "gray", fontSize: 20 }} />
            <InputBase
              placeholder="Search by Order ID…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ ml: 1, flex: 1, color: "black" }}
            />
          </Box>

          {/* Right - Icons */}
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
            <IconButton color="inherit">
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Services Section */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 4,
          }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              onClick={() => console.log(`Selected: ${service.title}`)}
            />
          ))}
        </Box>
      </Box>

      {/* Statistics Overview */}
      <Box sx={{ mb: 4 }}>
        <Card
          sx={{
            cursor: 'pointer',
            height: '100%',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <CardContent>
            <ShinyBarChartHorizontal />
          </CardContent>
        </Card>
      </Box>

      {/* Updates and News */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 4,
        }}
      >
        <UpdatesSection />
        <NewsSection />
      </Box>
    </Container>
  );
}
