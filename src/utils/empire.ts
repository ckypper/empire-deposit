import { DepositResponseProps, Item, MetadataResponseProps } from '../interfaces/empire';
import axios from 'axios';
import { message, Status } from './message';
import { ConfigProps } from '../interfaces';

export const getHeaders = (config: ConfigProps) => {
  return {
    headers: {
      Authorization: `Bearer ${config.empire.apikey}`,
    },
  };
};

export const getMetadata = async (config: ConfigProps) => {
  try {
    const url = `https://csgoempire.com/api/v2/metadata/socket`;
    const { data } = await axios.get<MetadataResponseProps>(url, getHeaders(config));
    return data;
  } catch (error) {
    message(config, `Cannot get metadata due to ${error.message}`, Status.FAILED);
    return null;
  }
};

export const getCurrentDeposits = async (config: ConfigProps) => {
  try {
    const url = `https://csgoempire.com/api/v2/trading/user/trades`;
    const { data: response } = await axios.get<DepositResponseProps>(url, getHeaders(config));
    message(config, `You currently have ${response.data.deposits.length} items in deposit`, Status.SUCCESS);
    return response.data.deposits;
  } catch (error) {
    message(config, `Cannot get current deposit due to "${error.message}"`, Status.FAILED);
    return null;
  }
};

export const delistItem = async (config: ConfigProps, item: Item, orgValue: number) => {
  try {
    message(
      config,
      `Try to delist item ${item.market_name} cause price drop from ${orgValue} to ${item.market_value}`,
      Status.SUCCESS,
    );
    const url = `https://csgoempire.com/api/v2/trading/deposit/${item.id}/cancel`;
    await axios.post(url, getHeaders(config));
    message(config, `Delist item ${item.market_name} successfully`, Status.SUCCESS);
    return true;
  } catch (error) {
    message(config, `Delist item ${item.market_name} failed due to "${error.message}"`, Status.FAILED);
    return null;
  }
};

export const noteHwangTrade = async (config: ConfigProps, assetId: string, price: number) => {
  try {
    const url = `https://hwang-trade.vercel.app/api/item-trading/sell`;
    await axios.post(
      url,
      {
        asset_id: assetId,
        sold_price: price,
        sold_site: 'csgoempire',
      },
      {
        headers: {
          'x-api-key': config.hwang.apikey,
        },
      },
    );
    message(config, `Note sold item successfully`, Status.SUCCESS);
    return true;
  } catch (error) {
    message(config, `Note sold item failed due to ${error.message}`, Status.FAILED);
    return null;
  }
};
