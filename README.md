## Goal
Create an application that fetches a list of merchants, displays the merchants, and allows the user to route to the merchant and to view transactions for that merchant

## Library Hierarchy
- src
  - api
  - components
  - hooks
  - interfaces
  - router

## Requirements

1. The app should fetch the list of merchants, and display the name of each merchant in a MerchantsList component
   1a. Use the mock endpoint in api.ts to resolve the api response, the useMerchants hook is available
   1b. The app should show a loading state when fetching, and and error state if an error is returned from the backend
2. The merchants should be in alphabetical order via `merchant_name`
3. When the user clicks a merchant, the app should route to that merchant via `merchant_id`
   3a. The Merchant component should display the selected `merchant_id`
   3b. The Merchant component should show transactions the selected `merchant_id`
   3c. Display the `account_owner`, `datetime`, and `amount`
   3d. Format `datetime` ISO format 
4. Implement merchant search functionality on the MerchantList component

### Stretch Goals
4. Search functionality that allows the user to filter the list of merchants