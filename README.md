## Goal
Create a component that fetches a list of vendors, displays the vendors, and allows the user to click the vendor to view transactions for that vendor

## Library Hierarchy
- src
  - api
  - components
  - hooks
  - interfaces

## Requirements

1. The app should fetch the list of vendors, and display the name of each vendor
   1a. You can use the mock endpoint in api.ts to resolve the api response
   1b. The app should show a loading state when fetching, and and error state if an error is returned from the backend
2. The vendors should be in alphabetical order via `merchant_name`
3. The app should allow for clicking on a vendor, and displaying all transactions for that vendor below that vendor
   3a. The transactions should be in a column
   3b. Display fields `name`, `datetime`, `amount`, `transaction_id`
   3c. Format `datetime` to be `Sat Feb 10 2024`
4. There should be a search input that allows the user to filter vendors