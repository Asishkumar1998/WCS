"use client";

import { Box, Grid, Container } from "@mui/material";

import ShinyBarChartHorizontal from "@/components/ui/Charts/ShinyBarChartHorizontal";

import ServiceCard from "@/components/features/Dashboard/ServiceCard";
import UpdatesSection from "@/components/features/Dashboard/UpdateSection";
import NewsSection from "@/components/features/Dashboard/NewsSection";
import CustomPieChart from "@/components/ui/Charts/PieChart";
import ChartCard from "@/components/features/Dashboard/ChartCard";
import { useRouter } from "next/navigation";
import { DashboardServices } from "@/dataset/constants/constants";
import { getNews, getUpdates } from "@/services/dashboardService";
import { useEffect, useState } from "react";
import { NewsItem, UpdateItem } from "@/types";
import Loader from "@/components/ui/Loader/Loader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./store/store";
import { fetchUserNotifications } from "./store/features/userSlice";
import { getCustomer } from "@/services/userService";
import RetailServiceCard from "@/components/features/Dashboard/ServiceCardRetail";
import ChartsWrapper from "@/components/ui/Charts/ChartsWrapper";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>();
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cid = localStorage.getItem("customerId");
      setCustomerId(cid);
    }
  }, []);

  const getCustomerDetails = async () => {
    const customerDetails = await getCustomer(String(customerId));
    setCustomer(customerDetails[0]);
  };

  useEffect(() => {
    if (customerId) getCustomerDetails();
  }, [customerId]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const payload = {
        news: {},
        updates: {
          updateStatus: 1621,
          "order.desc.by": "publishedDate",
          MR: 5,
          PN: 1,
        },
      };
      setLoading(true);
      const [news, updates] = await Promise.all([
        getNews(payload.news),
        getUpdates(payload.updates),
        dispatch(fetchUserNotifications()),
      ]);
      setNews(news);
      setUpdates(updates);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const isCorporateCustomer = customer?.customerTypeId === 591;

  if (loading && !customer) return <Loader />;

  return isCorporateCustomer ? (
    <Container maxWidth="xl" sx={{ px: 0, py: 2 }}>
      <Box sx={{ flexGrow: 1, pt: 3, mt: "64px" }}>
        <Grid container spacing={3}>
          {/* Left: Services */}
          <Grid container spacing={3} size={{ xs: 12, md: 6 }}>
            <Grid container spacing={2}>
              {DashboardServices.map((service, idx) => (
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
              <UpdatesSection updates={updates} />
            </Grid>
          </Grid>

          {/* Right: Charts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3} alignItems="stretch">
              <Grid size={{ xs: 12, md: 12 }} sx={{ display: "flex", height: 667 }}>
                <ChartCard>
                  <ChartsWrapper />
                </ChartCard>
              </Grid>

              <Grid size={{ xs: 12, md: 12 }}>
                <NewsSection news={news} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  ) : (
    <Container maxWidth="xl" sx={{ px: 0, py: 2 }}>
      <Box sx={{ flexGrow: 1, pt: 3, mt: "64px" }}>
        <Grid container spacing={4}>
          {/* Services: 3 x 2 */}
          <Grid container spacing={3}>
            {DashboardServices.map((service, idx) => (
              <Grid
                key={idx}
                size={{ xs: 12, sm: 6, md: 4 }}
                sx={{ display: "flex" }}
              >
                <RetailServiceCard
                  onClick={() => router.push(service.href)}
                  {...service}
                />
              </Grid>
            ))}
          </Grid>

          {/* Updates + News */}
          <Grid container spacing={3} width="1248px">
            <Grid size={{ xs: 12, md: 6 }}>
              <UpdatesSection updates={updates} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <NewsSection news={news} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
