"use client";

import React, { useEffect, useState } from "react";
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
  TablePagination,
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
import {
  exportDataToExcel,
  getBill,
  getDisplayData,
  getLookup,
} from "@/services/formsService";
import { countries } from "@/dataset/countries";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getAllStops } from "@/services/TrackOrderService";
import { buildPrintCoverPayload } from "@/components/features/Orders/Common/BuildPrintCoverPayload";
import { generatePDF } from "@/app/utils/generatePDF";
import { getOrder } from "@/services/cartServices";
import { getCustomer, getUser } from "@/services/userService";
import Loader from "@/components/ui/Loader/Loader";

//Below are the Interfaces to handle the API response
interface Instruction {
  instructionId: number;
  createdBy: string | null;
  createdAt: string | null;
  modifiedBy: string | null;
  modifiedAt: string | null;
  countryId: number;
  docCategoryId: number;
  personalDocType: number;
  instruction: string;
}

interface Doc {
  docId: number;
  countryShortName: string | null;
  countryTypeId: number;
  docTypeId: number;
  customerReference: string | null;
  orderCreatedAt: string;
  orderAmount: number;
  orderDate: string;
  estDateOfCompletion: string;
  docStatusId: number;
  docCategoryId: number;
  instructionsList: Instruction[];
  orderId: number;
  paidAmount: number;
  countryName: string | null;
  createdAt: string;
  barcode: string;
  isScan: boolean;
  isPostScan: boolean;
  isRush: boolean;
  isGeneralSoftCopy: boolean | null;
  isSoftCopyGiven: number;
  sageCustomerId: string;
  sageInvoiceReferenceNumber: string | null;
  customerName: string;
  name: string;
  email: string;
  contactNo: string;
  invoiceReference: string;
  internalReference: string;
  isCopy: boolean;
  countryId: number;
  originCountryId: number;
  description: string;
  processDays: number;
  companyName: string;
  pageNumber: number;
  isUSOrigin: boolean;
  processStart: string;
  completionDate: string;
  directionId: number;
  trackCardNumber: string;
  directionName: string;
  payLaterOptions: any | null;
  labelByMail: boolean;
  regionId: number;
  useUserCourier: boolean;
  regionNote: string | null;
  custodianId: number;
  pickupOrDropOff: boolean;
}

interface Order {
  orderId: number;
  orderCreatedAt: string;
  sageInvoiceReferenceNumber: string | null;
  docs: Doc[];
  payLaterOptions: any | null;
  labelByMail: boolean;
  regionId: number;
  useUserCourier: boolean;
  regionNote: string | null;
  pickupOrDropOff: boolean;
}

export interface OrdersResponse {
  orders: Order[];
  totalRows: number;
}

