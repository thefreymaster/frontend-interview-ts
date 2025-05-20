export interface IVendor {
  location: {
    address: string;
    city: string;
    country: string | null;
    lat: number;
    lon: number;
    postal_code: string;
    region: string;
  };
  store_number: string;
  merchant_name: string;
  merchant_id: string;
  transactions: ITransaction[];
}

export interface ITransaction {
  uid: string;
  year: number;
  month: number;
  account_id: string;
  account_owner: string;
  amount: number;
  category: string[];
  date: string;
  datetime: string | null;
  iso_currency_code: string;
  logo_url: string;
  merchant_name: string;
  name: string;
  payment_channel: string;
  transaction_id: string;
  transaction_type: string;
  website: string;
}
