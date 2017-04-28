/**
 * Created by Unuse on 2017/4/24.
 */

export const isValidSessionData = () => {
  let token = sessionStorage.getItem('token');
  let userData = sessionStorage.getItem('userData');
  if (null === token || typeof token === 'undefined' ||'' === token) {
    return false;
  }
  if (null === userData || typeof userData === 'undefined' || '' === userData) {
    return false;
  }
  return true;
};

export const isValidValue = (value) => {
  if (null === value || typeof value === 'undefined' || '' === value) {
    return false;
  }
  return true;
};

export const dateFormat = (value, pattern) => {
  let date = null;
  if (null === value || typeof value === 'undefined') {
    return '';
  } else {
    date = new Date(value);
  }
  return date.format(pattern);
};

