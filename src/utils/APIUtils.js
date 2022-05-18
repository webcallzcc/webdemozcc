import 'whatwg-fetch'

var urlOpenAPI = window.SETTING.urlOpenAPI;
var accessToken = window.SETTING.accessToken;

export default class APIUtils {
	static setAccessToken(token) {
		accessToken = token;
	}

	static setHostAPI(host) {
		urlOpenAPI = host;
	}

	static post(url = '', data = {}) {
		let fullUrl = urlOpenAPI + url;

		return new Promise((resolve, reject) => {
			fetch(fullUrl, {
				method: 'POST',
				headers: {
					'access_token': accessToken
				},
				body: JSON.stringify(data)
			}).then(resp => {
				return resp.json()
			}).then(returnedValue => {
				if (returnedValue && returnedValue.error == 0) {
					if (returnedValue.data) {
						resolve(returnedValue.data)
					} else {
						resolve(returnedValue)
					}
				} else {
					reject(returnedValue ? returnedValue.message : 'Error');
				}
			}).catch(function (ex) {
				if (ex) {
					reject(ex)
				}
			});
		})
	}

	static get(url = '', data = {}) {
		let fullUrl = urlOpenAPI + url;
		if (data) {
			fullUrl = fullUrl + "?data=" + JSON.stringify(data);
		}
		return new Promise((resolve, reject) => {
			try {
				fetch(fullUrl, {
					method: 'GET',
					headers: {
						'access_token': accessToken
					},
				}).then(resp => {
					return resp.json()
				}).then(returnedValue => {
					if (returnedValue && returnedValue.data && returnedValue.error == 0) {
						if (returnedValue.data) {
							resolve(returnedValue.data)
						} else {
							resolve(returnedValue)
						}
					} else {
						reject(returnedValue ? returnedValue.message : 'Error');
					}
				}).catch(function (ex) {
					if (ex) {
						reject(ex)
					}
				});
			} catch (ex) {

			}

		})
	}


}


window.APIUtils = APIUtils
