"use client";

import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";

export default function PaymentPage() {
  const [cardType, setCardType] = useState("debit");

  const documents = [
    { country: "Albania", type: "General", ref: "", cost: 95 },
    { country: "Albania", type: "General", ref: "", cost: 110 },
    { country: "Afghanistan", type: "Federal Government", ref: "", cost: 265 },
  ];

  const totalCost = documents.reduce((sum, d) => sum + d.cost, 0);

  return (
    <Container maxWidth="xl" sx={{ mt: "64px", mb: 6 }}>
      <Grid container spacing={3}>
        {/* LEFT - Order Summary */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Order Summary
              </Typography>

              <TextField
                fullWidth
                label="Customer Name"
                value="Raghvendra Roy"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email Address"
                value="raghvendra@redintegro.com"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Phone Number"
                value="7987876459"
                margin="normal"
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Billing Address"
                value="146, S-B, 3, 78, Aditya Nagar, Indore, MP, 452010"
                margin="normal"
              />
              <TextField
                fullWidth
                label="Return/Shipping Instructions"
                value="Enclose Return Shipping Label by mail with documents"
                margin="normal"
              />

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Document Summary List
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "grey.100" }}>
                    <TableCell>Country</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell align="right">Cost</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map((doc, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "grey.50" },
                      }}
                    >
                      <TableCell>{doc.country}</TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>{doc.ref || "-"}</TableCell>
                      <TableCell align="right">${doc.cost}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="right"
                      sx={{ fontWeight: "bold" }}
                    >
                      Total
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      ${totalCost}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT - Payment Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Pay Now
              </Typography>

              <Typography variant="body2" gutterBottom>
                Please select the type of Card:
              </Typography>

              <RadioGroup
                row
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value="debit"
                  control={<Radio color="primary" />}
                  label="Debit"
                />
                <FormControlLabel
                  value="credit"
                  control={<Radio color="primary" />}
                  label="Credit"
                />
              </RadioGroup>

              <Typography variant="caption" color="text.secondary">
                * 3.5% service charge applies to all debit and credit
                transactions.
              </Typography>

              <TextField fullWidth label="Cardholder Name" margin="normal" />
              <TextField fullWidth label="Card Number" margin="normal" />

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 4 }}>
                  <TextField fullWidth label="MM" />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField fullWidth label="YY" />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField fullWidth label="CVV" />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="I have read and accepted the terms of use"
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderRadius: 2,
                }}
              >
                Pay ${totalCost}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
