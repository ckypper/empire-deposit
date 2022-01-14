import { TradeDataProps, TradeStatusProps } from './interfaces/empire';
import { getMetadata, getCurrentDeposits } from './utils/empire';
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
      'User-agent': config.userAgent,
    },
  });

  socket.on('connect', () => {
    onEmpireConnect(socket, config);
  });

  socket.on('init', (data: any) => onEmpireInit(data, config));

  socket.on('trade_status', (msg: TradeStatusProps) => onEmpireTrade(msg, config));

  socket.on('error', async (err: any) => {
    message(config, `Cannot connect to empire due to ${err.message}`, Status.FAILED);
  });

  setInterval(() => {
    socket.emit('timesync');
  }, 30000);
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

  const orgItemPrice = depositItemsManager[msg.data.id].price;

  switch (msg.data.status_message) {
    case 'Sending':
      if (itemTotalValue >= orgItemPrice) {
        if (!sendedOffer.includes(msg.data.id)) {
          processSentOffer(msg.data, config);
        }
      } else {
        message(
          config,
          `Ignore sent ${itemName} due to dropped price from ${orgItemPrice} to ${itemTotalValue}`,
          Status.FAILED,
        );
      }
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
      uuid: config.empire.uuid,
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
          if (!sendedOffer.includes(item.id)) {
            processSentOffer(item, config);
          }
        }
      });
    }
  }
};
