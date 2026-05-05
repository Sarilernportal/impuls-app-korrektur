export const updateCarrier = /* GraphQL */ `
  mutation UpdateCarrier(
    $input: UpdateCarrierInput!
    $condition: ModelCarrierConditionInput
  ) {
    updateCarrier(input: $input, condition: $condition) {
      id
      name
      shortName
      street
      addressExtra
      houseNumber
      postalCode
      city
      phone
      useBillingAddress
      billingStreet
      billingAddressExtra
      billingHouseNumber
      billingPostalCode
      billingCity
      email
      allowAutoInvoice
      createdAt
      updatedAt
      __typename
    }
  }
`;