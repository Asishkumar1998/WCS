"use client";

import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Stack,
} from "@mui/material";

// mock data

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


    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    p: 2,
                    backgroundColor: "grey.200",
                }}
            >
                <Typography variant="subtitle1" fontWeight={600}>
                    Created: {orderData.created} | Order ID: {id}
                </Typography>

                {/* Action Buttons */}
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="info">
                        Print Cover
                    </Button>
                    <Button variant="contained" color="info">
                        Track Order
                    </Button>
                    <Button variant="contained" color="info">
                        View Attachments
                    </Button>
                    <Button variant="contained" color="info">
                        View Invoice
                    </Button>
                    <Button variant="contained" color="info">
                        View Conversations
                    </Button>
                </Stack>
            </Box>

            {/* Table */}
            <Card>
                <CardContent>
                    <Table>
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
                </CardContent>
            </Card>
        </Box>
    );
}
