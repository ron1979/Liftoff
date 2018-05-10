const BASE_URL = 'http://localhost:3000';

function login(user) {
	return axios
		.post(`${BASE_URL}/login`, user)
		.then(res => res.data)
		.catch(err => {
			throw new Error('Login Failed');
		});
}

function register(user) {
	return axios
		.post(`${BASE_URL}/register`, user)
		.then(res => res.data)
		.catch(err => {
			throw new Error('Register Failed');
		});
}

function logout() {
	// return axios
	// 	.post(`${BASE_URL}/logout`)
	// 	.then(res => {
	// 		delete sessionStorage.user;
	// 	})
	// 	.catch(err => {
	// 		throw new Error('Logout Failed');
	// 	});
  return axios
    .post(`${BASE_URL}/logout`)
    .then(res => {
      console.log(res);
    })
    .catch(err => {throw new Error('Logout Failed')})
}
function updateWallet(user) {
	return axios.put(`${BASE_URL}/updateWallet`, user).then(res => res.data);
}
function addFavorites(user, projId) {
	return axios
		.put(`${BASE_URL}/favorite`, { user, projId, add: true })
		.then(res => {
      res.data
    console.log('data')
    });
}


function getById(userId) {
	return axios.get(BASE_URL + '/user/' + userId).then(res => res.data);
}



// function removeFavorite(user,projId) {
//  return axios.delete(`${BASE_URL}/updateWallet`, {user,projId}).then(res => res.data)
// }

export default {
	login,
	register,
	logout,
	updateWallet,
	// removeFavorite,
  addFavorites,
  getById
};
