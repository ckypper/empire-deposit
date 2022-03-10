import { Item, TradeDataProps, TradeStatusProps } from './interfaces/empire';
import { getMetadata, getCurrentDeposits, delistItem } from './utils/empire';
import { message, Status } from './utils/message';
import io from 'socket.io-client';
import { ConfigProps } from './interfaces';
import { sendOffer } from './utils/steam';
import { EmpireStatus } from './constant';

const depositItemsManager = {};
const sendedOffer = [];

export const initEmpireSocket = async (config: ConfigProps) => {
  const socket = io(`wss://trade.csgoempire.com/trade`, {
    transports: ['websocket'],
    path: '/s/',
    secure: true,
    forceNew: true,
    rejectUnauthorized: false,
    reconnect: true,
    extraHeaders: {
      'User-agent': `${config.empire.uid} API BOT`,
    },
  });

  socket.on('connect', () => {
    onEmpireConnect(socket, config);
  });

  socket.on('init', (data: any) => onEmpireInit(data, config));

  socket.on('trade_status', (msg: TradeStatusProps) => onEmpireTrade(msg, config));

  socket.on('updated_item', (msg: Item) => onEmpireUpdate(msg, config));

  socket.on('error', async (err: any) => {
    message(config, `Cannot connect to empire due to ${err.message}`, Status.FAILED);
  });

  setInterval(() => {
    socket.emit('timesync');
  }, 30000);
};

const onEmpireUpdate = async (msg: Item, config: ConfigProps) => {
  const depositItem = depositItemsManager[msg.id.toString()];
  if (depositItem) {
    const orgValue = depositItem.price;
    const acceptPercent = (config.empire.acceptThreshold || 0) / 100 + 1;
    const priceAccepted = Math.round(msg.market_value * acceptPercent);
    if (priceAccepted < orgValue) {
      await delistItem(config, msg, orgValue);
    }
  }
};

const processSentOffer = async (data: TradeDataProps, config: ConfigProps) => {
  const { trade_url } = data.metadata;
  if (!trade_url) {
    message(config, `Cannot send ${data.items[0].market_name} due to buyer doesn't have trade url`, Status.FAILED);
    return;
  }
  sendedOffer.push(data.id);
  await sendOffer(config, data.items[0], trade_url);
};

const onProcessTrade = (config: ConfigProps, data: TradeDataProps) => {
  const itemName = data.items[0].market_name;
  const itemTotalValue = data.total_value;
  const orgValue = depositItemsManager[data.id].price;
  const acceptPercent = (config.empire.acceptThreshold || 0) / 100 + 1;
  const priceAccepted = Math.round(itemTotalValue * acceptPercent);
  if (priceAccepted >= orgValue) {
    if (!sendedOffer.includes(data.id)) {
      processSentOffer(data, config);
    }
  } else {
    message(
      config,
      `Ignore sent ${itemName} due to dropped price from ${orgValue} to ${itemTotalValue}`,
      Status.FAILED,
    );
  }
};

const onEmpireTrade = async (msg: TradeStatusProps, config: ConfigProps) => {
  if (msg.type !== 'deposit') {
    return;
  }

  const itemName = msg.data.items[0].market_name;
  const itemTotalValue = msg.data.total_value;

  if (msg.data.status === EmpireStatus.PROCESSING && msg.data.status_message === undefined) {
    depositItemsManager[msg.data.id] = {
      name: itemName,
      price: itemTotalValue,
    };
    message(config, `${itemName} has been listed for ${itemTotalValue} coins`, Status.SUCCESS);
    return;
  }

  switch (msg.data.status_message) {
    case 'Sending':
      onProcessTrade(config, msg.data);
      break;
    case 'Completed':
      message(config, `${itemName} has sold for ${itemTotalValue} coins`, Status.SUCCESS);
      break;
    case 'Timeout':
      message(config, `${itemName} was not accepted by buyer`, Status.FAILED);
      break;
    case 'Canceled':
      message(config, `${itemName} was canceled by user`, Status.FAILED);
      break;
  }
};

const onEmpireConnect = async (socket: any, config: ConfigProps) => {
  message(config, 'Connected to empire', Status.SUCCESS);
  const meta = await getMetadata(config);
  if (meta) {
    socket.emit('identify', {
      uid: meta.user.id,
      model: meta.user,
      authorizationToken: meta.socket_token,
      signature: meta.socket_signature,
    });
  }
};

const onEmpireInit = async (data: any, config: ConfigProps) => {
  if (data && data.authenticated) {
    message(config, 'Authenticated to empire successfully', Status.SUCCESS);
    const deposits = await getCurrentDeposits(config);
    if (deposits) {
      deposits.forEach((item) => {
        depositItemsManager[item.id] = {
          price: item.total_value,
          name: item.items[0].market_name,
        };

        if (item.status_message === 'Sending') {
          onProcessTrade(config, item);
        }
      });
    }
  }
};
