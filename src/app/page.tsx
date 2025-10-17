"use client";

import { Box, Grid, Container } from "@mui/material";

import ShinyBarChartHorizontal from "@/components/ui/Charts/ShinyBarChartHorizontal";

import ServiceCard from "@/components/features/Dashboard/ServiceCard";
import UpdatesSection from "@/components/features/Dashboard/UpdateSection";
import NewsSection from "@/components/features/Dashboard/NewsSection";
import CustomPieChart from "@/components/ui/Charts/PieChart";
import ChartCard from "@/components/features/Dashboard/ChartCard";
import { useRouter } from "next/navigation";

const services = [
  {
    icon: "/usembassy-dashboard-logo.png",
    title: "U.S. Apostilles & Legalizations",
    description: "Fast and reliable apostille services for US documents",
    href: "/orders/new/us-authentication",
  },
  {
    icon: "/globalembassy-dashboard-logo.png",
    title: "Global Authentication (Canada, Europe, UK & Others)",
    description: "International document authentication for worldwide use",
    href: "/orders/new/global-authentication",
  },
  {
    icon: "/translation-dashboard-logo.png",
    title: "Translation Service",
    description: "Certified translation services in multiple languages",
    href: "/orders/new/translation-service",
  },
  {
    icon: "/visaservice-dashboard-logo.png",
    title: "Visa Service",
    description: "Expert visa application assistance and processing",
    href: "/orders/new/visa-service",
  },
  {
    icon: "/notary-dashboard-logo.png",
    title: "Notary Service",
    description: "Official notarization of your documents.",
    href: "/orders/new/notary-service",
  },
  {
    icon: "/dispatch-dashboard-logo.png",
    title: "Dispatch Service",
    description: "Secure courier delivery with tracking.",
    href: "/orders/new/dispatch-service",
  },
];

export default function HomePage() {
  const router = useRouter();
  return (
    <Container maxWidth="xl" sx={{ px: 0 }}>
      <Box sx={{ flexGrow: 1, pt: 3, mt: "64px" }}>
        <Grid container spacing={3}>
          {/* Left: Services */}
          <Grid container spacing={3} size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {services.map((service, idx) => (
                <Grid size={{ xs: 12, sm: 6, md: 12 }} key={idx}>
                  <ServiceCard
                    onClick={() => router.push(service.href)}
                    {...service}
                  />
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
            <Grid container spacing={3} alignItems="stretch">
              <Grid size={{ xs: 12, sm: 6, md: 12 }} sx={{ display: "flex" }}>
                <ChartCard>
                  <ShinyBarChartHorizontal />
                </ChartCard>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12 }} sx={{ display: "flex" }}>
                <ChartCard>
                  <CustomPieChart />
                </ChartCard>
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
