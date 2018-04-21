var url = "https://api.nytimes.com/svc/topstories/v2/";

export default function(title) {
	url += title+".json";
	return fetch(url, {
		method: 'GET',
		headers: new Headers({
			'api-key': "323ff0bb70704070af9da98cfd3ae91a"
		})
	})
	.then(function(response) {
		return response.text();
	}).then(function(text) {
		let json = JSON.parse(text);
		return json;
	});
}