import { USER_CONFIG } from './config/index';
import { initEmpireSocket } from './empire';
import { loginSteam } from './utils/steam';

const main = () => {
  initUser();
};

const initUser = async () => {
  for (let i = 0; i < USER_CONFIG.length; i++) {
    await loginSteam(USER_CONFIG[i]);
    if (USER_CONFIG[i].empire.active) {
      initEmpireSocket(USER_CONFIG[i]);
    }
  }
};

main();
