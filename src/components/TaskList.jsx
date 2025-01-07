import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import { ProductService } from './service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import Header from './Header';
import { InputSwitch } from 'primereact/inputswitch';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns';
        
const TaskList =()=>{

    let emptyProduct = {
        task_id: null,
        start_time: '',
        end_time: '',
        priority: '',
        title:'',
        task_status: null,
        user_id: '',
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [isChecked, setIsChecked] = useState(false);
    const [startTime,setStartTime] = useState(null);
    const [endTime,setEndTime] = useState(null);
    const [newProdect,setNewProdect] = useState(false);
    const [newProdectDetail,setNewProdectDetail] = useState(emptyProduct);
    const [productStartTime,setProductStartTime] = useState(null);
    // const [productEndTime,setProductEndTime] = useState(null);
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
        var listofProdect=[];
        const prodectData = async ()=>{
           try {
            const result = await axios.get(baseUrl+'/api/items');
            console.log('res',result.data);
            for (let index = 0; index < result.data.length; index++) {
                if (result?.data[index]?.task_id) {
                    listofProdect.push(result.data[index])
                }
                
            }
            
            setProducts(listofProdect);
            
           } catch (error) {
            console.error('ApiError',error)
           }
        }
        prodectData();
    }, []);

    // const formatCurrency = (value) => {
    //     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    // };

    const openNew = () => {
        
        setProduct(emptyProduct);
        setSubmitted(false);
        setNewProdect(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setNewProdect(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        
        console.log('isChecked',isChecked);
        
        setSubmitted(true);
        let id = localStorage.getItem('userid');
        let addingUserId = { ...newProdectDetail };

        addingUserId[`user_id`] = id;
        setNewProdectDetail(addingUserId);
        console.log('productproduct',formattedStartTime);
        console.log('newprodect',addingUserId);
        
        if (isChecked) {
            addingUserId['task_status'] = 'Finished';
        }
        else{
            addingUserId['task_status'] = 'Pending';
        }
        console.log('newprodect',addingUserId);

        if (product.title.trim() || newProdectDetail.title.trim()) {
            console.log('products',products);
            let _products
            if (products != null) {
                _products = [ ...products];
            }
            let _product = { ...product };
            

            if (product.task_id) {

                if (isChecked) {
                    product['task_status'] = 'Finished';
                }
                else{
                    product['task_status'] = 'Pending';
                }

                const response = await axios.put(baseUrl+'/api/items/'+product.task_id,{
                    "title": product.title,
                    "start_time": formattedStartTime,
                    "end_time": formattedEndTime,
                    "priority": product.priority,
                    "task_status": product.task_status
                  });
                  console.log('response',response);
                  
                const index = findIndexById(product.task_id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            } else {
                const response = await axios.post(baseUrl+'/api/items/',{
                    "title": addingUserId.title,
                    "start_time": formattedStartTime,
                    "end_time": formattedEndTime,
                    "priority": addingUserId.priority,
                    "task_status": 'pending',
                    "user_id":addingUserId.user_id
                  });
                  console.log('respons addede',response);
                _products.push(response.data);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setProducts(_products);
            setNewProdect(false);
            setProductDialog(false);
            setNewProdectDetail(emptyProduct);
            setProduct(emptyProduct);
        }
    };

    const editProduct = (product) => {
        console.log('product',product);
        
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = products.filter((val) => val.id !== product.id);

        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < products.length; i++) {
            if (products[i].task_id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };
    const onInputChangeNew = (e, name) => {
        
        const val = (e.target && e.target.value) || e.value || '';
        let _product = { ...newProdectDetail };

        _product[`${name}`] = val;

        setNewProdectDetail(_product);
    };


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
            </div>
        );
    };

    // const rightToolbarTemplate = () => {
    //     return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    // };

    


    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.task_status} severity={getSeverity(rowData)}></Tag>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                {/* <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} /> */}
            </React.Fragment>
        );
    };

    const getSeverity = (product) => {
        switch (product.task_status) {
            case '"pending"':
                return 'warning';

            case '"finished"':
                return 'success';

            

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Tasks</h4>
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </IconField>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );
    const handleChange = (e) => {
        setIsChecked(e.value); 
      };
      const formattedStartTime = format(startTime, 'yyyy-MM-dd HH:mm:ss');

      const formattedEndTime = format(endTime, 'yyyy-MM-dd HH:mm:ss');
      const formattedProdectStart = format(productStartTime, 'yyyy-MM-dd HH:mm:ss');

    return(
        <>
        <Header />
            <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="task_id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products" globalFilter={globalFilter} header={header}>
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column field="task_id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="title" header="Title" sortable style={{ minWidth: '16rem' }}></Column>
                    <Column field="priority" header="priority" sortable></Column>
                    <Column field="start_time" header="start_time" sortable style={{ minWidth: '8rem' }}></Column>
                    <Column field="end_time" header="end_time" sortable style={{ minWidth: '10rem' }}></Column>
                    {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column> */}
                    <Column field="task_status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Title
                    </label>
                    <InputText id="name" value={product.title ? product.title:''} onChange={(e) => onInputChange(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Priority
                    </label>
                    <InputNumber id="description" value={product.priority ? product.priority:0} onChange={(e) => onInputChange(e, 'priority')} required rows={3} cols={20} />
                    <div className="card flex justify-content-center">
                        <InputSwitch checked={isChecked} onChange={handleChange} />
                        <label>{isChecked ? 'Finished' : 'Pending'}</label>
                    </div>
                </div>

                {/* <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div> */}

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Start-Time
                        </label>
                        <Calendar id="calendar-12h" value={product.start_time ? product.start_time:''} onChange={(e) => setStartTime(e.value)} showTime hourFormat="12" />
                        {/* <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" /> */}
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            End-Time
                        </label>
                        <Calendar id="calendar-12h" value={product.end_time ? product.end_time:''} onChange={(e) => setEndTime(e.value)} showTime hourFormat="12" />
                        {/* <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} /> */}
                    </div>
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={newProdect} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Product Details" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {/* {newProdectDetail.image && <img src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.image} className="product-image block m-auto pb-3" />} */}
                <div className="field">
                    <label htmlFor="name" className="font-bold">
                        Title
                    </label>
                    <InputText id="name1" value={newProdectDetail.title ? newProdectDetail.title:''} onChange={(e) => onInputChangeNew(e, 'title')} required autoFocus className={classNames({ 'p-invalid': submitted && !newProdectDetail.title })} />
                    {submitted && !newProdectDetail.title && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Priority
                    </label>
                    <InputNumber id="description" value={newProdectDetail.priority ? newProdectDetail.priority:0} onChange={(e) => onInputChangeNew(e, 'priority')} required rows={3} cols={20} />
                    <div className="card flex justify-content-center">
                        <InputSwitch checked={isChecked} onChange={handleChange} />
                        <label>{isChecked ? 'Finished' : 'Pending'}</label>
                    </div>
                </div>

                

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Start-Time
                        </label>
                        <Calendar id="calendar-12h" value={newProdectDetail.start_time ? newProdectDetail.start_time:''} onChange={(e) => setStartTime(e.value)} showTime hourFormat="12" />
                        {/* <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" /> */}
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            End-Time
                        </label>
                        <Calendar id="calendar-12h" value={newProdectDetail.end_time ? newProdectDetail.end_time:''} onChange={(e) => setEndTime(e.value)} showTime hourFormat="12" />
                        {/* <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} /> */}
                    </div>
                </div>
            </Dialog>

            {/* <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog> */}
        </div>

        {/* <h2>list page</h2> */}
        </>
    )
}
export default TaskList