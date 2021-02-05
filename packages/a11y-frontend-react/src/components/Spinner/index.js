import React from 'react';
import spinner from '../../assets/spinner.gif';

const Spinner = () => {
    return (
        <img alt="Spinner" src={spinner} style={{ width: '20px', height: '20px' }} />
    );
};

export default Spinner;