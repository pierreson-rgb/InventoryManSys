import './css/App.css';
import { useEffect, useState } from 'react';


//UI components
import Sidebar from './components/sidebar/sidebar';
import Navbar from './components/navbar';
import Popup from './components/Popup';

//popup components
import DeletePopup from './components/popups/deleteProductPopup';
import PopupMessage from './components/popups/popupMessage';
import AddProductPopup from './components/popups/addProductPopup';


//table components
import ProductTable from './components/table/Product Table/productTable';


//state containers
import AddProductState from './containers/addProductState';
import DetailEditState from './containers/detailEditState';

//api functions
import ProductAddAPI from './api/product/ProductAddAPI';
import ProductGetAPI from './api/product/ProductGetAPI';
import ProductEditAPI from './api/product/ProductEditAPI';
import ProductDeleteAPI from './api/product/ProductDeleteAPI';
import CategoryAddAPI  from './api/pcategory/CategoryAddAPI';
import CategoryGetAPI from './api/pcategory/CategoryGetAPI';
import CategoryEditAPI from './api/pcategory/CategoryEditAPI';
import CategoryDeleteAPI from './api/pcategory/CategoryDeleteAPI';

import { useAuth } from './auth/authContext';
import { SearchBar } from './components/SearchBar';


function App() {

	const {user, logout} = useAuth();

	const [statusPopup, setStatusPopup] = useState(false);
	const [deletePopup, setDeletePopup] = useState(false);
	const [addPopup, setAddPopup] = useState(false);

	//selected product from table column
	const [detailType, setDetailType] = useState(0);
	const [selectedProduct, setSelectedProduct] = useState({});

	//general popup message states
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('Loading...');

	//delete states
	const [isDelete, setDelete] = useState(false);
	const [isDeleteConfirm, setDeleteConfirm] = useState(false);
	const [productsToDelete, setProductsToDelete] = useState([]);
	const [categoriesToDelete, setCategoriesToDelete] = useState([]);

	//fetched data to store
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);

	//loading states
	const [isFetching, setIsFetching] = useState(false);	//tells table to display loading
	const [isUpdating, setIsUpdating] = useState(false);	//tells app to fetch upon success
	const [isLoading, setIsLoading] = useState(true);		//tells app when operation is being performed

	//update sales and stock
	const [salesUpdate, setSalesUpdate] = useState({});
	const [stockUpdate, setStockUpdate] = useState({});

	//authentication state
	const [isAuth, setIsAuth] = useState(false);
	
	//filter category state
	const [filterCategory, setFilterCategory] = useState([]);

	//filter by name
	const [showSearch, setShowSearch] = useState(false);
	const [nameFilter, setNameFilter] = useState('');

	//actual displayed products
	const [displayedProducts, setDisplayedProducts] = useState([]);


	/*************************************
	 *          Popup functions          *
	 *************************************/
	
	const updateDisplay = (message) => {
		setIsUpdating(true);
		setIsLoading(false);
		setMessage(message);
		setIsSuccess(true);
		setStatusPopup(true);
	}

	const errorPopup = (error) => {
		setMessage(error);
		setIsLoading(false);
		setIsSuccess(false);
		setStatusPopup(true);
	}

	const closePopup = () => {
		setStatusPopup(false);
		setIsLoading(false);
		setMessage('Loading...');
		setIsSuccess(false);
	}

	/*************************************
	 * 		    API Call functions       *
	 *************************************/

	//adds a product using data (used in add popup)
	const addProduct = async (data) => {
		setIsLoading(true);
		try{
			setStatusPopup(true);
			await ProductAddAPI(data)
			updateDisplay('Product added successfully.');
		}
		catch(err){
			console.log(err);
			errorPopup(String(err))
		}
	}
	const addCategory = async (data) => {
		setIsLoading(true);
		try{
			setStatusPopup(true);
			await CategoryAddAPI(data)
			updateDisplay('Category added successfully.');
		}
		catch(err){
			console.log(err);
			errorPopup(String(err))
		}
	}

	//delets a list of products using productIDList (used in delete popup)
	const deleteProduct = async () => {
		setIsLoading(true);
		try{
			await ProductDeleteAPI({productIDList: productsToDelete});
			updateDisplay('Product deleted successfully.');
		}
		catch(err){
			errorPopup(String(err))
		}
	}

	const deleteCategory = async () => {
		setIsLoading(true);
		try{
			await CategoryDeleteAPI({categoryIDList: categoriesToDelete});
			updateDisplay('Category deleted successfully.');
		}
		catch(err){
			errorPopup(String(err))
		}
	}

	//fetches data from api
	const fetchData = async () => {
		setIsFetching(true);
		try{	
			const resProducts = await ProductGetAPI();
			const resCategories = await CategoryGetAPI();

			//append brand to product name
			resProducts.forEach(product => {
				product.name = product.name + ' - ' + product.brand;
			});

			setProducts(resProducts);
			setCategories(resCategories);
			
		}catch(err){
			setMessage(String(err));
		}
		setIsFetching(false);
	}

	//edits a product using data (used in edit popup)
	const editProduct = async (data) => {
		setIsLoading(true);
		try{
			setStatusPopup(true);
			const {name, brand, type, ...updateData} = data;
			await ProductEditAPI({productData: updateData})
			updateDisplay('Product edited successfully.');
		}
		catch(err){
			errorPopup(String(err));
		}
	}

	const editCategory = async (data) => {
		setIsLoading(true);
		try{
			setStatusPopup(true);
			await CategoryEditAPI({categoryData: data})
			updateDisplay('Category edited successfully.');
		}
		catch(err){
			errorPopup(String(err));
		}
	}
	//clears data in selected product and detail type
	const clearSelect = () => {
		setSelectedProduct({});
		setDetailType(0);
	}

	/*************************************
	 * 		    React Hooks              *
	 *************************************/

	//initialization
	useEffect(() => {
		fetchData();
		if (user.type === "Admin")
			setIsAuth(true);
	}, []);

	//update table when product table is updated (add, delete, edit)
	useEffect(() => {
		if (isUpdating === false) return;
		fetchData();
		setIsUpdating(false);
	}, [isUpdating]);

	//delete call
	useEffect(() => {
		if (isDeleteConfirm === false) return;
		//delete products
		deleteProduct();
		setStatusPopup(true);
		//reset delete state
		setDelete(false);
		setDeleteConfirm(false);
	}, [isDeleteConfirm]);

	//update sales
	useEffect(() => {
		if (Object.keys(salesUpdate).length === 0) return;

		if (salesUpdate["sales"] < 0){
			errorPopup("Sales cannot go below 0.")
			setSalesUpdate({});
			return;
		}
		else{
			//edit the product sent with the sales update
			editProduct(salesUpdate);
			setStatusPopup(true);
		}

		setSalesUpdate({});
	}, [salesUpdate]);

	//update stock
	useEffect(() => {
		if (Object.keys(stockUpdate).length === 0) return;
		console.log(stockUpdate)
		if (stockUpdate["stock"] < 0){
			errorPopup("Stock cannot go below 0.")
			setStockUpdate({});
			return;
		}
		else{
			//edit the product sent with the stock update
			editProduct(stockUpdate);
			setStatusPopup(true);
		}
		
		setStockUpdate({});
	}, [stockUpdate]);


	
	//filter out products that are not in the selected category
	useEffect(() => {
		if (Object.keys(filterCategory).length === 0 || filterCategory.category_ID === 0) {
			setDisplayedProducts(products);
			setNameFilter('');
			return;
		};
		
		const filteredProducts = products.filter(product => product.type === filterCategory.category_ID);
		setIsFetching(true);
			setDisplayedProducts(filteredProducts);
			setNameFilter('');
		setIsFetching(false);
	}, [filterCategory, products]);

	useEffect(() => {
		setNameFilter('');
	}, [showSearch])


	/*************************************
	 * 		    	 Render              *
	 *************************************/
	return(
		<div className="Container">

			<Sidebar 
				categories={categories}
				setFilterCategory={setFilterCategory}
				isDelete={isDelete} 
				setDelete={setDelete} 
				setDeletePopup={setDeletePopup} 
				logout={logout}
				name={user.name}
				password={user.password}
				isAuth={isAuth}
			/>

			<Navbar 
				setAdd={setAddPopup} 
				setDelete={setDelete}
				showSearch={showSearch}
				setShowSearch={setShowSearch}
				isDelete={isDelete} 
				isAuth={isAuth}
			>
				{showSearch ? <SearchBar
					nameFilter={nameFilter}
					setNameFilter={setNameFilter}
					/> 
				: null}
			</Navbar>

			<main className ="content">
				<ProductTable 
					data={displayedProducts} 
					isFetching={isFetching} 
					isDelete={isDelete}
					nameFilter={nameFilter}
					setSelectedRowData={setProductsToDelete}  
					setCurrentSelectedProduct={setSelectedProduct}
					setShowType={setDetailType}
					setUpdateStock={setStockUpdate}
					setUpdateSales={setSalesUpdate}
				/>
			</main>
	
			<AddProductState 
				addPopup={addPopup} 
				setAddPopup={setAddPopup}
				addProduct={addProduct} 
				categories={categories} 
			/>

	
			<Popup trigger = {statusPopup} id="Message">
				<PopupMessage 
					isSuccess={isSuccess} 
					message={message} 
					setClose={closePopup} 
					isLoading={isLoading}
				/>
			</Popup>

			<Popup trigger = {deletePopup} id="Delete">
				<DeletePopup 
					setDelete={setDeleteConfirm} 
					setDeletePopup={setDeletePopup} 
				/>
			</Popup>

			<DetailEditState 
				editProduct={editProduct}
				selectedProduct={selectedProduct}
				detailType={detailType}
				clearSelect={clearSelect}
			/>

		</div>
	);
}
export default App;