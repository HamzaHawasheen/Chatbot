import React from 'react';

const CustomOption = ({ optionText }) => {
    return (
        <div style={{ padding: '10px', background: 'lightblue', borderRadius: '5px', margin: '5px 0' }}>
            {optionText}
        </div>
    );
};

export default CustomOption;
