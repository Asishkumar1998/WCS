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
import dayjs, { Dayjs } from "dayjs";

import InputField from "@/components/ui/Input/Input";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import DateInput from "@/components/ui/Input/DateInput";
import Button from "@/components/ui/Button/Button";
import ConversationDrawer from "@/components/features/Orders/Sidebars/ConversationDrawer";
import TrackOrderDialog from "@/components/features/Orders/Dialogs/TrackOrderDialog";
import AttachmentsDialog from "@/components/features/Orders/Dialogs/AttachmentsDialog";
import CountrySelect from "@/components/ui/Dropdown/CountryDropdown";
import { getDisplayData } from "@/services/formsService";

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
  docTypeId: number | null;
  customerRef: string;
  po: string;
  country: string;
  countryTypeId: number | null;
  orderStatusId: number | null;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  userId: number;
  pageNumber: number;
  rowsPerPage: number;
}

const ORDER_STATUS_OPTIONS = [
  { label: "Waiting", id: 601 },
  { label: "In Process", id: 602 },
  { label: "Completed", id: 603 },
  { label: "OnHold", id: 607 },
];
const DOC_TYPE_OPTIONS = [
  { label: "Federal Government", id: 521 },
  { label: "General", id: 522 },
  { label: "Shipping/Commercial", id: 523 },
  { label: "International", id: 525 },
  { label: "Visa", id: 526 },
  { label: "Translation", id: 527 },
  { label: "Notary", id: 528 },
  { label: "Dispatch", id: 529 },
];

export default function OrdersPage() {
  const [expanded, setExpanded] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filters>({
    orderId: "",
    docId: "",
    docTypeId: null,
    customerRef: "",
    po: "",
    country: "",
    countryTypeId: null,
    orderStatusId: null,
    fromDate: dayjs().subtract(90, "day"), // default to today
    toDate: dayjs(), // default to today
    userId: 7437,
    pageNumber: 1,
    rowsPerPage: 10,
  });
  const [conversationDrawerOpen, setConversationDrawerOpen] = useState(false);
  const [trackOpen, setTrackOpen] = React.useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const allOrderIds = mockOrders.map((o) => o.orderId);
  const allExpanded = expanded.length === allOrderIds.length;
  const [country, setCountry] = useState<any>(null);

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

  const viewConversation = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setConversationDrawerOpen(true);
  };

  const trackOrder = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setTrackOpen(true);
  };

  const viewInvoice = () => {};

  const printCover = () => {};

  const viewAttachments = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setAttachmentsOpen(true);
  };

  const handleCountrySelect = (value: any) => {
    setCountry(value);
  };

  const displayData = async () => {
    const payload: Partial<Filters> = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== "") {
          (acc as any)[key] = value;
        }
        return acc;
      },
      {}
    );

    if (country) {
      (payload as any).country = country.value ?? country.label ?? country;
    }

    const response = await getDisplayData(payload);
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
            <Dropdown
              label="Select Doc Type"
              options={DOC_TYPE_OPTIONS.map((o) => o.label)}
              value={
                DOC_TYPE_OPTIONS.find((o) => o.id === filters.docTypeId)
                  ?.label ?? ""
              }
              onChange={(val) =>
                setFilters({
                  ...filters,
                  docTypeId:
                    DOC_TYPE_OPTIONS.find((o) => o.label === val)?.id ?? 0,
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
            <CountrySelect
              label="Select Country"
              value={country}
              onChange={handleCountrySelect}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Dropdown
              label="Select Country Type"
              options={["Hague", "Non Hague"]}
              // display the text label in the dropdown, map it to numeric id in state
              value={
                filters.countryTypeId === 501
                  ? "Hague"
                  : filters.countryTypeId === 502
                  ? "Non Hague"
                  : ""
              }
              onChange={(val) =>
                setFilters({
                  ...filters,
                  countryTypeId:
                    val === "Hague" ? 501 : val === "Non Hague" ? 502 : 0,
                })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Dropdown
              label="Select Order Status"
              options={ORDER_STATUS_OPTIONS.map((o) => o.label)}
              value={
                ORDER_STATUS_OPTIONS.find((o) => o.id === filters.orderStatusId)
                  ?.label ?? ""
              }
              onChange={(val) =>
                setFilters({
                  ...filters,
                  orderStatusId:
                    ORDER_STATUS_OPTIONS.find((o) => o.label === val)?.id ?? 0,
                })
              }
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
          <Button variant="contained" onClick={displayData}>
            Search
          </Button>
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
                <Button
                  onClick={printCover}
                  size="small"
                  startIcon={<PrintIcon />}
                >
                  Print Cover
                </Button>
                <Button
                  onClick={trackOrder}
                  size="small"
                  startIcon={<LocalShippingIcon />}
                >
                  Track Order
                </Button>
                <Button
                  onClick={viewAttachments}
                  size="small"
                  startIcon={<AttachFileIcon />}
                >
                  View Attachments
                </Button>
                <Button
                  onClick={viewInvoice}
                  size="small"
                  startIcon={<ReceiptIcon />}
                >
                  View Invoice
                </Button>
                <Button
                  onClick={viewConversation}
                  size="small"
                  startIcon={<ForumIcon />}
                >
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
                    <strong>Country Name</strong>
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
                    <strong>Est. Date of Completion</strong>
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
      <ConversationDrawer
        open={conversationDrawerOpen}
        setOpen={setConversationDrawerOpen}
      />
      <TrackOrderDialog
        open={trackOpen}
        onClose={() => setTrackOpen(false)}
        orderId={250249}
        docId={94473}
        steps={[
          { label: "Order Placed", date: "09/29/2025", completed: true },
          {
            label: "Process Started",
            description: "Est. Processing time 7 days",
          },
          { label: "Secretary of State" },
          {
            label: "Shipped / Completed",
            description: "Est. Completion 10/10/2025",
          },
        ]}
        returnInstructions="Enclose Return Shipping Label by mail with documents"
      />
      <AttachmentsDialog
        open={attachmentsOpen}
        onClose={() => setAttachmentsOpen(false)}
      />
    </Box>
  );
}
