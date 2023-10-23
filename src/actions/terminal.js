//import {
//  // Keygen,
//  //RegisterProxy
//} from "./fetch";

const wrapper = async (func) => {
  try {
    const result = await func();
    return result;
  } catch (error) {
    await log({
      type: "error",
      content: error,
    });

    return error;
  }
};

export const RegisterProxyWithCatch = () =>
  wrapper(async () => {
    return

    await RegisterProxy();
  });
export const KeygenWithCatch = () =>
  wrapper(async () => {
    return 0
    await Keygen();
  });
