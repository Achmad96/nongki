import { useState } from 'react';
import './Order.css';
import logo from './assets/logo.png';

function Order() {
    return (
        <div className='order-page'>
            <div className='order-content-warpper'>
                <img src={logo} alt="Nongki Logo" className='logo-order' />
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

                    <div className='to-label-container'>
                        To
                    </div>

                    <div className='input-group'>
                        <label htmlFor='time-end'>Time End</label>
                        <select className='input-time-end'>
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

                    <div className='input-group description-section'>
                        <label>Description</label>
                        <p className='description-text'>
                            Please fill in the details of your booking, including any specific requirements or preferences you may have.
                        </p>
                    </div>

                    <div className='input-group facility-section'>
                        <label>Facility</label>
                        <p className='facility-text'>
                            Free Wi-Fi, Coffee, and Snacks
                        </p>
                    </div>

                    <div className='input-group price-section'>
                        <label>Price</label>
                        <p className='price-text'>
                            Rp. 100.000
                        </p>
                    </div>

                    <button className='btn-check'>Check</button>
                </div>
            </div>
        </div>
    )
}

export default Order;