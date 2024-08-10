// src/services/product/productActions.js
import ImportProduct from './../../services/landing/importProduct';

export const handleSaveProduct = async (id, formData, file, setIncome, setSnackbarOpen, setErrorMsg, dialog, setDialog, setModalOpen) => {
  try {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (file) {
      data.append('file', file);
    }

    if (id) {
      // Edit mode
      await ImportProduct.putProductById(id, data);

      const updatedItem = await ImportProduct.getProductById(id);
      setIncome(prevIncome => prevIncome.map(c => (c.id === updatedItem.id ? updatedItem : c)));
    } else {
      // Post mode
      const newItem = await ImportProduct.postProduct(data);
      setIncome(prevIncome => [...prevIncome, newItem]);
    }

    window.location.reload(); // Sahifani yangilash
  } catch (error) {
    setErrorMsg(error.response?.data?.provider?.[0] || error.message || 'Xatolik yuz berdi');
    setSnackbarOpen(true);
  } finally {
    setDialog({ type: '', open: false, item: null });
    setModalOpen(false);
  }
};

export const handleDeleteProduct = async (id, setIncome, setSnackbarOpen, setErrorMsg) => {
  try {
    await ImportProduct.deleteProduct(id);
    setIncome(prevIncome => prevIncome.filter(c => c.id !== id));
  } catch (error) {
    setErrorMsg(error.response?.data?.detail || error.message || 'Xatolik yuz berdi');
    setSnackbarOpen(true);
  }
};
