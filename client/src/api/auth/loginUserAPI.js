import axios from 'axios';

export const loginUserAPI = async (data) => {

	try{
		const result = await axios.post("/auth/login", 
		JSON.stringify({
			email: data.email,
			password: data.password
		}),
			{
				withCredentials: true,
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)

		if (result.status !== 200){
			throw new Error("Error logging in. Please try again.");
		}

		//return userdata
		const userdata = result.data.userdata;
		return userdata
	} catch(err){
		console.log(err);
		throw err;
	}
} 