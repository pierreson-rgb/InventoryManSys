import axios from 'axios';

async function CategoryEditAPI({categoryData}){
    try{
        let url = '/product/'+categoryData.category_ID;
        const result = await axios.put(url, JSON.stringify(categoryData),
        {
            mode: 'cors',
			withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return result.data;
    }
    catch(err){
        console.log(err)
        throw new Error(err.response.data);
    }
}

export default CategoryEditAPI;