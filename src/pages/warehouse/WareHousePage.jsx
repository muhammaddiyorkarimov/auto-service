import React from 'react'
import Navbar from '../../components/navbar/Navbar'

function WareHousePage() {
    

    return (
        <div className='ware-house'>
            <main>
                <Navbar title="Ombor bo'limi" name="Husniddin" adminType="Super Admin" />
                <section>
                    {/* <DataTable tableHead={warehouse} /> */}
                </section>
            </main>
        </div>
    )
}

export default WareHousePage