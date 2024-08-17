import { IconButton, TextField } from '@mui/material';
import NotAvailable from '../../helpers/notAvailable/NotAvailale';
import './DataTable.css';
import Loader from '../../helpers/loader/Loader';

function DataTable({ loading, error, tableHead, data, onDelete, onEdit, onRowClick }) {

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <NotAvailable message="Xatolik yuz berdi, ma'lumotni olishda muammo mavjud." />;
    }

    if (!data || data.length === 0) {
        return <NotAvailable message="Ma'lumot topilmadi" />;
    }

    return (
        <div className='data-table'>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        {tableHead && tableHead.map((name, index) => (
                            <th key={index}>{name}</th>
                        ))}
                        <th>Holat</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                        <td><TextField size=''/></td>
                        <td><TextField size=''/></td>
                        <td><TextField size=''/></td>
                        <td><TextField size=''/></td>
                        <td><TextField size=''/></td>
                        <td><TextField size=''/></td>
                        <td><TextField size=''/></td>
                    </tr> */}
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
