## Goal
Create a component that fetches a list of vendors, displays the vendors, and allows the user to click the vendor to view transactions for that vendor
Requirements

1. The component should fetch the list of vendors, and display all fields for each vendor
   1a. The component should fetch from the mock api endpoint in `/api`
   1b. The compoonent should show a loading state when fetching, and and error state if an error is returned from the backend
   1b. Use Flex or Grid, not table
   1c. The entire component should stack each vendor in a column
   1d. Each row should occupy the entire width of the screen
2. The vendors should be in alphabetical order via `merchant_name`
3. The component should allow for clicking on a vendor, and displaying all transactions for that vendor below that vendor
   3a. The transactions should be in a column
   3b. Display fields `name`, `datetime`, `amount`, `transaction_id`
   3c. Format `datetime` to be `Sat Feb 10 2024`
4. There should be a search input that allows the user to filter vendors