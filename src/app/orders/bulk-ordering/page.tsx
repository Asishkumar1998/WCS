"use client";

import { Box, Container, Grid, Tab, Tabs } from "@mui/material";
import ToolTip from "@/components/ui/Tooltip/Tooltip";
import { useState } from "react";
import { InfoOutlined } from "@mui/icons-material";
import BulkOrderingFormTypeOne from "@/components/features/Orders/Forms/BulkOrderingFormTypeOne";
import BulkOrderingFormTypeTwo from "@/components/features/Orders/Forms/BulkOrderingFormTypeTwo";
import BulkOrderingSidebar from "@/components/features/Orders/Sidebars/BulkOrderingSidebar";

interface TabInfo {
  label: string;
  value: string;
  description: string;
}

const tabOptions: TabInfo[] = [
  {
    label: "Type 1",
    value: "type1",
    description:
      "Type 1: Used for submitting a single document for multiple countries.",
  },
  {
    label: "Type 2",
    value: "type2",
    description:
      "Type 2: Used for submitting multiple documents for a single country.",
  },
];

function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ mt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function NewOrderPage() {
  const [type, setType] = useState(0);

  return (
    <Container maxWidth="xl" sx={{ mt: 12 }}>
      <Grid container spacing={2}>
        {/* Left side - form */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Tabs with tooltip on hover */}
          <Tabs
            value={type}
            onChange={(_, v) => setType(v)}
            textColor="primary"
            indicatorColor="primary"
          >
            {tabOptions.map((tab) => (
              <ToolTip
                key={tab.value}
                title={tab.description}
                placement="bottom"
                arrow
              >
                <Tab
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {tab.label}
                      <InfoOutlined fontSize="small" color="action" />
                    </Box>
                  }
                  sx={{ minHeight: 44, fontWeight: 600 }}
                />
              </ToolTip>
            ))}
          </Tabs>
          <TabPanel value={type} index={0}>
            <BulkOrderingFormTypeOne />
          </TabPanel>
          <TabPanel value={type} index={1}>
            <BulkOrderingFormTypeTwo />
          </TabPanel>
        </Grid>

        {/* Right side - FAQ */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ mt: 8 }}>
          <BulkOrderingSidebar />
        </Grid>
      </Grid>
    </Container>
  );
}
