import { IconButton } from '@mui/material';
import NotAvailable from '../../helpers/notAvailable/NotAvailale';
import './DataTable.css';
import { Delete, Edit } from '@mui/icons-material';
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
                    {data.map((item, index) => (
                        <tr key={index} onClick={() => onRowClick(item)}>
                            {item.row}
                            <td style={{ display: 'flex', alignItems: 'center' }} >
                                <IconButton onClick={() => onEdit(item)}>
                                    <Edit style={{ color: 'orange' }} />
                                </IconButton>
                                <IconButton onClick={() => onDelete(item)}>
                                    <Delete style={{ color: 'red' }} />
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
