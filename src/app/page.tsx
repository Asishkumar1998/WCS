'use client';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Container,
} from '@mui/material';

import GavelIcon from '@mui/icons-material/Gavel';
import PublicIcon from '@mui/icons-material/Public';
import TranslateIcon from '@mui/icons-material/Translate';
import FlightIcon from '@mui/icons-material/Flight';

import ShinyBarChartHorizontal from '@/components/ui/Charts/ShinyBarChartHorizontal';
import Button from '@/components/ui/Button/Button';
import { ArrowForward, CheckCircle, Flight, PieChart, Public, Translate } from '@mui/icons-material';
import ServiceCard from '@/components/features/WelcomePage/ServiceCard';
import UpdatesSection from '@/components/features/WelcomePage/UpdateSection';
import NewsSection from '@/components/features/WelcomePage/NewsSection';
import EmbassyImage from "../../public/usembassy-dashboard-logo.png"
import CustomPieChart from '@/components/ui/Charts/PieChart';
import Navbar from '@/components/layout/NavBar/NavBar';
import ChartCard from '@/components/features/WelcomePage/ChartCard';

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
  return (
    <Container maxWidth="xl" sx={{ px: 0 }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, pt: 3, mt: "64px" }}>
        <Grid container spacing={3}>
          {/* Left: Services */}
          <Grid container spacing={3} size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {services.map((service, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 12 }} key={idx}>
                  <ServiceCard {...service} />
                </Grid>
              ))}
            </Grid>
            {/* Bottom: Updates + News */}
            <Grid size={{ xs: 12, md: 12 }}>
              <UpdatesSection />
            </Grid>
          </Grid>

          {/* Right: Charts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <ChartCard><ShinyBarChartHorizontal /></ChartCard>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12 }}>
                <ChartCard><CustomPieChart /></ChartCard>
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <NewsSection />
              </Grid>
            </Grid>
          </Grid>



        </Grid>
      </Box>

    </Container>
  );
}