interface Filters {
  orderId: string;
  docId: string;
  docTypeId: number | null;
  customerRef: string;
  po: string;
  countryId: number | null;
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

const DOCUMENT_CATEGORIES: Record<number, string> = {
  521: "Federal Government",
  522: "General",
  523: "Shipping/Commercial",
  525: "International",
  526: "Visa",
  527: "Translation",
  528: "Notary",
  529: "Dispatch",
};

export const DOC_STATES: Record<number, string> = {
  601: "Waiting",
  602: "In Process",
  603: "Completed",
  604: "Closed",
  605: "Archived",
  606: "Cancelled",
  607: "OnHold",
};

export default function OrdersPage() {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cid = localStorage.getItem("customerId");
      const uid = localStorage.getItem("userId");
      setCustomerId(cid);
      setUserId(uid);
    }
  }, []);
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filters>({
    orderId: "",
    docId: "",
    docTypeId: null,
    customerRef: "",
    po: "",
    countryId: null,
    countryTypeId: null,
    orderStatusId: null,
    fromDate: dayjs().subtract(90, "day"),
    toDate: dayjs(),
    userId: Number(userId),
    pageNumber: 1,
    rowsPerPage: 10,
  });
  const [conversationDrawerOpen, setConversationDrawerOpen] = useState(false);
  const [trackOpen, setTrackOpen] = React.useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [country, setCountry] = useState<any>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([]);
  const [docTypes, setDocTypes] = useState<any>();
  const [stops, setStops] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const allOrderIds = data?.orders?.map((o) => o.orderId) ?? [];
  const allExpanded =
    expanded.length === allOrderIds.length && allOrderIds.length > 0;
  const { id } = useParams();
  const router = useRouter();

  const getStops = async () => {
    const response = await getAllStops();
    setStops(response);
    setDocTypes(await getLookup({ lookupType: "DocumentCategories" }));
  };

  useEffect(() => {
    if (id && id !== "all") {
      setFilters((prev) => ({
        ...prev,
        orderId: id as string,
        pageNumber: 1,
      }));
    }
    getStops();
  }, []);

  useEffect(() => {
    if (filters.orderId && id !== "all") {
      displayData();
    }
  }, [filters.orderId, id]);

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

  // const viewConversation = (e: any) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   setConversationDrawerOpen(true);
  // };

  const trackOrder = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    setTrackOpen(true);
  };

  const viewInvoice = async (orderId: number) => {
    const newTab = window.open("", "_blank");

    if (!newTab) {
      alert("Popup blocked! Please allow popups for this site.");
      return;
    }

    try {
      const base64Data = await getBill({ orderId });

      // Decode base64 string to binary
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      newTab.location.href = url;
    } catch (err) {
      console.error("Failed to fetch invoice PDF:", err);
      newTab.close();
    }
  };

  const printCover = async (orderId: number) => {
    const order = await getOrder(orderId);
    const customer = await getCustomer(String(customerId));
    const user = await getUser(String(userId));

    const userData = {
      customerId: customer[0].sageCustomerId,
      customerName: customer[0].customerName,
      userName: `${user[0].name} ${user[0].lastName}`,
      email: user[0].email,
      contactNo: user[0].contactNo,
    };

    console.log("customer -----------> ", customer);
    console.log("user -----------> ", user);
    const countryMapById = Object.fromEntries(
      countries.map((c) => [c.countryId, c])
    );

    const stopMapById = Object.fromEntries(
      stops.map((s: any) => [s.stopId, s])
    );

    const docTypeMapById = Object.fromEntries(
      docTypes.map((d: any) => [d.lookupId, d])
    );

    const payload = buildPrintCoverPayload(
      order[0],
      countryMapById,
      stopMapById,
      docTypeMapById,
      userData
    );

    await generatePDF(payload);
  };

  const viewAttachments = (e: any, orderId: number, docIds: number[]) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedOrderId(orderId);
    setSelectedDocIds(docIds ?? []);
    setAttachmentsOpen(true);
  };

  const viewTrackDetails = (e: any, orderId: number, docIds: number[]) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedOrderId(orderId);
    setSelectedDocIds(docIds ?? []);
    setTrackOpen(true);
  };

  const handleCountrySelect = (value: any) => {
    setCountry(value);
  };

  useEffect(() => {
    if (userId) {
      displayData();
    }
  }, [filters.pageNumber, filters.rowsPerPage, userId]);

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

    if (userId) {
      (payload as any).userId = userId;
    }

    if (country) {
      (payload as any).countryId =
        country.value ?? country.countryId ?? country;
    }

    try {
      setLoading(true);
      const response = await getDisplayData(payload);
      setData(response);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: newPage + 1,
    }));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      pageNumber: 1,
    }));
  };

  //Export to Excel
  const exportToExcel = async () => {
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
      (payload as any).countryId =
        country.value ?? country.countryId ?? country;
    }
    (payload as any).reportType = 1;

    const excelPayload = { ...payload };
    delete excelPayload.pageNumber;
    delete excelPayload.rowsPerPage;

    try {
      const response = await exportDataToExcel(excelPayload);

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const dt = new Date();
      const fileName = `Report_${dt.getDate()}_${
        dt.getMonth() + 1
      }_${dt.getFullYear()}.xlsx`;

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export Excel:", err);
    }
  };

  if (loading) return <Loader />;

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
          <Button
            variant="contained"
            onClick={() => {
              filters.pageNumber = 1;
              filters.rowsPerPage = 10;
              displayData();
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setFilters({
                orderId: "",
                docId: "",
                docTypeId: null,
                customerRef: "",
                po: "",
                countryId: null,
                countryTypeId: null,
                orderStatusId: null,
                fromDate: dayjs().subtract(90, "day"),
                toDate: dayjs(),
                userId: Number(userId),
                pageNumber: 1,
                rowsPerPage: 10,
              });
              setCountry(null);
            }}
          >
            Reset
          </Button>
          <Button variant="outlined" color="success" onClick={exportToExcel}>
            Export Report to Excel
          </Button>
        </Stack>
      </Paper>
      {/* Page Header */}
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          My Orders
        </Typography>
        <Grid display="flex" flexDirection="row">
          {data && (
            <TablePagination
              component="div"
              count={data?.totalRows || 0}
              page={filters.pageNumber - 1} // MUI is 0-based
              onPageChange={handlePageChange}
              rowsPerPage={filters.rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
          <Button
            variant="outlined"
            startIcon={allExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            onClick={toggleExpandAll}
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </Button>
        </Grid>
      </Grid>

      {data?.orders.map((order) => (
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
                Created: {dayjs(order.orderCreatedAt).format("MMM D, YYYY")} |
                Order ID: {order.orderId}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  onClick={() => printCover(order.orderId)}
                  size="small"
                  startIcon={<PrintIcon />}
                >
                  Print Cover
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    viewTrackDetails(
                      e,
                      order.orderId,
                      order.docs.map((d) => d.docId)
                    );
                  }}
                  size="small"
                  startIcon={<LocalShippingIcon />}
                >
                  Track Order
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    viewAttachments(
                      e,
                      order.orderId,
                      order.docs.map((d) => d.docId)
                    );
                  }}
                  size="small"
                  startIcon={<AttachFileIcon />}
                >
                  View Attachments
                </Button>
                <Button
                  onClick={() => viewInvoice(order.orderId)}
                  size="small"
                  startIcon={<ReceiptIcon />}
                >
                  View Invoice
                </Button>
                <Button
                  onClick={() => {
                    router.push(`/orders/${order.orderId}/conversation`);
                  }}
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
                    <TableCell>
                      {countries.find(
                        (c: any) =>
                          c.countryId === doc.countryId ||
                          c.id === doc.countryId ||
                          c.value === doc.countryId
                      )?.countryShortName ??
                        doc.countryShortName ??
                        ""}
                    </TableCell>
                    <TableCell>
                      {countries.find((c: any) => c.countryId === doc.countryId)
                        ?.countryTypeId === 501
                        ? "Hague"
                        : "Non Hague"}
                    </TableCell>
                    <TableCell>
                      {DOCUMENT_CATEGORIES[doc.docCategoryId] ||
                        doc.docCategoryId}
                    </TableCell>
                    <TableCell>{doc.internalReference}</TableCell>
                    <TableCell>{doc.invoiceReference}</TableCell>
                    <TableCell>{doc.orderDate}</TableCell>
                    <TableCell>{doc.estDateOfCompletion}</TableCell>
                    <TableCell>
                      {DOC_STATES[doc.docStatusId] || doc.docStatusId}
                    </TableCell>
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
        orderId={trackOpen ? selectedOrderId : null}
        docIds={trackOpen ? selectedDocIds : []}
        returnInstructions="Enclose Return Shipping Label by mail with documents"
      />
      <AttachmentsDialog
        open={attachmentsOpen}
        onClose={() => {
          setAttachmentsOpen(false);
          setSelectedOrderId(null);
          setSelectedDocIds([]);
        }}
        orderId={attachmentsOpen ? selectedOrderId : null}
        docIds={attachmentsOpen ? selectedDocIds : []}
      />
    </Box>
  );
}
