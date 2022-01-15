import { DepositResponseProps, MetadataResponseProps } from '../interfaces/empire';
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
