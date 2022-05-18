
import APIUtils from './APIUtils'


class ZaloOpenAPI {

    static getfollowers(offset, count) {
        return APIUtils.get("/getfollowers", { offset: offset, count: count });
    }
    static getInfofollower(user_id) {
        return APIUtils.get("/getprofile", { user_id: user_id });
    }

    static requestConsent(user_id, call_type, reason_code) {
        user_id = user_id + "";
        var data = { call_type, reason_code };
        if (user_id.startsWith("+")) {
            data.phone = user_id.substring(1);
        } else if (user_id.length > 12) {
            data.user_id = user_id + "";
        } else {
            data.phone = user_id;
        }
        return APIUtils.post("/call/requestconsent", data);
    }

    static checkConsent(user_id) {
        user_id = user_id + "";
        var data = {};
        if (user_id.startsWith("+")) {
            data.phone = user_id.substring(1);
        } else if (user_id.length > 12) {
            data.user_id = user_id;
        } else {
            data.phone = user_id;
        }
        return APIUtils.get("/call/checkconsent", data);
    }


    static async getfollowerAlls(cb) {
        var i = 0;
        var count = 20;
        var followers = []
        try {
            while (i < 1000) {
                var data = await this.getfollowers(i, count);

                if (!data || !data.followers || !data.total)
                    break;


                var listfollower = []
                for (var k in data.followers) {
                    var profile = {}

                    try {
                        var follower = data.followers[k];
                        profile = { user_id: follower.user_id };
                        var dataInfo = await this.getInfofollower(follower.user_id);
                        if (dataInfo) {
                            profile = dataInfo;
                        }
                    } catch (ex) {

                    }
                    listfollower.push(profile)
                }


                followers = followers.concat(listfollower);

                if (followers.length >= data.total - 1) {
                    break;
                }
                i = followers.length;
            }
        } catch (ex) {

        }
        cb(followers);
    }

}

export default ZaloOpenAPI;
window.ZaloOpenAPI = ZaloOpenAPI;