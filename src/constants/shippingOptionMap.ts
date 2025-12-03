export const shippingOptionMap = {
  upload: {
    useUserCourier: true,
    labelByMail: false,
    pickupOrDropOff: false,
  },
  mail: {
    useUserCourier: false,
    labelByMail: true,
    pickupOrDropOff: false,
  },
  courier: {
    useUserCourier: false,
    labelByMail: false,
    pickupOrDropOff: false,
  },
  eCopy: {
    useUserCourier: false,
    labelByMail: false,
    pickupOrDropOff: false,
  },
  pickup: {
    useUserCourier: false,
    labelByMail: false,
    pickupOrDropOff: true,
  },
} as const;
