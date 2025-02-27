export default class Utils {
  // set local storage
  static setStore = (name, content) => {
    try {
      if (!name) {
        console.warn('Utils.setStore: No name provided');
        return;
      }
      
      if (typeof content !== "string") {
        content = JSON.stringify(content);
      }
      
      window.localStorage.setItem(name, content);
      console.log(`Successfully stored ${name}:`, content); // Debug log
      
      // Verify storage
      const stored = window.localStorage.getItem(name);
      if (!stored) {
        console.error('Storage verification failed for:', name);
      }
      
      return true;
    } catch (error) {
      console.error('Error in setStore:', error);
      return false;
    }
  };

  // get local storage
  static getStore = (name) => {
    try {
      if (!name) {
        console.warn('Utils.getStore: No name provided');
        return null;
      }
      
      const item = window.localStorage.getItem(name);
      if (!item) {
        console.warn(`No item found in storage for: ${name}`);
        return null;
      }
      
      return JSON.parse(item);
    } catch (error) {
      console.error('Error in getStore:', error);
      return null;
    }
  };

  // remove item
  static removeItem = (name) => {
    try {
      if (!name) {
        console.warn('Utils.removeItem: No name provided');
        return;
      }
      
      window.localStorage.removeItem(name);
      console.log(`Removed item: ${name}`);
      return true;
    } catch (error) {
      console.error('Error in removeItem:', error);
      return false;
    }
  };

  // validate email
  static isValidEmail = (value) => {
    return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,64}$/i.test(value)
      ? false
      : true;
  };
}
