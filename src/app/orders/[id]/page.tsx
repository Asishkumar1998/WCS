"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PrintIcon from "@mui/icons-material/Print";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ForumIcon from "@mui/icons-material/Forum";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore"; // expand all
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess"; // collapse all
import { Dayjs } from "dayjs";

import InputField from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import DateInput from "@/components/ui/Input/DateInput";
import Button from "@/components/ui/Button/Button";

interface Doc {
  docId: number;
  country: string;
  countryType: string;
  docType: string;
  customerRef: string;
  invoice: string;
  orderDate: string;
  completionDate: string;
  status: string;
}

interface Order {
  orderId: number;
  createdDate: string;
  docs: Doc[];
}

const mockOrders: Order[] = [
  {
    orderId: 97108,
    createdDate: "Oct 1, 2024",
    docs: [
      {
        docId: 93866,
        country: "Kuwait",
        countryType: "Non Hague",
        docType: "Federal Govt",
        customerRef: "PO 04092024",
        invoice: "PO 04092024",
        orderDate: "10/03/2024",
        completionDate: "12/05/2024",
        status: "In Process",
      },
      {
        docId: 93928,
        country: "Kuwait",
        countryType: "Non Hague",
        docType: "Federal Govt",
        customerRef: "PO 04092024",
        invoice: "PO 04092024",
        orderDate: "10/03/2024",
        completionDate: "11/13/2024",
        status: "In Process",
      },
    ],
  },
  {
    orderId: 97098,
    createdDate: "Aug 16, 2024",
    docs: [
      {
        docId: 93851,
        country: "Argentina",
        countryType: "Hague",
        docType: "Visa",
        customerRef: "PO 04092024",
        invoice: "PO 04092024",
        orderDate: "08/28/2024",
        completionDate: "09/30/2024",
        status: "In Process",
      },
    ],
  },
];

interface Filters {
  orderId: string;
  docId: string;
  docType: string;
  customerRef: string;
  po: string;
  country: string;
  countryType: string;
  orderStatus: string;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
}

export default function OrdersPage() {
  const [expanded, setExpanded] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filters>({
    orderId: "",
    docId: "",
    docType: "",
    customerRef: "",
    po: "",
    country: "",
    countryType: "",
    orderStatus: "",
    fromDate: null,
    toDate: null,
  });

  const allOrderIds = mockOrders.map((o) => o.orderId);
  const allExpanded = expanded.length === allOrderIds.length;

  const toggleExpand = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpanded([]);
    } else {
      setExpanded(allOrderIds);
    }
  };

  return (
    <Box sx={{ p: 3, mt: "64px" }}>
      {/* Search & Reports */}
      <Paper
        sx={{
          height: "100%",
          border: "1px solid #e0e0e0",
          mb: 2,
          p: 2,
          boxShadow: 0,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Search and Reports
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InputField
              label="Order Id"
              value={filters.orderId}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  orderId: (e.target as HTMLInputElement).value,
                })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InputField
              label="Doc Id"
              value={filters.docId}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  docId: (e.target as HTMLInputElement).value,
                })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InputField
              label="Doc Type"
              value={filters.docType}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  docType: (e.target as HTMLInputElement).value,
                })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InputField
              label="Customer Reference"
              value={filters.customerRef}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  customerRef: (e.target as HTMLInputElement).value,
                })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <InputField
              label="PO#"
              value={filters.po}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  po: (e.target as HTMLInputElement).value,
                })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Dropdown
              label="Select Country"
              options={["Kuwait", "Argentina", "USA", "India"]}
              value={filters.country}
              onChange={(val) => setFilters({ ...filters, country: val })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Dropdown
              label="Select Country Type"
              options={["Hague", "Non Hague"]}
              value={filters.countryType}
              onChange={(val) => setFilters({ ...filters, countryType: val })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Dropdown
              label="Select Order Status"
              options={["In Process", "Completed", "Cancelled"]}
              value={filters.orderStatus}
              onChange={(val) => setFilters({ ...filters, orderStatus: val })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DateInput
              label="From Date"
              value={filters.fromDate}
              onChange={(val) => setFilters({ ...filters, fromDate: val })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <DateInput
              label="To Date"
              value={filters.toDate}
              onChange={(val) => setFilters({ ...filters, toDate: val })}
            />
          </Grid>
        </Grid>

        {/* ✅ Buttons bottom right */}
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button variant="contained">Search</Button>
          <Button variant="outlined" color="secondary">
            Reset
          </Button>
          <Button variant="outlined" color="success">
            Export Report to Excel
          </Button>
        </Stack>
      </Paper>

      {/* Page Header */}
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          My Orders
        </Typography>
        <Button
          variant="outlined"
          startIcon={allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
          onClick={toggleExpandAll}
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </Button>
      </Grid>

      {/* Orders List */}
      {mockOrders.map((order) => (
        <Accordion
          key={order.orderId}
          expanded={expanded.includes(order.orderId)}
          onChange={() => toggleExpand(order.orderId)}
          sx={{
            mb: 2,
            border: "1px solid #e0e0e0",
            boxShadow: 0,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              width="100%"
            >
              <Typography fontWeight="bold">
                Created: {order.createdDate} | Order ID: {order.orderId}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button size="small" startIcon={<PrintIcon />}>
                  Print Cover
                </Button>
                <Button size="small" startIcon={<LocalShippingIcon />}>
                  Track Order
                </Button>
                <Button size="small" startIcon={<AttachFileIcon />}>
                  View Attachments
                </Button>
                <Button size="small" startIcon={<ReceiptIcon />}>
                  View Invoice
                </Button>
                <Button size="small" startIcon={<ForumIcon />}>
                  View Conversation
                </Button>
              </Stack>
            </Grid>
          </AccordionSummary>

          <AccordionDetails>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "grey.100" }}>
                <TableRow>
                  <TableCell>
                    <strong>Doc Id</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Country Id</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Country Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Doc Type</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Customer Reference</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Invoice (PO) Ref</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Order Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Est Date of Completion</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Order Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.docs.map((doc) => (
                  <TableRow key={doc.docId}>
                    <TableCell>{doc.docId}</TableCell>
                    <TableCell>{doc.country}</TableCell>
                    <TableCell>{doc.countryType}</TableCell>
                    <TableCell>{doc.docType}</TableCell>
                    <TableCell>{doc.customerRef}</TableCell>
                    <TableCell>{doc.invoice}</TableCell>
                    <TableCell>{doc.orderDate}</TableCell>
                    <TableCell>{doc.completionDate}</TableCell>
                    <TableCell>{doc.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
