import React from 'react';
import '../stylesheets/login.css'

const footer= () =>{
    return (
        <div className="footer">
            <h2 className="footer__logo"><span className="hidden">City Data Hub</span></h2>
            <ul className="mark__list">
                <li className="mark__item"><span className="hidden">국토교통부</span></li>
                <li className="mark__item"><span className="hidden">KAIA</span></li>
                <li className="mark__item"><span className="hidden">KETI</span></li>
            </ul>
            <p className="footer__copyright">Copyright©SmartCity Datahub. All rights reserved.</p>
        </div>
    )
}

export default footer;