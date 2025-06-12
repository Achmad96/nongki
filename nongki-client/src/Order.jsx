import { useState } from 'react';
import './Order.css';
import logo from './assets/logo.png';

function Order() {
    return (
        <div id='root'>
            <img src={logo} alt="Nongki Logo" className='logo' />
            <div className='card-order'>
                <h3 className='title-order'>Booking Space</h3>
            </div>
            <div className='order-container'>
                <div className='input-group'>
                    <label htmlFor='date'>Date</label>
                    <input type='date' className='input-date' />
                </div>

                <div className='input-group'>
                    <label htmlFor='time'>Time Start</label>
                    <select className='input-time'>
                        <option value='08:00'>08:00</option>
                        <option value='09:00'>09:00</option>
                        <option value='10:00'>10:00</option>
                        <option value='11:00'>11:00</option>
                        <option value='12:00'>12:00</option>
                        <option value='13:00'>13:00</option>
                        <option value='14:00'>14:00</option>
                        <option value='15:00'>15:00</option>
                    </select>
                </div>

                    <label htmlFor='to'>To</label>

                <div className='input-group'>
                    <label htmlFor='to'>Time End</label>
                    <select className='input-to'>
                        <option value='09:00'>09:00</option>
                        <option value='10:00'>10:00</option>
                        <option value='11:00'>11:00</option>
                        <option value='12:00'>12:00</option>
                        <option value='13:00'>13:00</option>
                        <option value='14:00'>14:00</option>
                        <option value='15:00'>15:00</option>
                        <option value='16:00'>16:00</option>
                    </select>
                </div>

                <div className='input-group'>
                    <label htmlFor='kind-space'>Kind Of Space</label>
                    <select className='input-kind-space'>
                        <option value=''>Select Space</option>
                        <option value='Desk'>Desk</option>
                        <option value='Group Desk'>Group Desk</option>
                        <option value='Meeting Room'>Meeting Room</option>
                    </select>
                </div>

                <div className='input-group'>
                    <label htmlFor='category'>Category</label>
                    <select className='input-category'>
                        <option value=''>Select Category</option>
                        <option value='VIP'>VIP</option>
                        <option value='nonVIP'>Non VIP</option>
                    </select>
                </div>

                <div className='description-section'>
                    <label>Description</label>
                </div>

                <div className='price-section'>
                    <label>Price</label>
                </div>

                <div className='facility-section'>
                    <label>Facility</label>
                </div>
            </div>
        </div>
    )
}

export default Order;