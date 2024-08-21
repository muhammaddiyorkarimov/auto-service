import React, { useState, useEffect } from 'react';
import { IconButton, TextField, Button, FormControl, FormHelperText } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Loader from '../../helpers/loader/Loader';
import './DataTable.css';
import NotAvailable from './../../helpers/notAvailable/NotAvailale';

function DataTable({ loading, error, tableHead, data, onDelete, onEdit, onRowClick, onSave, formConfig }) {
    const [inputValues, setInputValues] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        const initialData = formConfig?.reduce((acc, field) => {
            acc[field.name] = '';
            return acc;
        }, {});
        setInputValues(initialData);
    }, [formConfig]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <NotAvailable message="Xatolik yuz berdi, ma'lumotni olishda muammo mavjud." />;
    }

    if (!data || data.length === 0) {
        return <NotAvailable message="Ma'lumot topilmadi" />;
    }

    const handleInputChange = (name, value) => {
        setInputValues({
            ...inputValues,
            [name]: value,
        });
        setValidationErrors({ ...validationErrors, [name]: '' }); // Xatolikni tozalash
    };

    const handleAddRow = () => {
        const errors = {};
        formConfig.forEach((field) => {
            if (field.required && !inputValues[field.name]) {
                errors[field.name] = `${field.label} maydoni to'ldirilishi shart!`;
            }
        });

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        onSave(inputValues);
        setInputValues({});
    };

    // const renderFields = () => {
    //     return formConfig?.map((field, index) => {
    //         switch (field.type) {
    //             case 'text':
    //             case 'number':
    //                 return (
    //                     <FormControl key={index} fullWidth margin="dense" size="small" error={!!validationErrors[field.name]}>
    //                         <TextField
    //                             margin="dense"
    //                             label={field.label}
    //                             name={field.name}
    //                             type={field.type}
    //                             value={inputValues[field.name] || ''}
    //                             onChange={(e) => handleInputChange(field.name, e.target.value)}
    //                             fullWidth
    //                             size="small"
    //                         />
    //                         <FormHelperText>{validationErrors[field.name]}</FormHelperText>
    //                     </FormControl>
    //                 );
    //             case 'textarea':
    //                 return (
    //                     <FormControl key={index} fullWidth margin="dense" error={!!validationErrors[field.name]}>
    //                         <TextField
    //                             margin="dense"
    //                             label={field.label}
    //                             name={field.name}
    //                             value={inputValues[field.name] || ''}
    //                             onChange={(e) => handleInputChange(field.name, e.target.value)}
    //                             fullWidth
    //                             multiline
    //                             rows={4}
    //                         />
    //                         <FormHelperText>{validationErrors[field.name]}</FormHelperText>
    //                     </FormControl>
    //                 );
    //             case 'select':
    //                 return (
    //                     <FormControl key={index} fullWidth margin="dense" size="small" error={!!validationErrors[field.name]}>
    //                         <Autocomplete
    //                             size='small'
    //                             options={field.options || []}
    //                             getOptionLabel={(option) => option.label}
    //                             value={field?.options?.find(option => option.value === inputValues[field.name]) || null}
    //                             onChange={(event, newValue) => {
    //                                 handleInputChange(field.name, newValue ? newValue.value : '');
    //                             }}
    //                             renderInput={(params) => (
    //                                 <TextField
    //                                     {...params}
    //                                     label={field.label}
    //                                     error={!!validationErrors[field.name]}
    //                                     helperText={validationErrors[field.name]}
    //                                 />
    //                             )}
    //                         />
    //                     </FormControl>
    //                 );
    //             case 'file':
    //                 return (
    //                     <div key={index} style={{ margin: '16px 0' }}>
    //                         <input
    //                             type="file"
    //                             onChange={(e) => handleInputChange(field.name, e.target.files[0])}
    //                             accept={field.accept || 'image/*'}
    //                         />
    //                     </div>
    //                 );
    //             default:
    //                 return null;
    //         }
    //     });
    // };

    // const fields = renderFields();
    return (
        <div className='data-table'>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        {tableHead && tableHead.map((name, index) => (
                            <th key={index}>{name}</th>
                        ))}
                        <th>
                            Holat
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {/* <td>+</td> */}
                        {/* {tableHead && tableHead.map((name, index) => (
                            <td key={index}>
                                {renderFields().find(field => {
                                    console.log(field.props.children.map((child, index) => {
                                        console.log(child);
                                        // return child.props?.name === name;
                                    }))
                                })}
                            </td>
                        ))} */}


                        {/* <td>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddRow}
                                style={{ marginTop: '10px', marginLeft: '10px' }}
                            >
                                Saqlash
                            </Button>
                        </td> */}
                    </tr>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {item.row}
                            <td className='table-actions'>
                                <IconButton onClick={() => onEdit(item)}>
                                    <i className="fa-regular fa-pen-to-square" style={{ color: 'orange', fontSize: '18px' }}></i>
                                </IconButton>
                                <IconButton onClick={() => onDelete(item)}>
                                    <i className="fa-regular fa-trash-can" style={{ color: 'red', fontSize: '18px' }}></i>
                                </IconButton>
                                <IconButton onClick={() => onRowClick(item)}>
                                    <i className="fa-regular fa-eye" style={{ color: '#425BDD', fontSize: '18px' }}></i>
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;
