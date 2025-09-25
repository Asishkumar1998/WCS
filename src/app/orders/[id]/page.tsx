"use client";

import { ExpandMore } from "@mui/icons-material";
import {
  Box,
  Typography,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

export default function OrderDetails({ params }: { params: { id: string } }) {
  const { id } = params;

  const orderData = {
    id,
    created: "Oct 1, 2024",
    docs: [
      {
        docId: "93866",
        country: "Kuwait",
        countryType: "Non Hague",
        docType: "Federal Government",
        customerRef: "",
        invoice: "PO 04092024",
        orderDate: "10/03/2024",
        estCompletion: "12/05/2024",
        status: "In Process",
      },
    ],
  };

  // helper to prevent accordion toggle on button clicks
  const handleButtonClick =
    (fn?: () => void) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      fn?.();
    };

  return (
    <Box sx={{ p: 3, mt: "64px" }}>
      <Accordion
        disableGutters
        sx={{
          mb: 2,
          border: "1px solid #e0e0e0",
          "&:before": { display: "none" }, // remove default divider line
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: "white" }} />}
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "grey.800",
            color: "common.white",
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              width: "100%",
            },
          }}
        >
          {/* Left: order info */}
          <Typography variant="subtitle1" fontWeight={600}>
            Created: {orderData.created} | Order ID: {orderData.id}
          </Typography>

          {/* Right: action buttons */}
          <Stack
            direction="row"
            spacing={2}
            flexWrap="wrap"
            useFlexGap
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleButtonClick()}
            >
              Print Cover
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleButtonClick()}
            >
              Track Order
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleButtonClick()}
            >
              View Attachments
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleButtonClick()}
            >
              View Invoice
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleButtonClick()}
              sx={{ mr: 3 }}
            >
              View Conversation
            </Button>
          </Stack>
        </AccordionSummary>

        {/* Accordion Content */}
        <AccordionDetails sx={{ p: 0 }}>
          <Card variant="outlined" sx={{ border: "none" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Doc Id</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Country Type</TableCell>
                  <TableCell>Doc Type</TableCell>
                  <TableCell>Customer Reference</TableCell>
                  <TableCell>Invoice (PO) Ref</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Est. Date of Completion</TableCell>
                  <TableCell>Order Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData.docs.map((doc) => (
                  <TableRow key={doc.docId}>
                    <TableCell>{doc.docId}</TableCell>
                    <TableCell>{doc.country}</TableCell>
                    <TableCell>{doc.countryType}</TableCell>
                    <TableCell>{doc.docType}</TableCell>
                    <TableCell>{doc.customerRef}</TableCell>
                    <TableCell>{doc.invoice}</TableCell>
                    <TableCell>{doc.orderDate}</TableCell>
                    <TableCell>{doc.estCompletion}</TableCell>
                    <TableCell>{doc.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
