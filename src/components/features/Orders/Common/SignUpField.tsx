export const customerSignupFields = [
    [
    {
    type: "input",
    name: "name",
    placeholder: "First Name",
    label:"First Nsjdfndgkndgk",
    required: true,
    asteriskLeft: "95px",
    optionKey:"",
    status:0,
  },
  {
    type: "input",
    name: "lastName",
    placeholder: "Last Name",
    label:"",
    required: true,
    asteriskLeft: "95px",
    optionKey:"",
    status:0,
  }
],
[
    {
    type: "input",
    name: "contactNo",
    placeholder: "Phone Number",
    label:"",
    required: true,
    asteriskLeft: "125px",
    optionKey:"",
    status:0,
  },
  {
    type: "input",
    name: "email",
    placeholder: "Email Address",
    label:"",
    required: true,
    asteriskLeft: "120px",
    optionKey:"",
    status:0,
  },
],

[
{
    type: "input",
    name: "billAddress.addressLine1",
    placeholder: "Address Line 1",
    label:"",
    required: true,
    asteriskLeft: "122px",
    optionKey:"",
    status:0,
  },
  {
    type: "input",
    name: "billAddress.addressLine2",
    placeholder: "Address Line 2",
    label:"",
    asteriskLeft: "105px",
    optionKey:"",
    status:0,
  },
],

[
    {
    type: "input",
    name: "billAddress.city",
    placeholder: "City",
    required: true,
    label:"",
    asteriskLeft: "45px",
    optionKey:"",
    status:0,
  },
  {
    type: "input",
    name: "billAddress.state",
    placeholder: "State",
    label:"",
    required: true,
    asteriskLeft: "55px",
    optionKey:"",
    status:0,
  },
],

[
     {
    type: "input",
    name: "billAddress.zipCode",
    placeholder: "Postal Code",
    required: true,
    label:"",
    asteriskLeft: "105px",
    optionKey:"",
    status:0,
  },

  {
    type: "dropdown",
    name: "country",
    label: "Select or Type Country",
    placeholder: "",
    required: true,
    asteriskLeft: "105px",
    optionKey:"countries",
    status:0,
  },
],


  
  [
    {
    type: "dropdown",
    name: "findusType",
    label: "Where did you find us?",
    placeholder:"",
    required: true,
    asteriskLeft: "105px",
    optionKey:"findUs",status:0,
  },

  {
    type: "dropdown",
    name: "customerType",
    label: "Customer Type",
    placeholder:"",
    required: true,
    asteriskLeft: "105px",
    optionKey:"customers",
    status:0,
  },
  ],
  [
     {
    type: "input",
    name: "findUsOtherText",
    placeholder: "If Referral/Others, Please Specify",
    required: true,
    label:"",
    asteriskLeft: "105px",
    optionKey:"",
    status:1,
  },
  ],
  [
     {
    type: "input",
    name: "companyName",
    placeholder: "Company Name",
    required: true,
    label:"",
    asteriskLeft: "105px",
    optionKey:"",
    status:2,
  },

  {
    type: "dropdown",
    name: "industryType",
    label: "Select or Type Industry",
    placeholder: "",
    required: true,
    asteriskLeft: "105px",
    optionKey:"industry",
    status:2,
  },
],
];


export const getFieldStyle = (placeholder: string, required?: boolean) => ({

  mb: 2,
  backgroundColor: "#fff",
  borderRadius: 1,

  "& fieldset": { border: "none" },

  "& input::placeholder": {
    color: "transparent",
  },

  "& .MuiOutlinedInput-root": {
    position: "relative",
  },

  "& .MuiOutlinedInput-root::before": {
    content: required
      ? `"${placeholder} *"`
      : `"${placeholder}"`,

    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    
    fontSize: "16px",
    pointerEvents: "none",

    // trick: gradient makes last char red
    background: required
      ? `linear-gradient(to right,
          #999 0,
          #999 calc(100% - 1ch),
          red calc(100% - 1ch),
          red 100%)`
      : "#999",

    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  "& .MuiOutlinedInput-root:has(input:not(:placeholder-shown))::before":
    {
      display: "none",
    },

});

