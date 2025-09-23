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
import { ArrowForward, CheckCircle, Flight, Public, Translate } from '@mui/icons-material';
import ServiceCard from '@/components/features/WelcomePage/ServiceCard';
import UpdatesSection from '@/components/features/WelcomePage/UpdateSection';
import NewsSection from '@/components/features/WelcomePage/NewsSection';
import EmbassyImage from "../../public/usembassy-dashboard-logo.png"

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
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, color: 'secondary.main' }}>
          Welcome to WCS Express
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Professional document legalization services for international use
        </Typography>
      </Box>

      {/* Services Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Select from below services
          </Typography>
          <Button
            variant="outlined"
            endIcon={<ArrowForward />}
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            View All Services
          </Button>
        </Box>

        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 4
        }}>
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
        {/* <Card sx={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0',
          width: "50%"
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  500+
                </Typography>
                <Typography color="text.secondary">
                  Orders Processed
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  50+
                </Typography>
                <Typography color="text.secondary">
                  Countries Served
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
                  24/7
                </Typography>
                <Typography color="text.secondary">
                  Customer Support
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card> */}
        <Card sx={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <ShinyBarChartHorizontal />
          </CardContent>
        </Card>
      </Box>

      {/* Updates and News */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 4
      }}>
        <UpdatesSection />
        <NewsSection />
      </Box>
    </Container>
  );
}
