function Login() {

    this.checkFbLogin = checkFbLogin;
    this.checkForFbAccessCode = checkForFbAccessCode;
    this.getFbAccessToken = getFbAccessToken;
    this.getUserInfo = getUserInfo;

    return this;

    function checkFbLogin() {
        window.location.href = 'https://www.facebook.com/v2.10/dialog/oauth?client_id=725598060832930&redirect_uri=http://unusualdev.com/thechase/';
    }

    function checkForFbAccessCode() {
        var url = new URL(window.location.href);
        return url.searchParams.get("code");
    }

    function getFbAccessToken(code) {
        /*if (code)
            $.get(
                'https://graph.facebook.com/v2.10/oauth/access_token?client_id=725598060832930&redirect_uri=http://unusualdev.com/thechase/&client_secret=e217cc077e95f1a727147cdc69b2ab03&code='+code,
                fetchUserInfo
            );*/
    }

    function fetchUserInfo(info) {
        /*if (info.access_token) {
            user.accessToken = info.access_token;
            $.get(
                'https://graph.facebook.com/me?fields=first_name,name,gender,picture,birthday,age_range,hometown,locale,location&access_token='+user.accessToken,
                    function(res) {
                        user.firstName = res.first_name;
                        user.name = res.name;
                        user.fbId = res.id;
                        user.picture = res.picture.data.url;
                    }
                );
        }*/
    }

    function getUserInfo() {
        return user;
    }

}