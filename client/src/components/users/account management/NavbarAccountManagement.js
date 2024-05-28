import React from 'react';
import { IoAddCircleOutline, IoPencil, IoTrashSharp, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons';


function NavbarAccountManagement({
	setAdd, 
	setDelete,
	isDelete,
}) {
	return (
		<div className ="nav">   
			<ul>
				<li id = 'first'>
					ACCOUNT MANAGEMENT
				</li>
				<li>
				<button onClick={() => setAdd(true)}>
						<IconContext.Provider
							value ={{ color: '#FFFFFFFF', size:'44px'}}
						>
						<IoAddCircleOutline />
						</IconContext.Provider>
				</button>
	
				</li>
				<li>
				<button onClick={() => setDelete(!isDelete)}>
					<IconContext.Provider
					value ={{ color: '#FFFFFFFF', size:'44px'}}
					>
					<IoTrashSharp />
				</IconContext.Provider>
				</button>
				</li>
			</ul>
		</div>
	)
}

export default NavbarAccountManagement;