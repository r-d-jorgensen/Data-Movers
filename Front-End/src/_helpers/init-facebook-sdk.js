import accountService from '../_services/accountService';

const facebookAppId = process.env.NODE_ENV === 'development'
  ? process.env.REACT_APP_FACEBOOK_APP_ID_DEV
  : process.env.REACT_APP_FACEBOOK_APP_ID;

export default function initFacebookSdk() {
  return new Promise((resolve) => {
    // Wait for facebook sdk to initialize before starting the react app
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: 'v12.0',
      });

      // Auto authenticate with the api if already logged in with facebook
      window.FB.getLoginStatus(({ authResponse }) => {
        if (authResponse) {
          accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
        } else {
          resolve();
        }
      });
    };
    // Load facebook sdk script
    (function fBLogCall(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      const js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
}
