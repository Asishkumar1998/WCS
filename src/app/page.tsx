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
} from '@mui/material';

import GavelIcon from '@mui/icons-material/Gavel';
import PublicIcon from '@mui/icons-material/Public';
import TranslateIcon from '@mui/icons-material/Translate';
import FlightIcon from '@mui/icons-material/Flight';

import ShinyBarChartHorizontal from '@/components/ui/Charts/ShinyBarChartHorizontal';

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
  { title: 'U.S. Apostilles & Legalizations', icon: <GavelIcon fontSize="large" /> },
  { title: 'Global Authentication (Canada, Europe, UK & Others)', icon: <PublicIcon fontSize="large" /> },
  { title: 'Translation Service', icon: <TranslateIcon fontSize="large" /> },
  { title: 'Visa Service', icon: <FlightIcon fontSize="large" /> },
];

export default function HomePage() {
  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" color="error" align='center' gutterBottom>
        Welcome to WCS Express
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Select from below services
      </Typography>

      <Grid container spacing={2}>

        <Grid >
          <Stack spacing={2}>
            {services.map((service) => (
              <Card key={service.title} variant="outlined" sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
                <Box sx={{ mr: 2, color: '#b71c1c' }}>{service.icon}</Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {service.title}
                </Typography>
              </Card>
            ))}
          </Stack>
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ backgroundColor: '#2c3e50', color: '#fff', p: 1 }}
              >
                WCS Update
              </Typography>
              <List dense>
                {updates.map((item) => (
                  <ListItem key={item.title} disableGutters>
                    <ListItemText
                      primary={item.title}
                      secondary={`Posted ${item.date}`}
                      primaryTypographyProps={{ fontSize: 14 }}
                      secondaryTypographyProps={{ color: 'error.main', fontSize: 12 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid sx={{ width: '60%' }}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Count of Orders and Documents by DocType
              </Typography>
              <ShinyBarChartHorizontal />
            </CardContent>
          </Card>

          {/* News */}
          <Card variant="outlined">
            <CardContent>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ backgroundColor: '#2c3e50', color: '#fff', p: 1 }}
              >
                WCS News
              </Typography>
              <List dense>
                {news.map((item) => (
                  <ListItem key={item.title} disableGutters>
                    <ListItemText
                      primary={item.title}
                      secondary={`Posted ${item.date}`}
                      primaryTypographyProps={{ fontSize: 14 }}
                      secondaryTypographyProps={{ color: 'error.main', fontSize: 12 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

        </Grid>
      </Grid>
    </Box>
  );
}
