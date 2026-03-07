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
import InboxIcon from "@mui/icons-material/Inbox";
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
  getInvoice,
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
import { getAuth } from "@/app/utils/auth";
import { generateExactInvoicePDF } from "@/app/utils/generateInvoicePDF";
import OverlayLoader from "@/components/ui/Loader/OverlayLoader";
import { useSnackbar } from "@/components/ui/Snakebar/SnackbarProvider";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/store";
import { fetchFormsSharedData } from "@/app/store/features/formsSlice";

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
  internalReference: string;
  invoiceReference: string;
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
  const dispatch = useDispatch<AppDispatch>();
  const sharedFormData = useSelector((state: RootState) => state.formsData);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [filters, setFilters] = useState<Filters>({
    orderId: "",
    docId: "",
    docTypeId: null,
    internalReference: "",
    invoiceReference: "",
    countryId: null,
    countryTypeId: null,
    orderStatusId: null,
    fromDate: null,
    toDate: null,
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
  const [noOrderMessage, setNoOrderMessage] = useState<boolean>(false);
  const [loader, setLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState<string>("");
  const allOrderIds = data?.orders?.map((o) => o.orderId) ?? [];
  const { showSnackbar } = useSnackbar();
  const allExpanded =
    expanded.length === allOrderIds.length && allOrderIds.length > 0;
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    if (auth) {
      setUserId(auth.userId);
      setCustomerId(auth.customerId);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchFormsSharedData());
  }, [dispatch]);

  useEffect(() => {
    const shouldLockScroll = trackOpen || attachmentsOpen;
    if (!shouldLockScroll) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [trackOpen, attachmentsOpen]);

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
    if (
      userId &&
      filters.orderId &&
      id !== "all" &&
      filters.orderId === String(id)
    ) {
      displayData();
    }
  }, [filters.orderId, id, userId]);

  const toggleExpand = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpanded([]);
    } else {
      setExpanded(allOrderIds);
    }
  };

  const viewInvoice = async (orderId: number) => {
    const order = data?.orders.filter((o) => o.orderId === orderId);
    if (order && order[0].sageInvoiceReferenceNumber) {
      setLoader(true);
      setLoaderMessage("Fetching Sage Invoice...");

      try {
        const invoiceData = await getInvoice(
          order[0].sageInvoiceReferenceNumber,
        );
        generateExactInvoicePDF(
          invoiceData,
          order[0].sageInvoiceReferenceNumber,
        );
      } catch (error) {
        showSnackbar("Failed to Fetch Invoice", "error");
      } finally {
        setLoader(false);
        setLoaderMessage("");
      }
    } else {
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
    }
  };

  const printCover = async (orderId: number) => {
    try {
      setLoader(true);
      setLoaderMessage("Printing Cover...");
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

      const countryMapById = Object.fromEntries(
        countries.map((c) => [c.countryId, c]),
      );

      const stopMapById = Object.fromEntries(
        stops.map((s: any) => [s.stopId, s]),
      );

      const docTypeMapById = Object.fromEntries(
        docTypes.map((d: any) => [d.lookupId, d]),
      );

      const payload = await buildPrintCoverPayload(
        order[0],
        countryMapById,
        stopMapById,
        docTypeMapById,
        userData,
      );

      await generatePDF(payload, "download");
    }catch(e){
      showSnackbar("Failed to Print Cover", "error");
    } finally {
      setLoader(false);
      setLoaderMessage("");
    }
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

  useEffect(() => {
    if (!data?.orders) return;

    if (expanded.length === 0) {
      setExpanded([]);
    } else if (expanded.length > 0) {
      setExpanded(data.orders.map((o) => o.orderId));
    }
  }, [data]);

  const displayData = async () => {
    const payload: Partial<Filters> = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== "") {
          (acc as any)[key] = value;
        }
        return acc;
      },
      {},
    );

    if (userId) {
      (payload as any).userId = userId;
    }

    if (country) {
      (payload as any).countryId =
        country.value ?? country.countryId ?? country;
    }

    if(!(payload as any).fromDate){
      (payload as any).fromDate = dayjs("2018-01-01");
    }
    if(!(payload as any).toDate){
      (payload as any).toDate = dayjs();
    }

    try {
      setLoading(true);
      const response = await getDisplayData(payload);
      setData(response);
      if (response.totalRows == 0) setNoOrderMessage(true);
      else setNoOrderMessage(false);
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
    event: React.ChangeEvent<HTMLInputElement>,
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
      {},
    );

    if (userId) {
      (payload as any).userId = userId;
    }

    if (country) {
      (payload as any).countryId =
        country.value ?? country.countryId ?? country;
    }
    (payload as any).reportType = 1;

    const excelPayload = { ...payload };
    delete excelPayload.pageNumber;
    delete excelPayload.rowsPerPage;

    try {
      setLoader(true);
      setLoaderMessage("Exporting data to Excel...");

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
    } finally {
      setLoader(false);
      setLoaderMessage("");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <OverlayLoader open={loader} message={loaderMessage} />
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
                value={filters.internalReference}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    internalReference: (e.target as HTMLInputElement).value,
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <InputField
                label="PO#"
                value={filters.invoiceReference}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    invoiceReference: (e.target as HTMLInputElement).value,
                  })
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <CountrySelect
                label="Select or Type Country"
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
                  ORDER_STATUS_OPTIONS.find(
                    (o) => o.id === filters.orderStatusId,
                  )?.label ?? ""
                }
                onChange={(val) =>
                  setFilters({
                    ...filters,
                    orderStatusId:
                      ORDER_STATUS_OPTIONS.find((o) => o.label === val)?.id ??
                      0,
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
                  internalReference: "",
                  invoiceReference: "",
                  countryId: null,
                  countryTypeId: null,
                  orderStatusId: null,
                  fromDate: null,
                  toDate: null,
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
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
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
        {noOrderMessage ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              mt: 4,
              textAlign: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
              backgroundColor: "background.paper",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
                color: "text.secondary",
              }}
            >
              <InboxIcon sx={{ fontSize: 56 }} />
            </Box>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              No orders match your current filters
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 420, mx: "auto", mb: 3 }}
            >
              Try changing or clearing the filters to see available orders.
            </Typography>

            <Button
              variant="outlined"
              size="medium"
              onClick={() => {
                setFilters({
                  orderId: "",
                  docId: "",
                  docTypeId: null,
                  internalReference: "",
                  invoiceReference: "",
                  countryId: null,
                  countryTypeId: null,
                  orderStatusId: null,
                  fromDate: null,
                  toDate: null,
                  userId: Number(userId),
                  pageNumber: 1,
                  rowsPerPage: 10,
                });
                setCountry(null);
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        ) : (
          data?.orders.map((order) => (
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
                    Created: {dayjs(order.orderCreatedAt).format("MMM D, YYYY")}{" "}
                    | Order ID: {order.orderId}
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
                          order.docs.map((d) => d.docId),
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
                          order.docs.map((d) => d.docId),
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
                        setLoader(true);
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
                        <strong>Document Status</strong>
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
                              c.value === doc.countryId,
                          )?.countryShortName ??
                            doc.countryShortName ??
                            ""}
                        </TableCell>
                        <TableCell>
                          {countries.find(
                            (c: any) => c.countryId === doc.countryId,
                          )?.countryTypeId === 501
                            ? "Hague"
                            : "Non Hague"}
                        </TableCell>
                        <TableCell>
                          {DOCUMENT_CATEGORIES[doc.docCategoryId] ||
                            doc.docCategoryId}
                        </TableCell>
                        <TableCell>{doc.internalReference}</TableCell>
                        <TableCell>{doc.invoiceReference}</TableCell>
                        <TableCell>
                          {new Date(doc.orderCreatedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            },
                          )}
                        </TableCell>
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
          ))
        )}

        <ConversationDrawer
          open={conversationDrawerOpen}
          setOpen={setConversationDrawerOpen}
        />
        <TrackOrderDialog
          open={trackOpen}
          onClose={() => setTrackOpen(false)}
          orderId={trackOpen ? selectedOrderId : null}
          docIds={trackOpen ? selectedDocIds : []}
          processStartByDocId={
            trackOpen && selectedOrderId
              ? Object.fromEntries(
                  data?.orders
                    .find((o) => o.orderId === selectedOrderId)
                    ?.docs.filter((d) => selectedDocIds.includes(d.docId))
                    .map((d) => [d.docId, d.processStart]) ?? []
                )
              : {}
          }
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
    </>
  );
}
